from datetime import timedelta
from celery import shared_task
from django.utils import timezone

from api.router_requests import interceptor_requests
from emails.models import EmailConfiguration
from emails.views import send_dynamic_email
from dhcp_server.models import Network
from static_packages.models import StaticPackage
from payment.models import PaymentDetails
from sms.models import SuspendedSMS
from sms.views import bulk_sms, render_template
from .models import DHCPService

@shared_task
def suspend_dhcp_clients():
    try:
        payment_details = PaymentDetails.objects.get(custom_id=1)
        template_text = SuspendedSMS.objects.get(custom_id=1).message
        short_code = payment_details.short_code
        
    except PaymentDetails.DoesNotExist:
        print("payment details has not yet been set")
        
    except SuspendedSMS.DoesNotExist:
        print("Send suspended SMS has not yet been set")
    
    now = timezone.now()
    clients_to_suspend = DHCPService.objects.filter(suspension_date__lte=now, is_suspended=False)
    for client in clients_to_suspend:
        try:
            service_package = StaticPackage.objects.get(name=client.package)
            service_id = client.pk
            
            first_name = client.client.first_name
            last_name = client.client.last_name
            phone = client.client.phone
            price = service_package.price
            expiry = service_package.expiry
            
            if client.client.balance < price:
                response, error = suspend_client(client=service_id)
                
                if error:
                    print({"error": f"{error}"})
                    return

                client.is_suspended = True
                client.save()
                acc_no = client.client.custom_id
                context = {"first_name": first_name, "last_name": last_name, "paybill": short_code, "acc_no": acc_no, "price": price}
                rendered_text = render_template(template_text=template_text, context=context)        
                bulk_sms(mobile_list=[phone,], message=rendered_text)
            else:
                client.client.balance -= price
                client.client.save()
                
                client.due_date = now + timezone.timedelta(days=expiry)
                client.suspension_date = now + timezone.timedelta(days=expiry)
                client.save()
                
            
        except StaticPackage.DoesNotExist:
            print(f"Package {client.package} does not exist")
        

# @shared_task
# def deduct_ppp_subscription_fees():
#     now = timezone.now()
#     clients_to_charge = PPPService.objects.filter(due_date__lte=now)
#     for client in clients_to_charge:
#         subscription = PPPProfile.objects.get(profile=client.profile)
#         subscription_fee = subscription.price
#         client.balance -= subscription_fee
#         client.due_date = now + timezone.timedelta(days=30)  # Assuming a 30-day cycle
#         client.save()

@shared_task
def dhcp_near_due():
    try:
        payment_details = PaymentDetails.objects.get(custom_id=1)
        template_text = SuspendedSMS.objects.get(custom_id=1).message
        short_code = payment_details.short_code
    except PaymentDetails.DoesNotExist:
        print("Payment details have not yet been set")
        return
    
    except SuspendedSMS.DoesNotExist:
        print("Send suspended SMS has not yet been set")
        return

    now = timezone.now()
    one_day_before = now + timedelta(days=1)
    
    # Filter for clients whose suspension_date is exactly one day from now and not suspended yet
    clients_to_notify = DHCPService.objects.filter(
        suspension_date__date=one_day_before.date(),  # Check for date match (ignores time)
        is_suspended=False
    )
    
    for client in clients_to_notify:
        first_name = client.client.first_name
        last_name = client.client.last_name
        phone = client.client.phone
        email = client.client.email
        suspension_date = client.suspension_date
        
        try:
            service_package = StaticPackage.objects.get(name=client.package)
            price = service_package.price
            
        except StaticPackage.DoesNotExist:
            print(f"Package {client.package} does not exist for client {client.id}")
            continue
        
        acc_no = client.client.custom_id
        context = {
            "suspension_date": suspension_date,
            "first_name": first_name,
            "last_name": last_name,
            "paybill": short_code,
            "acc_no": acc_no,
            "price": price,
        }
        
        # Render the SMS template with the context
        rendered_text = render_template(template_text=template_text, context=context)        
        
        # Send SMS
        bulk_sms(mobile_list=[phone,], message=rendered_text)
        
        # send email
        subject = "Service Near Due"
        email_config = EmailConfiguration.objects.get(is_active=True)
        recipient_list = [email, ]
        send_dynamic_email(subject=subject, email_config=email_config, message=rendered_text, recipient_list=recipient_list)


def suspend_client(client):
    try:
        service = DHCPService.objects.get(pk=client)
        service_name = service.name
        
        ip_prefix = ".".join(service.ip_address.split(".")[0:3])
        
        network = Network.objects.get(address__startswith=ip_prefix)
            
        network_limit = network.default_limit
        
        service_response = interceptor_requests("get", path=f"queue/simple?name={service_name}")
        
        if service_response.json() == []:
            raise ValueError(f"Could not find service with name {service_name}")
        
        service_id = service_response.json()[0][".id"]
        
        suspend_data = {"max-limit": network_limit}
        
        suspend_response = interceptor_requests("patch", path=f"queue/simple/{service_id}", json=suspend_data)
        
        if suspend_response.status_code != 200:
            raise ValueError(suspend_response.json()["detail"])
        
        return {"message": "client suspended successfully"}, None
    
    except Exception as e:
        return None, str(e)

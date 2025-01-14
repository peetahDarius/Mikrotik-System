from datetime import timedelta
from celery import shared_task
from django.utils import timezone

from api.router_requests import interceptor_requests
from emails.models import EmailConfiguration
from emails.views import send_dynamic_email
from payment.models import PaymentDetails
from sms.models import SuspendedSMS
from sms.views import bulk_sms, render_template
from ppp_profile.models import PPPProfile
from .models import PPPService

@shared_task
def suspend_ppp_clients():
    try:
        payment_details = PaymentDetails.objects.get(custom_id=1)
        template_text = SuspendedSMS.objects.get(custom_id=1).message
        short_code = payment_details.short_code
        
    except PaymentDetails.DoesNotExist:
        print("payment details has not yet been set")
        
    except SuspendedSMS.DoesNotExist:
        print("Send suspended SMS has not yet been set")
    
    now = timezone.now()
    clients_to_suspend = PPPService.objects.filter(suspension_date__lte=now, is_suspended=False)
    for client in clients_to_suspend:
        service_id = client.pk
        try:
            service_profile = PPPProfile.objects.get(name=client.profile)
            
            first_name = client.client.first_name
            last_name = client.client.last_name
            phone = client.client.phone
            price = service_profile.price
            expiry = service_profile.expiry
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
                
            
        except PPPProfile.DoesNotExist:
            print(f"PPP profile {client.profile} does not exist")
        

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
def ppp_near_due():
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
    clients_to_notify = PPPService.objects.filter(
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
            service_profile = PPPProfile.objects.get(name=client.profile)
            price = service_profile.price
        except PPPProfile.DoesNotExist:
            print(f"PPP profile {client.profile} does not exist for client {client.id}")
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
        service = PPPService.objects.get(id=client)
        service_name = service.username
        service_response = interceptor_requests("get", f"ppp/secret?name={service_name}")
            
        if len(service_response.json()) == 0:
            raise ValueError(f"Could not find client with name {service_name}")
        
        service_id = service_response.json()[0][".id"]
        
        disable_data = {"disabled": True}
        disable_client_response = interceptor_requests("patch", f"ppp/secret/{service_id}", json=disable_data)
        
        if disable_client_response.status_code != 200:
            raise ValueError("Could not disable client")
        
        active_response = interceptor_requests("get", f"ppp/active?name={service_name}")
        
        if len(active_response.json()) != 0:
            active_connection_id = active_response.json()[0][".id"]
            
            deactivate_response = interceptor_requests("delete", f"ppp/active/{active_connection_id}")
            
            if deactivate_response.status_code != 204:
                raise ValueError("Could not deactivate client")

    except Exception as e:
        return None, str(e)

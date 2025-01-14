from django.shortcuts import render
from decimal import Decimal
from datetime import datetime
from rest_framework import  status, generics, mixins
from rest_framework.permissions import AllowAny, IsAuthenticated

from client.models import Client
from sms.models import PaymentReceivedSMS
from sms.views import bulk_sms, render_template
from ppp_service.views import activate_client

from .serializers import MpesaPaymentSerializer, PPPServicePaymentLogsSerializer, PaymentDetailsSerializer
from ppp_service.models import PPPService
from .models import MpesaC2B, MpesaPayment, CashPayment, PPPServicePaymentLogs, PaymentDetails
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import APIView, api_view, permission_classes
from django.utils import timezone
from django.db import transaction

# Create your views here.
    
@api_view(http_method_names=['POST'])
@permission_classes([AllowAny, ])
def confirm(request:Request):
    data = request.data
    trans_id = data["TransID"]
    transaction_time = data["TransTime"]
    amount = data["TransAmount"]
    number_sending = data["MSISDN"]
    account_number = data["BillRefNumber"]
    # first_name = data["FirstName"]
    # middle_name = data["MiddleName"]
    # last_name = data["LastName"]
    # print(f"{first_name} {middle_name} {last_name} of number {number_sending} has sent Ksh{amount} at time {transaction_time}")
    # write to a file
    print("[+] Safaricom callback data...")
    print(data)
    mpesa_payment(account_no=account_number, amount=Decimal(amount), paid_date=transaction_time, receipt=trans_id)

    result =  {
        "ResultCode": 0,
        "ResultDesc": "Accepted"
    }
    return Response(data=result, status=status.HTTP_200_OK)


@api_view(http_method_names=['POST'])
@permission_classes([AllowAny, ])
def validate(request):
    data = request.data
    print(data)
    # file = open('validate.json', 'a')
    # file.write(json.dumps(data))
    # file.close()
    result = {
        "ResultCode": 0,
        "ResultDesc": "Accepted"
    }
    return Response(data=result, status=status.HTTP_200_OK)
    

@api_view(http_method_names=['GET'])
@permission_classes([AllowAny, ])
def register_url(request:Request):
    try:
        details = PaymentDetails.objects.get(custom_id=1)
        consumer_key = details.consumer_key
        consumer_secret = details.consumer_secret
        confirmation_url = details.confirmation_url
        validation_url = details.validation_url
        business_short_code = details.short_code
        response_type = "Completed"  # or Cancelled
    except PaymentDetails.DoesNotExist:
        consumer_key = 'UZA8PkvUqcYAGrKalVifW3VqbGY1W0Mg59EYfq8XGuk1mykF'
        consumer_secret = 'R4onxlM8JCiAoyXDtSGBnKwfE0pviQ7tSl2yQs8ZTdAjtpAKZDWLyyv7hN0DyWja'
        confirmation_url = "https://fc8f5d92d59c4142bdfad97e5f467d07.serveo.net/api/payment/confirm/"
        validation_url = "https://fc8f5d92d59c4142bdfad97e5f467d07.serveo.net/api/payment/validate/"
        business_short_code = "601426"
        response_type = "Completed"  # or Cancelled

    mpesa_obj = MpesaC2B(consumer_key=consumer_key, consumer_secret=consumer_secret)
    register_url_response = mpesa_obj.register_url(confirmation_endpoint=confirmation_url,
                                                   validation_endpoint=validation_url,
                                                   short_code=business_short_code,
                                                   response_type=response_type)
    return Response(data=register_url_response, status=status.HTTP_200_OK)


@api_view(http_method_names=['GET'])
@permission_classes([AllowAny, ])
def simulate(request:Request):
    try:
        details = PaymentDetails.objects.get(custom_id=1)
        consumer_key = details.consumer_key
        consumer_secret = details.comsumer_secret
        business_short_code = details.short_code
    except PaymentDetails.DoesNotExist:
        consumer_key = 'UZA8PkvUqcYAGrKalVifW3VqbGY1W0Mg59EYfq8XGuk1mykF'
        consumer_secret = 'R4onxlM8JCiAoyXDtSGBnKwfE0pviQ7tSl2yQs8ZTdAjtpAKZDWLyyv7hN0DyWja'
        business_short_code = "601426"
        
    amount = 1
    command_id = "CustomerPayBillOnline"
    bill_ref_no = "Testpay"
    phone_number = "254708374149"
    

    mpesa_obj = MpesaC2B(consumer_key=consumer_key, consumer_secret=consumer_secret)
    mpesa_obj.short_code = business_short_code
    mpesa_obj_response = mpesa_obj.simulate_transaction(amount=amount,
                                                        command_id=command_id,
                                                        bill_ref_no=bill_ref_no,
                                                        msisdn=phone_number)
    return Response(data=mpesa_obj_response, status=status.HTTP_200_OK)


# callback example: {'TransactionType': 'Pay Bill', 'TransID': 'SHG67UAA3Q', 'TransTime': '20240816003443', 'TransAmount': '2000.00', 'BusinessShortCode': '4080175', 'BillRefNumber': 'AN00531', 'InvoiceNumber': '', 'OrgAccountBalance': '4500.00', 'ThirdPartyTransID': '', 'MSISDN': '2547 ***** 465', 'FirstName': 'JAMES'}
# the comand to suspend a client [/tool fetch url="https://d190-41-209-60-82.ngrok-free.app/api/payment/suspend/" http-method=post http-data="name=SkXMHZLB&suspendedAccount=10MB-Profile" keep-result=no]

@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated, ])
def create_cash_payment(request:Request):
    data = request.data
    client_id = data.get("client")
    if not client_id:
        return Response({"error": "client id is needed"}, status=status.HTTP_400_BAD_REQUEST)
    
    amount = Decimal(data.get("amount"))
    description = data.get("description")
    
    try:
        client = Client.objects.get(id=client_id)
        first_name = client.first_name
        last_name = client.last_name
        phone = client.phone
        time = timezone.now()
        
        # save to cash payment
        new_cash_payment = CashPayment(amount=amount, client=client, description=description)
        new_cash_payment.save()
        
        client.balance += amount
        client.save()
        
        # save to logs
        payment_log = PPPServicePaymentLogs(amount=amount, account=client, description=description, payment_method="cash")
        payment_log.save()
        
        template_text = PaymentReceivedSMS.objects.get(custom_id=1).message
        context = {"first_name": first_name, "last_name": last_name, "amount": amount, "time": time}
        rendered_text = render_template(template_text=template_text, context=context)
        
        # bulk_sms(mobile_list=[phone,], message=rendered_text)
        serializer = PPPServicePaymentLogsSerializer(instance=payment_log)
    
    except PaymentReceivedSMS.DoesNotExist:
        return Response({"error": "Send payment received SMS has not been set."}, status=status.HTTP_400_BAD_REQUEST)
    
    except Client.DoesNotExist:
        return Response({"error": f"Client [{client_id}] does not exist"}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(data=serializer.data, status=status.HTTP_201_CREATED)


def mpesa_payment(account_no, amount, paid_date, receipt):
    try:
        client = Client.objects.get(custom_id=account_no)
        date_received = timezone.make_aware(datetime.strptime(paid_date, "%Y%m%d%H%M%S"))
        new_mpesa_payment = MpesaPayment(time=date_received, amount=amount, receipt=receipt, client=client)
        new_mpesa_payment.save()
        
        client.balance += amount
        client.save()
        
        payment_log = PPPServicePaymentLogs(amount=amount, account=client, receipt=receipt, payment_method="mpesa")
        payment_log.save()
        
        first_name = client.first_name
        last_name = client.last_name
        phone = client.phone
        time = timezone.now()
        
        template_text = PaymentReceivedSMS.objects.get(custom_id=1).message
        context = {"first_name": first_name, "last_name": last_name, "amount": amount, "time": time}
        rendered_text = render_template(template_text=template_text, context=context)
        
        bulk_sms(mobile_list=[phone,], message=rendered_text)
        is_ppp_service_suspended(account_no=client.pk)
    
    except PaymentReceivedSMS.DoesNotExist:
        return Response({"error": "Send payment received SMS has not been set."}, status=status.HTTP_400_BAD_REQUEST)
    
    except Client.DoesNotExist:
        print(f"client {account_no} does not exist")
        
    except Exception as e:
        print(f"An Exception has occured: {e}")
    
    return 



def is_ppp_service_suspended(account_no):
    try:
        pppService = PPPService.objects.get(id=account_no)
        if pppService.is_suspended:
            activate_client(pppService.pk)
            
    except PPPService.DoesNotExist:
        print(f"service {pppService.pk} does not exist")
    except Exception as e:
        print(f"An error has occured at 'is_client_suspended': {e}")
        
        
class ListMPesaPaymentsView(generics.GenericAPIView, mixins.ListModelMixin):
    
    serializer_class = MpesaPaymentSerializer
    queryset = MpesaPayment.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    

class RetrieveMpesaPaymentView(generics.GenericAPIView, mixins.RetrieveModelMixin):
    
    serializer_class = MpesaPaymentSerializer
    queryset = MpesaPayment.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get_object(self):
        receipt = self.kwargs.get("receipt")
        return generics.get_object_or_404(MpesaPayment, receipt=receipt)
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    

class ListPaymentLogsView(generics.GenericAPIView, mixins.ListModelMixin):
    serializer_class = PPPServicePaymentLogsSerializer
    queryset = PPPServicePaymentLogs.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    

class RetrievePaymentLogsView(generics.GenericAPIView, mixins.RetrieveModelMixin):
    serializer_class = PPPServicePaymentLogsSerializer
    queryset = PPPServicePaymentLogs.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    

class ListCreatePaymentDetailsView(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    
    serializer_class = PaymentDetailsSerializer
    queryset = PaymentDetails.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        with transaction.atomic():
            PaymentDetails.objects.all().delete()
            return self.create(request, *args, **kwargs)
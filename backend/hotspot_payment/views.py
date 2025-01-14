from django.shortcuts import render

from .serializers import MpesaExpressCredentialsSerializer, PaymentsSerializer
from .models import MpesaExpress, MpesaExpressCredentials, Payment
from rest_framework import generics, mixins
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.utils.dateparse import parse_datetime

# Create your views here.

class ListCreateMpesaExpressCredentials(generics.GenericAPIView, mixins.CreateModelMixin, mixins.ListModelMixin):
    
    serializer_class = MpesaExpressCredentialsSerializer
    queryset = MpesaExpressCredentials.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        with transaction.atomic():
            MpesaExpressCredentials.objects.all().delete()
            return self.create(request, *args, **kwargs)


class DestroyMpesaExpressCredentialsView(generics.GenericAPIView, mixins.DestroyModelMixin):
    serializer_class = MpesaExpressCredentialsSerializer
    queryset = MpesaExpressCredentials.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

def stk_initiate(amount, phone_number):
    try:
        credentials = MpesaExpressCredentials.objects.get(custom_id=1)
        json_data = {
            "amount": amount,  # The amount of money to be transacted
            "phone_number": phone_number,  # The phone number of the client/customer
            "party_b": credentials.party_b,  # Business short code [will be provided to you by mpesa('174379 is used in the daraja 2.0
            # sandbox').]
            "callback_url": credentials.callback_url,
            # The url that will recieve the mpesa expresss transaction, confirmation.
            "account_reference": credentials.account_reference,  # The Accounts reference. usually the business's name[paybill/tillNo name].
            "transaction_desc": credentials.transaction_desc,  # Transaction description.
            "transaction_type": credentials.transaction_type,
            # CustomerPayBillOnline means using a Paybill and CustomerBuyGoodsOnline means using a Till number
            "short_code": credentials.short_code,  # This is the business short code that will be provided to you by mpesa
            "pass_key": credentials.pass_key  # will also be provided to you.
        }
        consumer_key = credentials.consumer_key
        consumer_secret = credentials.consumer_secret
        MpesaExpress.production_urls(authorization_url='https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', stk_initiate_url='https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest')
        mpesaobj = MpesaExpress(consumer_key=consumer_key, consumer_secret=consumer_secret)
        response = mpesaobj.initiate_transaction(json_data=json_data)
        return response
    except MpesaExpressCredentials.DoesNotExist:
        return {"error": "mpesa credentials have not been set"}
    
# # if using the code for production ( we must change the mpesa endpoints)
# def stk_iniitiate():
#     consumer_key = 'GVdkmTSajtHRd3665YdQrvbbBisNAGz0ubC'
#     consumer_secret = 'VlK6efsGw1Hg745V'
#     MpesaExpress.production_urls(authorization_url='https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
#                              stk_initiate_url='https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest')
#     mpesaobj = MpesaExpress(consumer_key=consumer_key, consumer_secret=consumer_secret)
#     response = mpesaobj.initiate_transaction(json_data=json_data)
#     return response

class ListPaymentsView(generics.GenericAPIView, mixins.ListModelMixin):
    
    serializer_class = PaymentsSerializer
    queryset = Payment.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get_queryset(self):
        queryset = Payment.objects.all()
        
        # Get the time_from and time_to query parameters
        time_from = self.request.query_params.get('time_from')
        time_to = self.request.query_params.get('time_to')
        
        # Filter based on time_from and time_to if they are provided
        if time_from and time_to:
            try:
                time_from = parse_datetime(time_from)
                time_to = parse_datetime(time_to)
                if time_from and time_to:
                    queryset = queryset.filter(created_at__range=(time_from, time_to))
            except ValueError:
                pass  # Handle invalid datetime format here if needed
        
        return queryset
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
class RetrievePaymentsView(generics.GenericAPIView, mixins.RetrieveModelMixin):
    
    serializer_class = PaymentsSerializer
    queryset = Payment.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get_object(self):
        receipt = self.kwargs.get("receipt")
        return generics.get_object_or_404(Payment, receipt_number=receipt)
        
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

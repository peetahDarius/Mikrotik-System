import os
from django.shortcuts import render
from httpx import request
import requests
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status, generics, mixins
from rest_framework.permissions import AllowAny
from django.template import Template, Context

from .models import SMS, ActivateServiceSMS, CreateClientSMS, CreateServiceSMS, NearDueSMS, PaymentReceivedSMS, SMSCredentials, SuspendedSMS
from .serializers import ActivateServiceSerializer, CreateClientSMSSerializer, NearDueSMSSerializer, PaymentReceivedSMSSerializer, CreateServiceSMSSerializer, SMSCredentialsSerializer, SMSSerializer, SuspendedSMSSerializer
from django.db import transaction


def render_template(template_text, context):
    template = Template(template_text)
    context = Context(context)
    return template.render(context)

# Create your views here.

@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def get_sent_sms(request:Request):
    from_time = request.data.get("from_time")
    to_time = request.data.get("to_time")
    if not from_time:
        return Response({"error": "from time is needed"}, status=status.HTTP_400_BAD_REQUEST)
    
    if not to_time:
        return Response({"error": "to time is needed"}, status=status.HTTP_400_BAD_REQUEST)
    
    sent_sms = SMS.objects.filter(created_at__gte=from_time, created_at__lte=to_time)
    serializer = SMSSerializer(sent_sms, many=True)
    return Response(data=serializer.data, status=status.HTTP_200_OK)

@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def send_sms(request: Request):
    data = request.data
    mobile_list = data.get("numbers", [])
    message = data.get("message", "")

    if not mobile_list or not message:
        return Response({"error": "Numbers and message are required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        response = bulk_sms(mobile_list=mobile_list, message=message)
        return Response(response, status=status.HTTP_200_OK)
    
    except requests.RequestException() as e:
        return Response({"error": "Failed to send SMS due to a network issue."}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



def bulk_sms(mobile_list, message):
    try:
        credentials = SMSCredentials.objects.get(custom_id=1)
        user_id = credentials.user_id
        sender_id = credentials.sender_id
        password = credentials.password
    except SMSCredentials.DoesNotExist:
        sender_id = ""
        user_id = ""
        password = ""
    
    data = {
        "userid": user_id,
        "password": password,
        "senderid": sender_id,
        "msgType": "text",
        "duplicatecheck": "true",
        "sendMethod": "quick",
        "sms": [
            {
                "mobile": mobile_list,
                "msg": message
            }
        ]
    }
    response = requests.post("https://smsportal.hostpinnacle.co.ke/SMSApi/send", json=data)
    sms = SMS(message=message, numbers=mobile_list)
    sms.length = len(mobile_list)
    sms.save()
    return response.json()

    
@api_view(http_method_names=["GET"])
@permission_classes([AllowAny, ])
def create_client_options(request:Request):
    options = {
        "options": ["{{first_name}}", "{{last_name}}"]
    }
    return Response(data=options, status=status.HTTP_200_OK)

@api_view(http_method_names=["GET"])
@permission_classes([AllowAny, ])
def create_service_options(request:Request):
    options = {
        "options": ["{{first_name}}", "{{last_name}}", "{{paybill}}", "{{acc_no}}", "{{price}}", "{{created_at}}", "{{updated_at}}"]
    }
    return Response(data=options, status=status.HTTP_200_OK)

@api_view(http_method_names=["GET"])
@permission_classes([AllowAny, ])
def near_due_options(request:Request):
    options = {
        "options": ["{{first_name}}", "{{last_name}}", "{{paybill}}", "{{acc_no}}", "{{price}}", "{{suspension_date}}"]
    }
    return Response(data=options, status=status.HTTP_200_OK)

@api_view(http_method_names=["GET"])
@permission_classes([AllowAny, ])
def suspended_options(request:Request):
    options = {
        "options": ["{{first_name}}", "{{last_name}}", "{{paybill}}", "{{acc_no}}", "{{price}}"]
    }
    return Response(data=options, status=status.HTTP_200_OK)


@api_view(http_method_names=["GET"])
@permission_classes([AllowAny, ])
def payment_received_options(request:Request):
    options = {
        "options": ["{{first_name}}", "{{last_name}}", "{{amount}}", "{{time}}"]
    }
    return Response(data=options, status=status.HTTP_200_OK)


@api_view(http_method_names=["GET"])
@permission_classes([AllowAny, ])
def activate_service_options(request:Request):
    options = {
        "options": ["{{first_name}}", "{{last_name}}", "{{service_name}}"]
    }
    return Response(data=options, status=status.HTTP_200_OK)

class ListCreateClientSMSView(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    serializer_class = CreateClientSMSSerializer
    queryset = CreateClientSMS.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        with transaction.atomic():
            CreateClientSMS.objects.all().delete()
            return self.create(request, *args, **kwargs)
        

class ListCreateServiceSMSView(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    serializer_class = CreateServiceSMSSerializer
    queryset = CreateServiceSMS.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        with transaction.atomic():
            CreateServiceSMS.objects.all().delete()
            return self.create(request, *args, **kwargs)
        
class ListCreateNearDueSMSView(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    serializer_class = NearDueSMSSerializer
    queryset = NearDueSMS.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        with transaction.atomic():
            NearDueSMS.objects.all().delete()
            return self.create(request, *args, **kwargs)
        
class ListCreateSuspendedSMSView(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    serializer_class = SuspendedSMSSerializer
    queryset = SuspendedSMS.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        with transaction.atomic():
            SuspendedSMS.objects.all().delete()
            return self.create(request, *args, **kwargs)
        
class ListCreatePaymentReceivedSMSView(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    serializer_class = PaymentReceivedSMSSerializer
    queryset = PaymentReceivedSMS.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        with transaction.atomic():
            PaymentReceivedSMS.objects.all().delete()
            return self.create(request, *args, **kwargs)
        

class ListCreateSMSCredentialsView(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    serializer_class = SMSCredentialsSerializer
    queryset = SMSCredentials.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        with transaction.atomic():
            SMSCredentials.objects.all().delete()
            return self.create(request, *args, **kwargs)
        
class ListCreateActivateServiceSMSView(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    serializer_class = ActivateServiceSerializer
    queryset = ActivateServiceSMS.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        with transaction.atomic():
            ActivateServiceSMS.objects.all().delete()
            return self.create(request, *args, **kwargs)
        

@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated, ])
def get_sms_account_data(request:Request):
    try:
        credentials = SMSCredentials.objects.get(custom_id=1)
        user_id = credentials.user_id
        password = credentials.password
        response = requests.get(f"https://smsportal.hostpinnacle.co.ke/SMSApi/account/readstatus?userid={user_id}&password={password}&output=json")
        data = response.json()["response"]["account"]
        return Response(data=data, status=status.HTTP_200_OK)
    
    except SMSCredentials.DoesNotExist:
        return Response({"error": "SMS credetials have not yet been set"})
        
    except Exception as e:
        return Response({"error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)
    
from django.shortcuts import render
from rest_framework import generics, status, mixins
from rest_framework.permissions import IsAuthenticated
from .models import EmailConfiguration, SendEmail
from .serializers import EmailConfigurationSerializer, SendEmailSerializer
from rest_framework.request import Request
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes

class ListCreateEmailConfigurationsView(generics.GenericAPIView, mixins.CreateModelMixin, mixins.ListModelMixin):
    
    serializer_class = EmailConfigurationSerializer
    queryset = EmailConfiguration.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def post(self, request, *args, **kwargs):
        is_active = request.data.get("is_active")
        if is_active is True:
            is_active_exists = EmailConfiguration.objects.filter(is_active=True)
            if is_active_exists.exists():
                return Response({"error": "A default email is set already. First disable the default email to proceed"}, status=status.HTTP_409_CONFLICT)
            
        return self.create(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    
class RetrieveUpdateDeleteEmailConfigurationView(generics.GenericAPIView, mixins.UpdateModelMixin, mixins.RetrieveModelMixin, mixins.DestroyModelMixin):
    
    serializer_class = EmailConfigurationSerializer
    queryset = EmailConfiguration.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
    

class ListCreateSendEmailView(generics.GenericAPIView, mixins.CreateModelMixin, mixins.ListModelMixin):
    
    serializer_class = SendEmailSerializer
    queryset = SendEmail.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def post(self, request, *args, **kwargs):
        from_email = request.data.get("from_email")
        subject = request.data.get("subject")
        message = request.data.get("message")
        recipient_list = request.data.get("recipient_list", [])
        if not from_email:
            return Response({"error": "from_email is required"}, status=status.HTTP_400_BAD_REQUEST)
        if not subject:
            return Response({"error": "subject is required"}, status=status.HTTP_400_BAD_REQUEST)
        if not message:
            return Response({"error": "message is required"}, status=status.HTTP_400_BAD_REQUEST)
        if not recipient_list:
            return Response({"error": "recipient_list is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            email_config = EmailConfiguration.objects.get(email_host_user=from_email)
            send_email_response = send_dynamic_email(subject=subject, message=message, email_config=email_config, recipient_list=recipient_list)
            if send_email_response != 1:
                raise ValueError("could not send the email. please check your smtp configuration")
            
            return Response(status=status.HTTP_201_CREATED)
        
        except EmailConfiguration.DoesNotExist:
            return Response({"error": f"from_email ({from_email}) not configured"})
        
        except Exception as e:
            return Response({"error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)
            
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    

class RetrieveUpdateDestroySendEmailView(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.DestroyModelMixin):
    
    serializer_class = SendEmailSerializer
    queryset = SendEmail.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
    

# function that actually sends the email
def send_dynamic_email(subject, message, recipient_list, email_config ):
    settings.EMAIL_HOST = email_config.email_host
    settings.EMAIL_PORT = email_config.email_port
    settings.EMAIL_USE_TLS = email_config.use_tls
    settings.EMAIL_HOST_USER = email_config.email_host_user
    settings.EMAIL_HOST_PASSWORD = email_config.email_host_password

    response = send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, recipient_list)
    sent_email = SendEmail(subject=subject, message=message, recipient_list=recipient_list)
    sent_email.length = len(recipient_list)
    sent_email.save()
    return response


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def get_sent_emails(request:Request):
    from_time = request.data.get("from_time")
    to_time = request.data.get("to_time")
    if not from_time:
        return Response({"error": "from time is needed"}, status=status.HTTP_400_BAD_REQUEST)
    
    if not to_time:
        return Response({"error": "to time is needed"}, status=status.HTTP_400_BAD_REQUEST)
    
    sent_email = SendEmail.objects.filter(created_at__gte=from_time, created_at__lte=to_time)
    data = []
    for email in sent_email:
        single_data = {
            "id": email.pk,
            "subject": email.subject,
            "message": email.message,
            "recipient_list": email.recipient_list,
            "created_at": email.created_at
        }
        data.append(single_data)
        
    return Response(data=data, status=status.HTTP_200_OK)
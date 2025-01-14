import jwt
import datetime
import random
import string
from django.shortcuts import get_object_or_404, render
import base64
from emails.models import EmailConfiguration
from emails.views import send_dynamic_email
from .models import User
from rest_framework import generics, mixins, status
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.decorators import permission_classes, api_view
from django.contrib.auth.hashers import check_password
from django.conf import settings

# Secret key to sign the JWT
SECRET_KEY = settings.SECRET_KEY

# Create your views here.

class CreateUserView(generics.GenericAPIView, mixins.CreateModelMixin, mixins.ListModelMixin ):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny, ]
    
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
    
    
class RetrieveUpdateDeleteUserView(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny, ]
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    
    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated, ])
def change_password_email_prompt(request:Request):
    url = request.data.get("url")
    email_config = EmailConfiguration.objects.get(is_active=True)
    email_address = [request.user.email]
    subject = "Password Recovery"
    characters = string.ascii_letters + string.digits
    random_string = ''.join(random.choices(characters, k=8))
    payload = {
        "userId": request.user.id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # Optional expiration
    }
    
    # Encode the payload using the secret key
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    new_url = f"{url}?userId={token}"
    message = f"""
        Greetings {request.user.username},

        Please use this link to reset your password: {new_url}
        Your one-time password is: {random_string}

        If you did not request this, please ignore this email.
        """
    send_email_response = send_dynamic_email(email_config=email_config, message=message, subject=subject, recipient_list=email_address)
    if send_email_response == 1:
        user = request.user
        user.set_password(random_string)
        user.save()
        return Response(status=status.HTTP_200_OK)
    else:
        return Response(data=send_email_response, status=status.HTTP_400_BAD_REQUEST)


@api_view(http_method_names=["POST"])
@permission_classes([AllowAny, ])
def check_email_for_password(request:Request):
    url = request.data.get("url")
    email_address = request.data.get("email")
    
    try:
        user = User.objects.get(email=email_address)
        email_config = EmailConfiguration.objects.get(is_active=True)
        subject = "Password Recovery"
        characters = string.ascii_letters + string.digits
        random_string = ''.join(random.choices(characters, k=8))
        payload = {
            "userId": user.pk,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # Optional expiration
        }
        
        # Encode the payload using the secret key
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
        new_url = f"{url}?userId={token}"
        message = f"""
            Greetings {user.username},

            Please use this link to reset your password: {new_url}
            Your one-time password is: {random_string}

            If you did not request this, please ignore this email.
            """
        send_email_response = send_dynamic_email(email_config=email_config, message=message, subject=subject, recipient_list=[email_address,])
        
        if send_email_response == 1:
            user.set_password(random_string)
            user.save()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(data=send_email_response, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response({"error": "User with this email does not exist"}, status=status.HTTP_404_NOT_FOUND)


@api_view(http_method_names=["POST"])
@permission_classes([AllowAny, ])
def change_password(request:Request):
    user_id = request.data.get("user_id")
    print("The user id is: ", user_id)
    existing_password = request.data.get("existing_password")
    new_password = request.data.get("new_password")
    
    user = User.objects.get(id=user_id)
    
    if not user.check_password(existing_password):
        return Response({"error": "new existing password does not match the provided password"}, status=status.HTTP_400_BAD_REQUEST)
    
    if existing_password == new_password:
        return Response({"error": "new Password shouldn't match the existing password"}, status=status.HTTP_400_BAD_REQUEST)
    
    user.set_password(new_password)
    user.save()
    
    return Response(status=status.HTTP_200_OK)

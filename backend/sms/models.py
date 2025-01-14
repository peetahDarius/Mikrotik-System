from django.db import models

# Create your models here.

class SMS(models.Model):
    message = models.TextField()
    numbers = models.TextField(help_text="Comma-separated mobile numbers")
    length = models.IntegerField( default=1 )
    created_at = models.DateTimeField(auto_now_add=True)


class CreateClientSMS(models.Model):
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    custom_id = models.IntegerField(default=1)
    

class CreateServiceSMS(models.Model):
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    custom_id = models.IntegerField(default=1)
    
    
class NearDueSMS(models.Model):
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    custom_id = models.IntegerField(default=1)
    

class SuspendedSMS(models.Model):
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    custom_id = models.IntegerField(default=1)
    
    
class PaymentReceivedSMS(models.Model):
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    custom_id = models.IntegerField(default=1)
    
class ActivateServiceSMS(models.Model):
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    custom_id = models.IntegerField(default=1)
    

class SMSCredentials(models.Model):
    user_id = models.CharField(max_length=150)
    sender_id = models.CharField(max_length=150)
    password = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    custom_id = models.IntegerField(default=1)
from django.db import models

# Create your models here.

class TempData(models.Model):
    mac = models.CharField(max_length=50)
    ap_mac = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=50)
    merchant_request_id = models.CharField(max_length=200)
    checkout_request_id = models.CharField(max_length=200)
    package = models.ForeignKey('hotspot_packages.Package', related_name="temp_data", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    

class UnifiCredentials(models.Model):
    host = models.CharField(max_length=50)
    port = models.IntegerField()
    version = models.CharField(max_length=50)
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=50)
    custom_id = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    

class SuccessfullConnection(models.Model):
    mac = models.CharField(max_length=50)
    ap_mac = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=50)
    package = models.ForeignKey('hotspot_packages.Package', related_name="connections", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    

class AccessPoints(models.Model):
    name = models.CharField(max_length=200)
    mac = models.CharField(max_length=150)
    ip = models.CharField(max_length=100)
    model = models.CharField(max_length=50)
    version = models.CharField(max_length=150)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

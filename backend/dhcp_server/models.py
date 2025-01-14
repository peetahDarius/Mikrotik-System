from django.db import models

# Create your models here.

class Server(models.Model):
    name = models.CharField(max_length=200)
    interface = models.CharField(max_length=150)
    pool = models.CharField(max_length=200)
    relay = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    

class Network(models.Model):
    address = models.CharField(max_length=200)
    gateway = models.CharField(max_length=200)
    primary_dns = models.CharField(max_length=100, null=True, blank=True)
    secondary_dns = models.CharField(max_length=100, null=True, blank=True)
    default_limit = models.CharField(max_length=100, default="1M/1M")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
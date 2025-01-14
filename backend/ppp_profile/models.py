from django.db import models

# Create your models here.

class PPPProfile(models.Model):
    name = models.CharField(max_length=150, unique=True)
    price = models.IntegerField(default=0)
    local_address = models.CharField(max_length=200)
    remote_address = models.CharField(max_length=200)
    rate_limit = models.CharField(max_length=50)
    primary_dns = models.CharField(max_length=50)
    secondary_dns = models.CharField(max_length=50)
    expiry = models.IntegerField(default=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
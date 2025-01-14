from django.db import models

# Create your models here.


class Address(models.Model):
    address = models.CharField(max_length=200)
    network = models.CharField(max_length=150)
    interface = models.CharField(max_length=150)
    created_at = models.DateTimeField( auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
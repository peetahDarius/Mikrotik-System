from django.db import models

# Create your models here.

class Package(models.Model):
    name = models.CharField(max_length=250)
    minutes = models.IntegerField(null=True, blank=True)
    amount = models.IntegerField()
    up = models.IntegerField()
    down = models.IntegerField()
    byte_quota = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
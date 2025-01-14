from django.db import models

# Create your models here.

class PPPServer(models.Model):
    name = models.CharField(max_length=50, unique=True)
    interface = models.CharField(max_length=100, unique=True)
    max_mtu = models.IntegerField(null=True, blank=True, default="auto")
    max_mru = models.IntegerField(null=True, blank=True, default="auto")
    
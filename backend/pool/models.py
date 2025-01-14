from django.db import models

# Create your models here.

class Pool(models.Model):
    name = models.CharField(max_length=50, unique=True)
    ip_pool = models.CharField(max_length=200)
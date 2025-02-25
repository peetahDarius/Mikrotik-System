from django.db import models

# Create your models here.

class Queue(models.Model):
    name = models.CharField(max_length=200)
    target = models.CharField(max_length=200)
    max_limit = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
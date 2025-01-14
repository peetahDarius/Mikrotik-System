from django.db import models

# Create your models here.

class StaticPackage(models.Model):
    name = models.CharField(max_length=200)
    max_limit = models.CharField(max_length=200)
    expiry = models.IntegerField(default=30)
    price = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self) -> str:
        return self.name

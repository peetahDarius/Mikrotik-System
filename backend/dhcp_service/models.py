from django.db import models
from client.models import Client
from django.utils import timezone
from datetime import timedelta

# Create your models here.

class DHCPService(models.Model):
    name = models.CharField(max_length=200)
    package = models.CharField(max_length=200)
    ip_address = models.CharField(max_length=200, unique=True)
    suspension_date = models.DateTimeField(null=True, blank=True)
    due_date = models.DateTimeField(null=True, blank=True)
    is_suspended = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    client = models.ForeignKey(Client, on_delete=models.SET_NULL, null=True, related_name='dhcp_services')
    mac_address = models.CharField(max_length=50, blank=True, null=True)
    def save(self, *args, **kwargs):
        from static_packages.models import StaticPackage

        if not self.created_at:
            self.created_at = timezone.now()

        if not self.due_date:
            expiry = StaticPackage.objects.get(name=self.package).expiry
            self.due_date = self.created_at + timedelta(days=expiry)
        
        if not self.suspension_date:
            expiry = StaticPackage.objects.get(name=self.package).expiry
            self.suspension_date = self.created_at + timedelta(days=expiry)
        
        super().save(*args, **kwargs)

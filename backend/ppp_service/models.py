from datetime import datetime, timedelta
from django.db import models
from ppp_profile.models import PPPProfile
from client.models import Client
from django.utils import timezone

class PPPService(models.Model):
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=50)
    profile = models.CharField(max_length=50)
    caller_id = models.CharField(max_length=50, null=True, blank=True)
    disabled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    suspension_date = models.DateTimeField(null=True, blank=True)
    due_date = models.DateTimeField(null=True, blank=True)
    is_suspended = models.BooleanField(default=False)
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='ppp_services')
    

    def save(self, *args, **kwargs):

        if not self.created_at:
            self.created_at = timezone.now()

        if not self.due_date:
            expiry = PPPProfile.objects.get(name=self.profile).expiry
            self.due_date = self.created_at + timedelta(days=expiry)
        
        if not self.suspension_date:
            expiry = PPPProfile.objects.get(name=self.profile).expiry
            self.suspension_date = self.created_at + timedelta(days=expiry)
        
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username

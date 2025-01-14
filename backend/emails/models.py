from django.db import models

# Create your models here.

class EmailConfiguration(models.Model):
    email_host = models.CharField(max_length=100, default='smtp.gmail.com', blank=True, null=True)
    email_port = models.PositiveIntegerField(default=587, blank=True, null=True)
    use_tls = models.BooleanField(default=True, blank=True, null=True)
    email_host_user = models.EmailField(unique=True)
    email_host_password = models.CharField(max_length=100)
    is_active = models.BooleanField(default=False, blank=True, null=True)  # to select active configuration

    def __str__(self):
        return self.email_host_user


class SendEmail(models.Model):
    subject = models.TextField()
    message = models.TextField()
    recipient_list = models.TextField()
    length = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

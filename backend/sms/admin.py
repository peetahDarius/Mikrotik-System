from django.contrib import admin

from .models import SMS, CreateClientSMS, CreateServiceSMS, NearDueSMS, PaymentReceivedSMS, SuspendedSMS

# Register your models here.

admin.site.register(CreateClientSMS)
admin.site.register(CreateServiceSMS)
admin.site.register(NearDueSMS)
admin.site.register(SuspendedSMS)
admin.site.register(PaymentReceivedSMS)
admin.site.register(SMS)
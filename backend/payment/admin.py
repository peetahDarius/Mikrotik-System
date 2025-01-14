from django.contrib import admin
from .models import MpesaPayment, PPPServicePaymentLogs
# Register your models here.

admin.site.register(PPPServicePaymentLogs)
admin.site.register(MpesaPayment)
from rest_framework import serializers
from .models import CashPayment, PPPServicePaymentLogs, MpesaPayment, PaymentDetails

class CashPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CashPayment
        fields = "__all__"
        
        
class PPPServicePaymentLogsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PPPServicePaymentLogs
        fields = "__all__"
        

class MpesaPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = MpesaPayment
        fields = "__all__"
        

class PaymentDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentDetails
        fields = "__all__"
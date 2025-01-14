from rest_framework import serializers 
from .models import MpesaExpressCredentials, Payment

class MpesaExpressCredentialsSerializer(serializers.ModelSerializer):
    class Meta:
        model = MpesaExpressCredentials
        fields = "__all__"
        

class PaymentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = "__all__"
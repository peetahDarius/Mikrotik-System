from rest_framework import serializers
from .models import SMS, ActivateServiceSMS, CreateClientSMS, CreateServiceSMS, NearDueSMS, PaymentReceivedSMS, SMSCredentials, SuspendedSMS

class CommaSeparatedListField(serializers.Field):
    def to_representation(self, value):
        # Converting the comma-separated string to a list
        return value.split(',')

    def to_internal_value(self, data):
        # Converting the list back to a comma-separated string
        if isinstance(data, list):
            return ','.join(str(item) for item in data)
        raise serializers.ValidationError("This field should be a list of mobile numbers.")

class SMSSerializer(serializers.ModelSerializer):
    numbers = CommaSeparatedListField()

    class Meta:
        model = SMS
        fields = ['message', 'numbers']


class CreateClientSMSSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreateClientSMS
        fields = "__all__"
        
class CreateServiceSMSSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreateServiceSMS
        fields = "__all__"

class NearDueSMSSerializer(serializers.ModelSerializer):
    class Meta:
        model = NearDueSMS
        fields = "__all__"
    
class SuspendedSMSSerializer(serializers.ModelSerializer):
    class Meta:
        model = SuspendedSMS
        fields = "__all__"

class PaymentReceivedSMSSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentReceivedSMS
        fields = "__all__"
        

class SMSCredentialsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SMSCredentials
        fields = "__all__"

        
class ActivateServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivateServiceSMS
        fields = "__all__"
        

class SMSSerializer(serializers.ModelSerializer):
    class Meta:
        model = SMS
        fields = "__all__"
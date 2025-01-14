from rest_framework import serializers
from .models import EmailConfiguration, SendEmail

class EmailConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailConfiguration
        fields = "__all__"
        

class SendEmailSerializer(serializers.ModelSerializer):
    recipient_list = serializers.ListField()
    class Meta:
        model = SendEmail
        fields = ["subject", "message", "recipient_list", "created_at"]
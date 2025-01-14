from rest_framework import serializers
from .models import AccessPoints, SuccessfullConnection, UnifiCredentials

class UnifiCredentialsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnifiCredentials
        fields = "__all__"
        

class SuccessfulConnectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SuccessfullConnection
        fields = "_all__"
        

class AccessPointsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccessPoints
        fields = ["name", "ip", "mac"]
from rest_framework import serializers
from .models import PPPService
from client.models import Client


class GetPPPServiceSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = PPPService
        fields = "__all__"
        depth = 1

class PPPServiceSerializer(serializers.ModelSerializer):

    class Meta:
        model = PPPService
        fields = "__all__"
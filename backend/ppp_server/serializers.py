from rest_framework import serializers
from .models import PPPServer

class PPPServerSerializer(serializers.ModelSerializer):
    class Meta:
        model= PPPServer
        fields = "__all__"
        extra_kwargs = {
            'max_mtu': {'required': False},
            'max_mru': {'required': False},
        }
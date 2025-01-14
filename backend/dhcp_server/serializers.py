from rest_framework import serializers
from .models import Network, Server

class ServerSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Server
        fields = "__all__"


class NetworkSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Network
        fields = "__all__"
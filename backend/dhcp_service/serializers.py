from rest_framework import serializers
from .models import DHCPService

class GetDHCPServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DHCPService
        fields = "__all__"
        depth = 1
        
class DHCPServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DHCPService
        fields = "__all__"
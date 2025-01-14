from rest_framework import serializers

from dhcp_service.serializers import DHCPServiceSerializer
from ppp_service.serializers import PPPServiceSerializer
from .models import Client

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'
        extra_kwargs = {'created_by': {'read_only': True }, 'balance': {'read_only': True }}
        extra_kwargs = {}
        

class PPPClientSerializer(serializers.ModelSerializer):
    ppp_services = PPPServiceSerializer(many=True, read_only=True)
    class Meta:
        model = Client
        fields = ["first_name", "last_name", "phone", "email", "custom_id", "location", "apartment", "house_no", "ppp_services", "county", "latitude", "longitude", "balance"]
        
        
class DHCPClientSerializer(serializers.ModelSerializer):
    dhcp_services = DHCPServiceSerializer(many=True, read_only=True)
    class Meta:
        model = Client
        fields = ["first_name", "last_name", "phone", "email", "custom_id", "location", "apartment", "house_no", "dhcp_services", "county", "latitude", "longitude", "balance"]
        
        
class AllServicesClientSerializer(serializers.ModelSerializer):
    ppp_services = PPPServiceSerializer(many=True, read_only=True)
    dhcp_services = DHCPServiceSerializer(many=True, read_only=True)
    
    class Meta:
        model = Client
        fields = ["first_name", "last_name", "phone", "email", "custom_id", "location", "apartment", "house_no", "ppp_services", "dhcp_services", "county", "latitude", "longitude", "balance"]
        
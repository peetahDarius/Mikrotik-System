import json
from django.shortcuts import render

from api.router_requests import interceptor_requests
from .serializers import AddressSerializer
from .models import Address
from rest_framework import generics, status, mixins
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
# Create your views here.


class ListCreateAddressView(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated, ]
    queryset = Address.objects.all()
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    
    def post(self, request, *args, **kwargs):
        data = request.data
        
        address = data.get("address")
        interface = data.get("interface")
        
        if not address:
            return Response({"error": "Address is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not interface:
            return Response({"error": "Interface is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        data = {
            "address": address,
            "interface": interface
        }
        
        response = interceptor_requests("put", path="ip/address", json=data)
        
        if response.status_code != 201:
            return Response({"error": f"{response.json()['detail']}"})
        
        request.data["network"] = response.json()["network"]

        return self.create(request, *args, **kwargs)
    
    
class RetrieveUpdateDestroyAddresssView(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated, ]
    queryset = Address.objects.all()
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    
    def put(self, request, *args, **kwargs):
        ip_id = kwargs.get("pk")
        data = request.data
        
        try:
            address_obj = Address.objects.get(pk=ip_id)
            
            address = data.get("address")
            interface = data.get("interface")
            
            if not address:
                return Response({"error": "Address is required"}, status=status.HTTP_400_BAD_REQUEST)
            
            if not interface:
                return Response({"error": "Interface is required"}, status=status.HTTP_400_BAD_REQUEST)
            
            
            data = {
                "address": address,
                "interface": interface
            }
            
            query_response = interceptor_requests("get", path=f"ip/address?address={address_obj.address}")
            
            if len(query_response.json()) == 0:
                return Response({"error": "address not found"}, status=status.HTTP_404_NOT_FOUND)
            
            response = interceptor_requests("patch", path=f"ip/address/{query_response.json()[0]['.id']}", json=data)
            
            if response.status_code != 200:
                return Response({"error": f"{response.json()['detail']}"})
            
            request.data["network"] = response.json()["network"]
            
            return self.update(request, *args, **kwargs)
        
        except Address.DoesNotExist:
            return Response({"error": f"Address [{ip_id}] not found"}, status=status.HTTP_404_NOT_FOUND)
            
    
    def delete(self, request, *args, **kwargs):
        ip_id = kwargs.get("pk")
        
        try:
            address_obj = Address.objects.get(pk=ip_id)
            query_response = interceptor_requests("get", path=f"ip/address?address={address_obj.address}")
            
            if len(query_response.json()) == 0:
                return Response({"error": "address not found"}, status=status.HTTP_404_NOT_FOUND)
            
            response = interceptor_requests("delete", path=f"ip/address/{query_response.json()[0]['.id']}")
            
            if response.status_code != 204:
                return Response({"error": f"{response.json()['detail']}"})
            
            return self.destroy(request, *args, **kwargs)
        except:
            return Response({"error": f"Address [{ip_id}] not found"}, status=status.HTTP_404_NOT_FOUND)
        

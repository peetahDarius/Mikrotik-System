import json
from django.shortcuts import render
from requests import delete
from rest_framework.response import Response
from rest_framework import generics, mixins, status

from .models import PPPServer
from .serializers import PPPServerSerializer
from api.router_requests import interceptor_requests
from rest_framework.permissions import IsAuthenticated


class ListCreatePPPServerView(generics.GenericAPIView, mixins.CreateModelMixin, mixins.ListModelMixin):
    
    serializer_class = PPPServerSerializer
    queryset = PPPServer.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        data = request.data
        name = data.get('name')
        interface = data.get('interface')
        max_mtu = data.get("max_mtu")
        max_mru = data.get("max_mru")
        
        if max_mru is None:
            max_mru = "auto"
        
        if max_mtu is None:
            max_mtu = "auto"
        
        ppp_data = {
            "service-name": name,
            "interface": interface,
            "max-mtu": max_mtu,
            "max-mru": max_mru,
            "disabled": False
        }
                
        try:
            response = interceptor_requests("put", path="interface/pppoe-server/server", json=ppp_data)
            
            if response.status_code != 201:
                raise ValueError(f"{response.json()['detail']}")
        except Exception as e:
            return Response({"error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)
        return self.create(request, *args, **kwargs)


class RetrieveUpdateEditDestroyPPPServerView(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    
    queryset = PPPServer.objects.all()
    permission_classes = [IsAuthenticated, ]
    serializer_class = PPPServerSerializer
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        data = request.data
        name = data.get('name')
        interface = data.get('interface')
        max_mtu = data.get("max_mtu")
        max_mru = data.get("max_mru")
        
        if max_mru is None:
            max_mru = "auto"
        
        if max_mtu is None:
            max_mtu = "auto"
        
        ppp_data = {
            "service-name": name,
            "interface": interface,
            "max-mtu": max_mtu,
            "max-mru": max_mru,
            "disabled": False
        }
        
        try:
            server = interceptor_requests('get', path=f"interface/pppoe-server/server?service-name={name}")
            if len(server.json()) == 0:
                return Response({f"The pppoe server with service name {name} does not exist"}, status=status.HTTP_404_NOT_FOUND)
            
            server_id = server.json()[0][".id"]
            
            update_response = interceptor_requests('patch', path=f"interface/pppoe-server/server/{server_id}", json=ppp_data)
            
            if update_response.status_code != 200:
                raise ValueError("Could not edit the ppp server in the router")
            
        except Exception as e:
            return Response({f"{e}"}, status=status.HTTP_400_BAD_REQUEST)
        
        return self.update(request, *args, **kwargs)
    
    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        try:
            server = PPPServer.objects.get(id=pk)
            server_name = server.name
            
        except PPPServer.DoesNotExist:
            return Response({"error": f"ppp server with id {pk} does not exist"}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            pppserver = interceptor_requests('get', path=f"interface/pppoe-server/server?service-name={server_name}")
            if len(pppserver.json()) == 0:
                return Response({f"pppoe server does not exist"}, status=status.HTTP_404_NOT_FOUND)        
            
            
            server_id = pppserver.json()[0][".id"]
            
            delete_response = interceptor_requests('delete', path=f"interface/pppoe-server/server/{server_id}")
            
            print( "the status is: ", delete_response.status_code)
            
            if delete_response.status_code != 204:
                raise ValueError("Could not edit the ppp server in the router")
            
        except Exception as e:
            return Response({"error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)
        
        return self.destroy(request, *args, **kwargs)
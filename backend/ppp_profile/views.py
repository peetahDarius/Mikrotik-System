from re import U
from django.shortcuts import render
from rest_framework import generics, mixins, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from api.router_requests import interceptor_requests
from .serializers import PPPProfileSerializer
from .models import PPPProfile
# Create your views here.


class ListCreatePPPProfileView(generics.GenericAPIView, mixins.CreateModelMixin, mixins.ListModelMixin):
    serializer_class = PPPProfileSerializer
    permission_classes = [IsAuthenticated, ]
    queryset = PPPProfile.objects.all()
    
    
    def post(self, request, *args, **kwargs):
        data = request.data
        name = data.get("name")
        local_address = data.get("local_address")
        remote_address = data.get("remote_address")
        rate_limit = data.get("rate_limit")
        primary_dns = data.get("primary_dns")
        secondary_dns = data.get("secondary_dns")
        
        ppp_profile_data = {
            "name": name,
            "rate-limit": rate_limit,
            "dns-server": f"{primary_dns},{secondary_dns}",
            "local-address": local_address,
            "remote-address": remote_address
        }
        
        try:
            response = interceptor_requests("put", path="ppp/profile", json=ppp_profile_data)
            
            if response.status_code != 201:
                return Response({"error": f"{response.json()['detail']}"}, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response({"error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)

        
        return self.create(request, *args, **kwargs)
    
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    
class RetrieveUpdateDeleteEditPPPProfileView(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    serializer_class = PPPProfileSerializer
    permission_classes = [IsAuthenticated, ]
    queryset = PPPProfile.objects.all()
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        
        data = request.data
        name = data.get("name")
        local_address = data.get("local_address")
        remote_address = data.get("remote_address")
        rate_limit = data.get("rate_limit")
        primary_dns = data.get("primary_dns")
        secondary_dns = data.get("secondary_dns")
        
        ppp_profile_data = {
            "name": name,
            "rate-limit": rate_limit,
            "dns-server": f"{primary_dns},{secondary_dns}",
            "local-address": local_address,
            "remote-address": remote_address
        }
        
        try:
            profile_response = interceptor_requests("get", path=f"ppp/profile?name={name}")
            profile_id = profile_response.json()[0][".id"]
        except:
            return Response({"error": f"PPP Profile {name} does not exist"}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            update_response = interceptor_requests("patch", path=f"ppp/profile/{profile_id}", json=ppp_profile_data)
        
            if update_response.status_code != 200:
                raise ValueError(f"{update_response.json()['detail']}")
        
        except Exception as e:
            return Response({"error": f"An error has occured: {e}"}, status=status.HTTP_400_BAD_REQUEST)
        
        return self.update(request, *args, **kwargs)
    
    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        profile_id = kwargs.get("pk")
        try:
            profile = PPPProfile.objects.get(id=profile_id)
            name = profile.name
        except PPPProfile.DoesNotExist:
            return Response({"error": f"PPP Profile {profile_id} not found"}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            profile_response = interceptor_requests("get", path=f"ppp/profile?name={name}")
            profile_id = profile_response.json()[0][".id"]
        except:
            return Response({"error": f"PPP Profile {name} does not exist"}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            delete_response = interceptor_requests("delete", path=f"ppp/profile/{profile_id}")
        
            if delete_response.status_code != 204:
                raise ValueError("Could not delete ppp profile in the router")
        
        except Exception as e:
            return Response({"error": f"An error has occured: {e}"}, status=status.HTTP_400_BAD_REQUEST)
        
        return self.destroy(request, *args, **kwargs)
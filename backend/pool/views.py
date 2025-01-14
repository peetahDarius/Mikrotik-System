from django.shortcuts import render
from rest_framework import generics, mixins, status
from rest_framework.permissions import IsAuthenticated

from api.router_requests import interceptor_requests
from .serializers import PoolSerializer
from rest_framework.response import Response
from .models import Pool

# Create your views here.

class listCreatePoolView(generics.GenericAPIView, mixins.CreateModelMixin, mixins.ListModelMixin):
    queryset = Pool.objects.all()
    permission_classes = [IsAuthenticated, ]
    serializer_class = PoolSerializer
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        data = request.data
        name = data.get("name")
        ip_pool = data.get("ip_pool")
        
        pool_data = {
            "name": name,
            "ranges": ip_pool
        }
        try:
            response = interceptor_requests("put", path="ip/pool", json=pool_data)
            
            if response.status_code != 201:
                raise ValueError("Could not create the ip pool")
            
        except Exception as e:
            return Response({"error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)
        
        return self.create(request, *args, **kwargs)
    

class RetrieveUpdateDeletePoolView(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    queryset = Pool.objects.all()
    permission_classes = [IsAuthenticated, ]
    serializer_class = PoolSerializer
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    
    def put(self, request, *args, **kwargs):
        data = request.data
        name = data.get("name")
        ip_pool = data.get("ip_pool")
        
        pool_data = {
            "name": name,
            "ranges": ip_pool
        }
        try:
            pool_query = interceptor_requests("get", path=f"ip/pool?name={name}")
            if pool_query.status_code != 200:
                raise ValueError(f"Could not find an IP Pool with name {name}")
            
            pool_id = pool_query.json()[0]['.id']
            
            update_response = interceptor_requests("patch", path=f"ip/pool/{pool_id}", json=pool_data)
            
            if update_response.status_code != 200:
                raise ValueError("could not update the ip pool in the router")
            
        except Exception as e:
            
            return Response({"error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)
        
        return self.update(request, *args, **kwargs)
    
    
    def delete(self, request, *args, **kwargs):
        pool_id = kwargs.get("pk")
        try:
            pool = Pool.objects.get(id=pool_id)
            pool_name = pool.name
        except Pool.DoesNotExist:
            return Response({"error": f"Pool {pool_id} not found"}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            pool_query = interceptor_requests("get", path=f"ip/pool?name={pool_name}")
            if pool_query.status_code != 200:
                raise ValueError(f"Could not find an IP Pool with name {pool_name}")
            
            pool_id = pool_query.json()[0]['.id']
            
            delete_response = interceptor_requests("delete", path=f"ip/pool/{pool_id}")
            
            if delete_response.status_code != 204:
                raise ValueError("could not delete the ip pool in the router")
            
        except Exception as e:
            return Response({"error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)
        
        return self.destroy(request, *args, **kwargs)
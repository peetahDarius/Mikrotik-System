from urllib import response
from django.shortcuts import render
from rest_framework import generics, mixins, status

from api.router_requests import interceptor_requests
from .serializers import QueueSerializer
from .models import Queue
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

# Create your views here.


class ListCreateQueueView(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    
    serializer_class = QueueSerializer
    queryset = Queue.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get(self, request, *args, **kwargs):        
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        data = request.data
        
        name = data.get("name")
        target = data.get("target")
        max_limit = data.get("max_limit")
        
        if not name:
            return Response({"error": "name is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not target:
            return Response({"error": "target ip address/s is required"})
        
        if not max_limit:
            return Response({"error": "max limit is required"})
        
        data = {
            "name": name,
            "target": target,
            "max-limit": max_limit
        }
        try:
            query_response = interceptor_requests("get", "queue/simple?name=11.11.11.0/24")
            default_queue_response = query_response.json()
            
            if len(default_queue_response) == 0:
                raise ValueError("default subnet queue not found")
            
            default_queue_id = default_queue_response[0][".id"]
            delete_response = interceptor_requests("delete", f"queue/simple/{default_queue_id}")
            
            if delete_response.status_code != 204:
                raise ValueError("could not set the default subnet queue to the last")
            
            response = interceptor_requests("put", "queue/simple", json=data )
            
            if response.status_code != 201:
                raise ValueError(response.json()["detail"])
            
            
            default_queue_data = default_queue_response[0]
            
            default_name = default_queue_data.get("name")
            default_max_limit = default_queue_data.get("max-limit")
            default_target = default_queue_data.get("target")
            
            default_queue = {
                "name": default_name,
                "max-limit": default_max_limit,
                "target": default_target
            }
            
            default_queue_response = interceptor_requests("put", "queue/simple", json=default_queue)
            
            if default_queue_response.status_code != 201:
                interceptor_requests("delete", f"queue/simple/{response.json()[0]['.id']}")
                raise ValueError(response.json()["detail"])
            
            return self.create(request, *args, **kwargs)
        
        except Exception as e:
            return Response({"error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)
        
            

class RetrieveUpdateDestroyQueueView(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    
    serializer_class = QueueSerializer
    queryset = Queue.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        data = request.data
        queue_id = kwargs.get("pk")
        try:
            queue_obj = Queue.objects.get(pk=queue_id)
            
            name = data.get("name")
            target = data.get("target")
            max_limit = data.get("max_limit")
            
            if not name:
                return Response({"error": "name is required"}, status=status.HTTP_400_BAD_REQUEST)
            
            if not target:
                return Response({"error": "target ip address/s is required"})
            
            if not max_limit:
                return Response({"error": "max limit is required"})
            
            data = {
                "name": name,
                "target": target,
                "max-limit": max_limit
            }
            
            queue_response = interceptor_requests("get", path=f"queue/simple?name={queue_obj.name}")
            
            if len(queue_response.json()) == 0:
                return Response({"error": f"Queue {queue_id} not found"}, status=status.HTTP_404_NOT_FOUND)
            
            response = interceptor_requests("patch", f"queue/simple/{queue_response.json()[0]['.id']}", json=data )
            
            if response.status_code != 200:
                return Response({"error": f"{response.json()['detail']}"})

            return self.update(request, *args, **kwargs)
            
        except Queue.DoesNotExist:
            return Response({"error": f"Queue {queue_id} does not exist"}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, *args, **kwargs):
        queue_id = kwargs.get("pk")
        try:
            queue_obj = Queue.objects.get(pk=queue_id)
            queue_response = interceptor_requests("get", path=f"queue/simple?name={queue_obj.name}")
            
            if len(queue_response.json()) == 0:
                return Response({"error": f"Queue {queue_id} not found"}, status=status.HTTP_404_NOT_FOUND)
            
            response = interceptor_requests("delete", f"queue/simple/{queue_response.json()[0]['.id']}")
            
            if response.status_code != 204:
                return Response({"error": f"{response.json()['detail']}"})
            
            return self.destroy(request, *args, **kwargs)
            
        except Queue.DoesNotExist:
            return Response({"error": f"Queue {queue_id} does not exist"}, status=status.HTTP_404_NOT_FOUND)

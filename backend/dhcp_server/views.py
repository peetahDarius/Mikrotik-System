import ipaddress
import queue
from django.shortcuts import render
from rest_framework import generics, mixins, status
from rest_framework.response import Response
from rest_framework.request import Request
from api.router_requests import interceptor_requests
from dhcp_service.models import DHCPService
from .serializers import NetworkSerializer, ServerSerializer
from .models import Network, Server
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

# Create your views here.

class ListCreateServerView(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    
    serializer_class = ServerSerializer
    queryset = Server.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        data = request.data
        
        name = data.get("name")
        interface = data.get("interface")
        pool = data.get("pool")
        relay = data.get("relay")
        
        if not name:
            return Response({"error": "Name is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not interface:
            return Response({"error": "Interface is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not relay:
            return Response({"error": "Relay is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not pool:
            return Response({"error": "Address pool is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            
            server_data = {
                "name": name,
                "interface": interface,
                "address-pool": pool,
                "relay": relay
            }
            
            response = interceptor_requests('put', path="ip/dhcp-server", json=server_data)

            if response.status_code != 201:
                return Response({"error": f"{response.json()['detail']}"})

            return self.create(request, *args, **kwargs)
        
        except Exception as e:
            return Response({"error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)
    
    
class RetrieveUpdateDeleteServerView(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    
    serializer_class = ServerSerializer
    queryset = Server.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        server_id = kwargs.get("pk")
        data = request.data
        
        name = data.get("name")
        interface = data.get("interface")
        pool = data.get("pool")
        relay = data.get("relay")
        
        if not name:
            return Response({"error": "Name is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not interface:
            return Response({"error": "Interface is required"}, status=status.HTTP_400_BAD_REQUEST)
        if not relay:
            return Response({"error": "Relay is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not pool:
            return Response({"error": "Address pool is required"}, status=status.HTTP_400_BAD_REQUEST)

        server_data = {
            "name": name,
            "interface": interface,
            "address-pool": pool,
            "relay": relay
        }
        
        try:
            server_name = Server.objects.get(pk=server_id).name
            query_response = interceptor_requests("get", f"ip/dhcp-server?name={server_name}")
            
            if len(query_response.json()) == 0:
                raise ValueError(f"dhcp server [{server_name}] could not be found in the router")
            
            query_id = query_response.json()[0][".id"]
            response = interceptor_requests("patch", f"ip/dhcp-server/{query_id}", json=server_data)
            
            if response.status_code != 200:
                raise ValueError(f"{response.json()['detail']}")
            
            return self.update(request, *args, **kwargs)
            
        except Server.DoesNotExist:
            return Response({"error": f"server [{server_id}] does not exist"}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({"error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)
        
    
    def delete(self, request, *args, **kwargs):
        server_id = kwargs.get("pk")
        
        try:
            server_name = Server.objects.get(pk=server_id).name
            query_response = interceptor_requests("get", f"ip/dhcp-server?name={server_name}")
            
            if len(query_response.json()) == 0:
                raise ValueError(f"dhcp server [{server_name}] could not be found in the router")
            
            query_id = query_response.json()[0][".id"]
            response = interceptor_requests("delete", f"ip/dhcp-server/{query_id}")
            
            if response.status_code != 204:
                raise ValueError(f"{response.json()['detail']}")
            
            return self.destroy(request, *args, **kwargs)
            
        except Server.DoesNotExist:
            return Response({"error": f"server [{server_id}] does not exist"}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({"error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)
        
    

class ListCreateNetworkView(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    
    serializer_class = NetworkSerializer
    queryset = Network.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        data = request.data
        
        address = data.get("address")
        gateway = data.get("gateway")
        primary_dns = data.get("primary_dns")
        secondary_dns = data.get("secondary_dns")
        default_limit = data.get("default_limit")
        
        if not address:
            return Response({"error": "address is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not gateway:
            return Response({"error": "gateway is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not default_limit:
            return Response({"error": "default limit is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        network_data = {
            "address": address,
            "gateway": gateway,
            "dns-server": f"{primary_dns},{secondary_dns}"
        }
        
        response = interceptor_requests("put", path="ip/dhcp-server/network", json=network_data)
        if response.status_code != 201:
            return Response({"error": f"{response.json()['detail']}"})
        
        queue_data = {
            "name": address,
            "target": address,
            "max-limit": default_limit
        }
        
        queue_response = interceptor_requests("put", path="queue/simple", json=queue_data)
        
        if queue_response.status_code != 201:
            interceptor_requests("delete", path=f"ip/dhcp-server/network/{response.json()['.id']}")
            return Response({"error": "could not create the subnet's queue"}, status=status.HTTP_400_BAD_REQUEST)

        return self.create(request, *args, **kwargs)
    
    
class RetrieveUpdateDeleteNetworkView(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    
    serializer_class = NetworkSerializer
    queryset = Network.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        network_id = kwargs.get("pk")
        data = request.data
        
        address = data.get("address")
        gateway = data.get("gateway")
        primary_dns = data.get("primary_dns")
        secondary_dns = data.get("secondary_dns")
        default_limit = data.get("default_limit")
        
        if not address:
            return Response({"error": "address is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not gateway:
            return Response({"error": "gateway is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not default_limit:
            return Response({"error": "default limit is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        network_data = {
            "address": address,
            "gateway": gateway,
            "dns-server": f"{primary_dns},{secondary_dns}"
        }
        try:
            network_address = Network.objects.get(pk=network_id).address
            
            query_response = interceptor_requests("get", path=f"ip/dhcp-server/network?address={network_address}")
            
            if len(query_response.json()) == 0:
                raise ValueError(f"network address {network_address} not found in the router")
            
            query_id = query_response.json()[0][".id"]
            
            response = interceptor_requests("patch", path=f"ip/dhcp-server/network/{query_id}", json=network_data)
            
            if response.status_code != 200:
                raise ValueError(f"{response.json()['detail']}")
            
            queue_data = {
            "name": address,
            "target": address,
            "max-limit": default_limit
            }
            
            queue_query_response = interceptor_requests("get", path=f"queue/simple?name={network_address}")
            
            if len(queue_query_response.json()) == 0:
                raise ValueError(f"could not find queue with name {network_address}")
            
            queue_id = queue_query_response.json()[0][".id"]
            update_queue_response = interceptor_requests("patch", path=f"queue/simple/{queue_id}", json=queue_data)
            
            if update_queue_response.status_code != 200:
                raise ValueError(f"{update_queue_response.json()['detail']}")
            
            return self.update(request, *args, **kwargs)
        
        except Network.DoesNotExist:
            return Response({"error": f"network address {network_id} does not exist"}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({"error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, *args, **kwargs):
        network_id = kwargs.get("pk")
        try:
            network_address = Network.objects.get(pk=network_id).address
            
            query_response = interceptor_requests("get", path=f"ip/dhcp-server/network?address={network_address}")
            
            if len(query_response.json()) == 0:
                raise ValueError(f"network address {network_address} not found in the router")
            
            query_id = query_response.json()[0][".id"]
            
            response = interceptor_requests("delete", path=f"ip/dhcp-server/network/{query_id}")
            
            if response.status_code != 204:
                raise ValueError(f"{response.json()['detail']}")
            
            queue_query_response = interceptor_requests("get", path=f"queue/simple?name={network_address}")
            
            if len(queue_query_response.json()) == 0:
                raise ValueError(f"address {network_address} not found in the queue")
            
            queue_id = queue_query_response.json()[0][".id"]
            
            queue_delete_response = interceptor_requests("delete", path=f"queue/simple/{queue_id}")
            
            if queue_delete_response.status_code != 204:
                raise ValueError(f"{queue_delete_response.json()['detail']}")
            
            return self.destroy(request, *args, **kwargs)
        
        except Network.DoesNotExist:
            return Response({"error": f"network address {network_id} does not exist"}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({"error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated, ])
def available(request:Request):
    subnet = request.data.get("subnet")
    if not subnet:
        return Response({"error": "subnet is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    all_available_ips = list(get_ip_range(subnet=subnet).get("available-ips"))
    all_dhcp_ips = DHCPService.objects.values_list("ip_address", flat=True)
    
    available_ips = [ip for ip in all_available_ips if ip not in all_dhcp_ips]
    
    return Response(data=available_ips, status=status.HTTP_201_CREATED)

def get_ip_range(subnet):
    network = ipaddress.ip_network(subnet)
    
    network_address = network.network_address
    broadcast_address = network.broadcast_address
    usable_ips = list(network.hosts())
    available_ips = []
    
    for ip in usable_ips:
        if ip not in available_ips:
            available_ips.append(str(ip))
    
    return {
        'network-address': str(network_address),
        'usable-ip-range': f"{usable_ips[0]} - {usable_ips[-1]}",
        'broadcast-address': str(broadcast_address),
        'no-of-usable-ips': len(usable_ips),
        "available-ips": available_ips
    }

from datetime import timedelta
import json
from urllib import response
from django.shortcuts import render
from httpx import request
from rest_framework import generics, mixins, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from api.router_requests import interceptor_requests
from dhcp_server.models import Network
from sms.views import bulk_sms, render_template
from payment.models import PaymentDetails
from sms.models import ActivateServiceSMS, CreateServiceSMS, SuspendedSMS
from client.models import Client
from static_packages.models import StaticPackage
from .models import DHCPService
from .serializers import DHCPServiceSerializer, GetDHCPServiceSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.request import Request
from client.serializers import DHCPClientSerializer

# Create your views here.

class ListCreateDHCPServiceView(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    
    queryset = DHCPService.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get_serializer_class(self):
        if self.request.method == "POST":
            return DHCPServiceSerializer
        if self.request.method == "GET":
            return GetDHCPServiceSerializer
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        data = request.data
        network = data.get("network")
        package = data.get("package")
        client_id = data.get("client")
        ip_address = data.get("ip_address")
        name = data.get("name")
        
        if not package:
            return Response({"error": "package is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not client_id:
            return Response({"error": "client id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not ip_address:
            return Response({"error": "ip address is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not name:
            return Response({"error": "service name is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        request.data['client'] = client_id
        
        try:
            client = Client.objects.get(id=client_id)
            selected_package = StaticPackage.objects.get(name=package)
            payment_details = PaymentDetails.objects.get(custom_id=1)
            template_text = CreateServiceSMS.objects.get(custom_id=1).message
            
            max_limit = selected_package.max_limit
            queue_data = {
                "name": name,
                "target": ip_address,
                "max-limit": max_limit
            }
            
            
            query_response = interceptor_requests("get", f"queue/simple?name={network}")
            default_queue_response = query_response.json()
            
            if len(default_queue_response) == 0:
                raise ValueError("default subnet queue not found")
            
            default_queue_id = default_queue_response[0][".id"]
            delete_response = interceptor_requests("delete", f"queue/simple/{default_queue_id}")
            
            if delete_response.status_code != 204:
                raise ValueError("could not set the default subnet queue to the last")
            
            response = interceptor_requests("put", "queue/simple", json=queue_data )
            
            if response.status_code != 201:
                raise ValueError(response.json()['detail'])
            
            
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
                raise ValueError(response.json()['detail'])
            
            
            price = selected_package.price
            short_code = payment_details.short_code
            created_at = timezone.now()
            first_name = client.first_name
            last_name = client.last_name
            phone = client.phone
            acc_no = client.custom_id
            context = {"first_name": first_name, "last_name": last_name, "paybill": short_code, "created_at": created_at, "acc_no": acc_no, "price": price}
            rendered_text = render_template(template_text=template_text, context=context)        
            bulk_sms(mobile_list=[phone,], message=rendered_text)
            
            another_query_response = interceptor_requests("get", f"queue/simple?name={network}")
            another_default_queue_response = another_query_response.json()
            
            if len(another_default_queue_response) == 0:
                interceptor_requests("put", "queue/simple", json=default_queue)
            
            return self.create(request, *args, **kwargs)
        
        except Client.DoesNotExist:
            return Response({"error": "Client not found"}, status=status.HTTP_404_NOT_FOUND)
        
        except StaticPackage.DoesNotExist:
            return Response({"error": f"package {package} does not exist"}, status=status.HTTP_404_NOT_FOUND)
        
        except PaymentDetails.DoesNotExist:
            return Response({"error": "payment details have not yet been set"}, status=status.HTTP_400_BAD_REQUEST)
        
        except CreateServiceSMS.DoesNotExist:
            return Response({"error": "Send payment received SMS has not been set."}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            another_query_response = interceptor_requests("get", f"queue/simple?name={network}")
            another_default_queue_response = another_query_response.json()
            
            if len(another_default_queue_response) == 0:
                interceptor_requests("put", "queue/simple", json=default_queue)
            return Response({"error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)
    
class RetrieveUpdateDestroyDHCPServiceView(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    serializer_class = DHCPServiceSerializer
    queryset = DHCPService.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    
    def patch(self, request, *args, **kwargs):
        client_id = request.data.get('client')
        service_id = kwargs.get("pk")
        package_name = request.data.get("package")
        ip_address = request.data.get("ip_address")
        mac_address = request.data.get("mac_address")
        
        try:
            service = DHCPService.objects.get(pk=service_id)
            
            exists_response = interceptor_requests("get", path=f"queue/simple?name={service.name}")
            if len(exists_response.json()) == 0:
                raise ValueError("service id out of range")
            
            if client_id:
                client = Client.objects.get(id=client_id)
                request.data['client'] = client.pk
            
            if package_name:
                max_limit = StaticPackage.objects.get(name=package_name).max_limit
                
                data = {
                    "max-limit": max_limit
                }
                
                limits_response = interceptor_requests("patch", path=f"queue/simple/{exists_response.json()[0]['.id']}", json=data)
                
                if limits_response.status_code != 200:
                    raise ValueError(f"{limits_response.json()['detail']}")
            
            if ip_address:
                ip_address_data = {
                    "target": ip_address
                }
                ip_address_response = interceptor_requests("patch", path=f"queue/simple/{exists_response.json()[0]['.id']}", json=ip_address_data)
                
                if ip_address_response.status_code != 200:
                    raise ValueError(f"{ip_address_response.json()['detail']}")
            
            if mac_address:
                ip_address = service.ip_address

                arp_response = interceptor_requests("get", path=f"ip/arp?address={ip_address}")
                
                if len(arp_response.json()) == 0:
                    raise ValueError("The router can not be binded while offline")
                
                json_response = arp_response.json()[0]
                arp_number = json_response[".id"]
                interface = json_response["interface"]
                delete_arp_response = interceptor_requests("delete", path=f"ip/arp/{arp_number}")
                
                if delete_arp_response.status_code != 204:
                    raise ValueError("could not make the ip address static")
                
                data = {
                    "address": ip_address,
                    "mac-address": mac_address,
                    "interface": interface
                }
                
                make_permanent_request = interceptor_requests("put", path=f"ip/arp", json=data)
                
                if make_permanent_request.status_code != 201:
                    raise ValueError(f"{make_permanent_request.json()['detail']}")
                
            return self.partial_update(request, *args, **kwargs)   
        
        except StaticPackage.DoesNotExist:
            return Response({"error": f"Package {package_name} does not exist"}, status=status.HTTP_404_NOT_FOUND)
        
        except Client.DoesNotExist:
            return Response({'error': f'Client {client_id} not found'}, status=404)
            
        except DHCPService.DoesNotExist:
            return Response({"error": f"service {service_id} does not exist"}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({"error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)
        
    
    def delete(self, request, *args, **kwargs):
        service_id = kwargs.get("pk")
        try:
            service_name = DHCPService.objects.get(pk=service_id).name
            queue_response = interceptor_requests("get", path=f"queue/simple?name={service_name}")
            
            if len(queue_response.json()) == 0:
                raise ValueError(f"could not find queue {service_name}")
            
            queue_id = queue_response.json()[0][".id"]
            response = interceptor_requests("delete", path=f"queue/simple/{queue_id}")
            
            if response.status_code != 204:
                raise ValueError(f"could not delete queue {service_name}")
            
            return self.destroy(request, *args, **kwargs)
            
        except DHCPService.DoesNotExist:
            return Response({"error": f"service {service_id} does not exist"})
        
        except Exception as e:
            return Response({"error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)
        
    

@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated, ])
def get_dhcp_services_for_single_client(request:Request, client):
    client_id = client
    if client_id:
        try:
            client = Client.objects.get(id=client_id)
            serializer = DHCPClientSerializer(instance=client, context={"request": request})
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        except Client.DoesNotExist:
            return Response({'error': 'Client not found'}, status=404)
        
        except Exception as e:
            return Response({"error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"error": "Client ID is required"}, status=status.HTTP_400_BAD_REQUEST)
    


@api_view(http_method_names=["DELETE"])
@permission_classes([IsAuthenticated, ])
def suspend_client(request:Request, client):
    try:
        payment_details = PaymentDetails.objects.get(custom_id=1)
        template_text = SuspendedSMS.objects.get(custom_id=1).message
        service = DHCPService.objects.get(pk=client)
        package = service.package
        service_package = StaticPackage.objects.get(name=service.package)
        ip_prefix = ".".join(service.ip_address.split(".")[0:3])
        network = Network.objects.get(address__startswith=ip_prefix)
        
        network_limit = network.default_limit
        
        service_name = service.name
        first_name = service.client.first_name
        last_name = service.client.last_name
        phone = service.client.phone
        acc_no = service.client.custom_id
        short_code = payment_details.short_code
        price = service_package.price
        
        
        service_response = interceptor_requests("get", path=f"queue/simple?name={service_name}")
        
        if service_response.json() == []:
            raise ValueError(f"Could not find service with name {service_name}")
        
        service_id = service_response.json()[0][".id"]    
        suspend_data = {"max-limit": network_limit}
        
        suspend_response = interceptor_requests("patch", path=f"queue/simple/{service_id}", json=suspend_data)
        
        if suspend_response.status_code != 200:
            raise ValueError(suspend_response.json()['detail'])
        
        service.is_suspended = True
        service.suspension_date = timezone.now()
        service.save()
        
        context = {"first_name": first_name, "last_name": last_name, "paybill": short_code, "acc_no": acc_no, "price": price}
        rendered_text = render_template(template_text=template_text, context=context)
        # bulk_sms(mobile_list=[phone,], message=rendered_text)
        
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    except PaymentDetails.DoesNotExist:
        return Response({"error": "payment details have not been set"}, status=status.HTTP_404_NOT_FOUND)
    
    except SuspendedSMS.DoesNotExist:
        return Response({"error": "client suspend SMS has not been set"}, status=status.HTTP_404_NOT_FOUND)
    
    except DHCPService.DoesNotExist:
        return Response({"error": f"service {client} does not exist"}, status=status.HTTP_404_NOT_FOUND)
    
    except StaticPackage.DoesNotExist:
        return Response({"error": f"package {service.package} does not exist"}, status=status.HTTP_404_NOT_FOUND)
    
    except Network.DoesNotExist:
        return Response({"error": f"dhcp network {ip_prefix}... does not exist"}, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        return Response({"error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(http_method_names=['PATCH'])
@permission_classes([IsAuthenticated, ])
def activate_client_view(request:Request, client):
    if not client:
        return Response({"error": "service id is needed"}, status=status.HTTP_400_BAD_REQUEST)
    response, error = activate_client(client=client)
    if error:
        return Response({"error": error}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(data=response, status=status.HTTP_200_OK)

def activate_client(client):
    try:
        service = DHCPService.objects.get(pk=client)
        service_name = service.name
        service_package = StaticPackage.objects.get(name=service.package)
        template_text = ActivateServiceSMS.objects.get(custom_id=1).message
        payment_details = PaymentDetails.objects.get(custom_id=1)
        
        profile_price = service_package.price
        expiry = service_package.expiry
        if service.client.balance < profile_price:
            raise ValueError("client's balance is less than Package's price. Could not activate service")
        
        service_response = interceptor_requests("get", f"queue/simple?name={service_name}")
        
        if service_response.json() == []:
            raise ValueError(f"could not find service with name {service_name}")
        
        service_id = service_response.json()[0][".id"]
        
        disable_data = {"max-limit": service_package.max_limit}
        disable_client_response = interceptor_requests("patch", f"queue/simple/{service_id}", json=disable_data)
        
        if disable_client_response.status_code != 200:
            raise ValueError("Could not reconnect client")
        
        service.client.balance -= profile_price
        service.client.save()
        
        service.suspension_date = timezone.now() + timedelta(days=expiry)
        service.is_suspended = False
        service.save()
        
        acc_no_prefix = payment_details.acc_no_prefix
        acc_no = acc_no_prefix + str(service.pk).zfill(5)
        first_name = service.client.first_name
        last_name = service.client.last_name
        phone = service.client.phone
        context = {"first_name": first_name, "last_name": last_name, "service_name": acc_no}
        rendered_text = render_template(template_text=template_text, context=context)
        # bulk_sms(mobile_list=[phone,], message=rendered_text)
        
        return {"message": "Service activated successfully"}, None
    
    except ActivateServiceSMS.DoesNotExist:
            return None, "send activate client SMS has not been set."
        
    except StaticPackage.DoesNotExist:
        return None, f"package {service.package} was not found"
    
    except DHCPService.DoesNotExist:
        return None, f"service {client} was not found"
    
    except PaymentDetails.DoesNotExist:
            return None, "payment details have not yet been set"
    
    except Exception as e:
        return None, str(e)
    
    
@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated, ])
def client_mac_address(request:Request):
    ip_address = request.data.get("ip_address")
    try:
        response = interceptor_requests("get", f"ip/arp?address={ip_address}")
        if len(response.json()) == 0:
            raise ValueError("The user is offline.")
        mac_address = response.json()[0]["mac-address"]
        data = {"mac_address": mac_address}
        return Response(data=data, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({"error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)
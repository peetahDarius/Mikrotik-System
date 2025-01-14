from datetime import timedelta
import json
from django.shortcuts import render
from rest_framework.response import Response
from payment.models import PaymentDetails
from sms.models import ActivateServiceSMS, CreateServiceSMS, SuspendedSMS
from sms.views import bulk_sms, render_template
from ppp_profile.models import PPPProfile
from api.router_requests import interceptor_requests
from client.models import Client
from .models import PPPService
from .serializers import GetPPPServiceSerializer, PPPServiceSerializer
from rest_framework import generics, mixins, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.request import Request
from client.serializers import PPPClientSerializer
from django.utils import timezone

# Create your views here.

class ListCreatePPPServiceView(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):

    queryset = PPPService.objects.all().order_by("pk")
    permission_classes = [IsAuthenticated, ]
    
    def get_serializer_class(self):
        if self.request.method == "POST":
            return PPPServiceSerializer
        
        if self.request.method == "GET":
            return GetPPPServiceSerializer
    
    def get_next_id(self):
        last_item = PPPService.objects.last()
        if last_item is not None:
            next_id = last_item.pk + 1
        else:
            next_id = 1
        return next_id
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        client_id = request.data.get("client")

        if not client_id:
            return Response({"error": "Client ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        username = request.data.get("username")
        password = request.data.get("password")
        profile = request.data.get("profile")
        
        try:
            client = Client.objects.get(id=client_id)
            selected_profile = PPPProfile.objects.get(name=profile)
            payment_details = PaymentDetails.objects.get(custom_id=1)
            template_text = CreateServiceSMS.objects.get(custom_id=1).message
            
            request.data['client'] = client.pk
        
            pppoe_data = {
                "name": username,
                "password": password,
                "profile": profile,
                "service": "pppoe"
            }
            
            response = interceptor_requests("put", "ppp/secret", json=pppoe_data) 
              
            if response.status_code != 201:
                raise ValueError(f"{response.json()['detail']}")
            
            price = selected_profile.price
            short_code = payment_details.short_code
            # acc_no_prefix = payment_details.acc_no_prefix
            created_at = timezone.now()
            first_name = client.first_name
            last_name = client.last_name
            phone = client.phone
            # service_id = self.get_next_id()
            acc_no = client.custom_id # acc_no_prefix + str(service_id).zfill(5)
            context = {"first_name": first_name, "last_name": last_name, "paybill": short_code, "created_at": created_at, "acc_no": acc_no, "price": price}
            rendered_text = render_template(template_text=template_text, context=context)        
            bulk_sms(mobile_list=[phone,], message=rendered_text)
            
            print(request.data)
            return self.create(request, *args, **kwargs)
            
        except Client.DoesNotExist:
            return Response({"error": "Client not found"}, status=status.HTTP_404_NOT_FOUND)
        
        except PPPProfile.DoesNotExist:
            return Response({"error": f"PPP Profile {profile} dees not exist"}, status=status.HTTP_404_NOT_FOUND)
        
        except PaymentDetails.DoesNotExist:
            return Response({"error": "payment details have not yet been set"}, status=status.HTTP_400_BAD_REQUEST)
        
        except CreateServiceSMS.DoesNotExist:
            return Response({"error": "Send payment received SMS has not been set."}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({"error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)
        
        # request.data['client'] = client_id
        
        # pppoe_data = {
        #     "name": username,
        #     "password": password,
        #     "profile": profile,
        #     "service": "pppoe"
        # }
        
        # try:
        #     response = interceptor_requests("put", "ppp/secret", json=pppoe_data)   
        #     if response.status_code != 201:
        #         raise ValueError(f"{response.json()['detail']}")
            
        # except Exception as e:
        #     return Response({"error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)
        
        # try:
        #     price = selected_profile.price
        #     short_code = payment_details.short_code
        #     # acc_no_prefix = payment_details.acc_no_prefix
        #     created_at = timezone.now()
        #     first_name = client.first_name
        #     last_name = client.last_name
        #     phone = client.phone
        #     # service_id = self.get_next_id()
        #     acc_no = client.custom_id # acc_no_prefix + str(service_id).zfill(5)
        #     context = {"first_name": first_name, "last_name": last_name, "paybill": short_code, "created_at": created_at, "acc_no": acc_no, "price": price}
        #     rendered_text = render_template(template_text=template_text, context=context)        
        #     bulk_sms(mobile_list=[phone,], message=rendered_text)
            
        
        # except Exception as e:
        #     print("hello", e)
        #     return Response({"error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)

        # return self.create(request, *args, **kwargs)
    

class RetrieveUpdateDestroyPPPServiceView(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    serializer_class = PPPServiceSerializer
    queryset = PPPService.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        client_id = request.data.get('client')
        
        username = request.data.get("username")
        password = request.data.get("password")
        profile = request.data.get("profile")
        if client_id:
            try:
                client = Client.objects.get(id=client_id)
            except Client.DoesNotExist:
                return Response({'error': 'Client not found'}, status=404)
            request.data['client'] = client_id    
        
        # make a patch request to the router changing the profile and the password
            
        return self.update(request, *args, **kwargs)
    
    def patch(self, request, *args, **kwargs):
        disabled = str(request.data.get("disabled"))
        client_id = request.data.get('client')
        password = request.data.get('password')
        profile = request.data.get("profile")
        profile_id = kwargs.get("pk")
        username = request.data.get("username")
        caller_id = request.data.get("caller_id")
        
        try:
            service = PPPService.objects.get(pk=profile_id)
            service_name = service.username
        except PPPProfile.DoesNotExist:
            return Response({"error": f"service {profile_id} does not exist"}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            exists_response = interceptor_requests("get", path=f"ppp/secret?name={service_name}")
            if exists_response.json() == []:
                return Response({"error": f"Client {service_name} does not exist"}, status=status.HTTP_404_NOT_FOUND)
            
        except Exception as e:
            return Response({"error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)
        
        if client_id:
            try:
                client = Client.objects.get(id=client_id)
            except Client.DoesNotExist:
                return Response({'error': 'Client not found'}, status=404)
            request.data['client'] = client.pk
        
        if disabled != "None":
            if disabled == "True":
                data = {"disabled": True}
                try:
                    password_response = interceptor_requests("patch", path=f"ppp/secret/{service_name}", json=data)
                    
                    if password_response.status_code != 200:
                        raise ValueError("Could not disable the secret in the router")
                    
                except Exception as e:
                    return Response({"error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)
            
            elif disabled == "False":
                data = {"disabled": False}
                try:
                    password_response = interceptor_requests("patch", path=f"ppp/secret/{service_name}", json=data)
                    
                    if password_response.status_code != 200:
                        raise ValueError("Could not enable the secret in the router")
                    
                except Exception as e:
                    return Response({"error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)
        
        if password:
            data = {"password": password}
            try:
                password_response = interceptor_requests("patch", path=f"ppp/secret/{service_name}", json=data)
                
                if password_response.status_code != 200:
                    raise ValueError("Could not change secret's password in the router")
                
            except Exception as e:
                return Response({"error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)
        
        if username:
            data = {"name": username}
            try:
                username_response = interceptor_requests("patch", path=f"ppp/secret/{service_name}", json=data)
                
                if username_response.status_code != 200:
                    raise ValueError("Could not change secret's username in the router")
                
            except Exception as e:
                return Response({"error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)
            
        if profile:
            data = {"profile": profile}
            try:
                password_response = interceptor_requests("patch", path=f"ppp/secret/{service_name}", json=data)
                
                if password_response.status_code != 200:
                    raise ValueError("Could not change secret's profile in the router")
                
            except Exception as e:
                return Response({"error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)
            
        if caller_id:
            data = {"caller-id": caller_id}
            
            try:
                caller_id_response = interceptor_requests("patch", path=f"ppp/secret/{service_name}", json=data)
                
                if caller_id_response.status_code != 200:
                    raise ValueError("Could not change secret's profile in the router")
                
            except Exception as e:
                return Response({"error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)
        
        return self.partial_update(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        profile_id = kwargs.get("pk")
        
        try:
            service = PPPService.objects.get(id=profile_id)
            service_name = service.username
        except:
            return Response({"error": f"Client {profile_id} does not exist"}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            exists_response = interceptor_requests("get", path=f"ppp/secret?name={service_name}")
            if exists_response.json() == []:
                return Response({"error": f"Client {service_name} does not exist"}, status=status.HTTP_404_NOT_FOUND)
            
            secret_id = exists_response.json()[0][".id"]
            
            delete_response = interceptor_requests("delete", path=f"ppp/secret/{secret_id}")
            
            if delete_response.status_code != 204:
                raise ValueError("Could not delete the ppp secret in the router")
        except Exception as e:
            return Response({"error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)
        
        
        return self.destroy(request, *args, **kwargs)
    
    
@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated, ])
def get_ppp_services_for_single_client(request:Request, client):
    client_id = client
    if client_id:
        try:
            client = Client.objects.get(id=client_id)
            serializer = PPPClientSerializer(instance=client, context={"request": request})
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        except Client.DoesNotExist:
            return Response({'error': 'Client not found'}, status=404)
    else:
        return Response({"error": "Client ID is required"}, status=status.HTTP_400_BAD_REQUEST)
    


@api_view(http_method_names=['DELETE'])
@permission_classes([IsAuthenticated, ])
def suspend_client(request:Request, client):
    try:
        payment_details = PaymentDetails.objects.get(custom_id=1)
        template_text = SuspendedSMS.objects.get(custom_id=1).message
        service = PPPService.objects.get(id=client)
        service_profile = PPPProfile.objects.get(name=service.profile)
        service_name = service.username
        first_name = service.client.first_name
        last_name = service.client.last_name
        phone = service.client.phone
        # acc_no_prefix = payment_details.acc_no_prefix
        short_code = payment_details.short_code
        acc_no = service.client.custom_id # acc_no_prefix + str(service.pk).zfill(5)
        price = service_profile.price
        
    except PPPService.DoesNotExist:
        return Response({"error": f"Service {client} was not found"}, status=status.HTTP_404_NOT_FOUND)
    
    except PaymentDetails.DoesNotExist:
        return Response({"error": "Payment details have not been set"}, status=status.HTTP_404_NOT_FOUND)
    
    except SuspendedSMS.DoesNotExist:
        return Response({"error": "Client suspend SMS has not been set"}, status=status.HTTP_404_NOT_FOUND)
    
    try:
        service_response = interceptor_requests("get", f"ppp/secret?name={service_name}")
        
        if len(service_response.json()) == 0:
            raise ValueError(f"Could not find client with name {service_name}")
        
        service_id = service_response.json()[0][".id"]
        
        disable_data = {"disabled": True}
        disable_client_response = interceptor_requests("patch", f"ppp/secret/{service_id}", json=disable_data)
        
        if disable_client_response.status_code != 200:
            raise ValueError("Could not disable client")
        
        active_response = interceptor_requests("get", f"ppp/active?name={service_name}")
        
        if len(active_response.json()) != 0:
            active_connection_id = active_response.json()[0][".id"]
            
            deactivate_response = interceptor_requests("delete", f"ppp/active/{active_connection_id}")
            
            if deactivate_response.status_code != 204:
                raise ValueError("Could not deactivate client")
        
        service.disabled = True
        service.suspension_date = timezone.now()
        service.is_suspended = True
        service.save()
        
        context = {"first_name": first_name, "last_name": last_name, "paybill": short_code, "acc_no": acc_no, "price": price}
        rendered_text = render_template(template_text=template_text, context=context)
        bulk_sms(mobile_list=[phone,], message=rendered_text)
        
    except Exception as e:
        print(f"An exception has occured at 'suspend_client': {e}") 
    return Response(status=status.HTTP_204_NO_CONTENT)


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
        service = PPPService.objects.get(pk=client)
        service_name = service.username
        service_profile = PPPProfile.objects.get(name=service.profile)
        template_text = ActivateServiceSMS.objects.get(custom_id=1).message
        payment_details = PaymentDetails.objects.get(custom_id=1)
        
        profile_price = service_profile.price
        expiry = service_profile.expiry
        if service.client.balance < profile_price:
            raise ValueError("Client's balance is less than Profile's price. Could not activate service")
        
        service_response = interceptor_requests("get", f"ppp/secret?name={service_name}")
        
        if service_response.json() == []:
            raise ValueError(f"Could not find client with name {service_name}")
        
        service_id = service_response.json()[0][".id"]
        
        disable_data = {"disabled": False}
        disable_client_response = interceptor_requests("patch", f"ppp/secret/{service_id}", json=disable_data)
        
        if disable_client_response.status_code != 200:
            raise ValueError("Could not enable client")
        
        service.client.balance -= profile_price
        service.client.save()
        
        service.disabled = False
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
        bulk_sms(mobile_list=[phone,], message=rendered_text)
        
        return {"message": "Service activated successfully"}, None
    
    except ActivateServiceSMS.DoesNotExist:
        return None, "Send activate client SMS has not been set."
        
    except PPPProfile.DoesNotExist:
        return None, f"Profile {service.profile} was not found"
    
    except PPPService.DoesNotExist:
        return None, f"Service {client} was not found"
    
    except PaymentDetails.DoesNotExist:
        return None, "payment details have not yet been set"     
        
    except Exception as e:
        return None, str(e)


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated, ])
def client_mac_address(request:Request):
    username = request.data.get("username")
    try:
        response = interceptor_requests("get", f"ppp/active?name={username}")
        if len(response.json()) == 0:
            raise ValueError("The user is offline.")
        caller_id = response.json()[0]["caller-id"]
        data = {"caller_id": caller_id}
        return Response(data=data, status=status.HTTP_200_OK)
        
    except PPPService.DoesNotExist:
        return Response({"error": f"service {username} does not exist"}, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        return Response({"error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)
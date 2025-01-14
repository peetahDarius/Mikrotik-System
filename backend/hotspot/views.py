from datetime import timedelta
from django.shortcuts import render
import requests
from rest_framework import status, mixins, generics
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated

from .serializers import AccessPointsSerializer, SuccessfulConnectionSerializer, UnifiCredentialsSerializer
from hotspot_payment.models import Payment

from .models import AccessPoints, SuccessfullConnection, TempData, UnifiCredentials
from hotspot_packages.models import Package
from hotspot_payment.views import stk_initiate
from django.db import transaction
from unifi import controller
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.utils import timezone

# Create your views here.

class ListCreateUnifiCredentials(generics.GenericAPIView, mixins.CreateModelMixin, mixins.ListModelMixin):
    
    serializer_class = UnifiCredentialsSerializer
    queryset = UnifiCredentials.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        with transaction.atomic():
            UnifiCredentials.objects.all().delete()
            return self.create(request, *args, **kwargs)


class DestroyUnifiCredentialsView(generics.GenericAPIView, mixins.DestroyModelMixin):
    
    serializer_class = UnifiCredentialsSerializer
    queryset = UnifiCredentials.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

class ListSuccessfullConnectionView(generics.GenericAPIView, mixins.ListModelMixin):
    
    serializer_class = SuccessfulConnectionSerializer
    queryset = SuccessfullConnection.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class RetrieveSuccessfullConnectionView(generics.GenericAPIView, mixins.RetrieveModelMixin):
    serializer_class = SuccessfulConnectionSerializer
    queryset = SuccessfullConnection.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    

@api_view(http_method_names=["POST"])
@permission_classes([AllowAny, ])
def stk_push(request:Request):
    data = request.data
    item = data.get("item")
    phone_number = data.get("phone_number")
    mac = data.get("mac")
    ap_mac = data.get("ap_mac")
    amount = item.get("amount")
    
    if not phone_number:
        return Response({"error": "Phone Number is needed"}, status=status.HTTP_400_BAD_REQUEST)
    
    if mac is None or ap_mac is None:
        return Response({"error": "Invalid phone address"}, status=status.HTTP_400_BAD_REQUEST)
    
    if not item:
        return Response({"error": "Invalid package credentials"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        package_id = item.get("id")
        package = Package.objects.get(pk=package_id)
        
    except Package.DoesNotExist:
        return Response({"error: Package not found"}, status=status.HTTP_404_NOT_FOUND)
    
    if phone_number[:2] == "07":
        phone_no = "254" + phone_number[1:]
        
    elif phone_number[:2] == "01":
        phone_no = "254" + phone_number[1:]
    
    elif phone_number[:2] == "+2":
        phone_no = phone_number[1:]

    else:
        phone_no = phone_number
    
    response = stk_initiate(amount=amount, phone_number=phone_no)
    response_code = response.get("ResponseCode")
    if response_code != "0":
        return Response({"error": response.get("errorMessage")}, status=status.HTTP_400_BAD_REQUEST)
    
    checkout_request_id = response.get("CheckoutRequestID")
    merchant_request_id = response.get("MerchantRequestID")
    temp_data = TempData(phone_number=phone_number, mac=mac, ap_mac=ap_mac, package=package,checkout_request_id=checkout_request_id, merchant_request_id=merchant_request_id)
    temp_data.save()
    return Response(status=status.HTTP_202_ACCEPTED)


@api_view(http_method_names=["POST"])
@permission_classes([AllowAny, ])
def confirm(request:Request):
    data = request.data
    print(data)
    checkout_request_id = data["Body"]["stkCallback"]["CheckoutRequestID"]
    merchant_request_id = data["Body"]["stkCallback"]["MerchantRequestID"]
    try:
        temp_data = TempData.objects.get(checkout_request_id=checkout_request_id, merchant_request_id=merchant_request_id)
        temp_phone_number = temp_data.phone_number
        
        if data["Body"]["stkCallback"]["ResultCode"] != 0:
            error_desc = data["Body"]["stkCallback"]["ResultDesc"]
            print(error_desc)
            
            #  send the error to the frontend and set loading to false
            print(f"Sending message to group payment_status_{temp_phone_number}")
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                f'payment_status_{temp_phone_number}',
                {
                    'type': 'payment_status_update',
                    'message': f'Payment failed',
                    "error": f"{error_desc}"
                }
            )
            return Response(status=status.HTTP_201_CREATED)
        else:
            print(data)
            amount = data["Body"]["stkCallback"]['CallbackMetadata']['Item'][0]["Value"]
            mpesa_receipt_number = data["Body"]["stkCallback"]['CallbackMetadata']['Item'][1]["Value"]
            transaction_date = str(data["Body"]["stkCallback"]['CallbackMetadata']['Item'][3]["Value"]) if len(data["Body"]["stkCallback"]['CallbackMetadata']['Item']) == 5 else data["Body"]["stkCallback"]['CallbackMetadata']['Item'][2]["Value"]
            phone_number = data["Body"]["stkCallback"]['CallbackMetadata']['Item'][4]["Value"] if len(data["Body"]["stkCallback"]['CallbackMetadata']['Item']) == 5 else data["Body"]["stkCallback"]['CallbackMetadata']['Item'][3]["Value"]
            
            new_payment = Payment(amount=amount, receipt_number=mpesa_receipt_number, transaction_date=transaction_date, phone_number=phone_number)
            new_payment.save()
            

            phone = temp_data.phone_number
            mac = temp_data.mac
            ap_mac = temp_data.ap_mac
            package = temp_data.package
            
            up = package.up
            down = package.down
            mbytes = package.byte_quota
            minutes = package.minutes
            unifi_connect(mac=mac, ap_mac=ap_mac, up=up, down=down, minutes=minutes, mbytes=mbytes)
            
            channel_layer = get_channel_layer()
            print(f"Sending message to group payment_status_{temp_phone_number}")
            async_to_sync(channel_layer.group_send)(
                f'payment_status_{temp_phone_number}',
                {
                    'type': 'payment_status_update',
                    'message': 'Payment successful'
                }
            )
            
            successful_conn = SuccessfullConnection(ap_mac=ap_mac, mac=mac, phone_number=phone, package=package)
            with transaction.atomic():
                successful_conn.save()
                temp_data.delete()
            
            now = timezone.now()

            # Calculate the time that is 5 minutes ago
            five_minutes_ago = now - timedelta(minutes=5)
            
            # Delete all TempData objects where created_at is older than 5 minutes ago
            TempData.objects.filter(created_at__lt=five_minutes_ago).delete()
            
            return Response(status=status.HTTP_201_CREATED)
        
    except TempData.DoesNotExist:
        print("Clients checkout and merchant request number not found")

def unifi_connect(mac, ap_mac, up, down, minutes, mbytes):
    try:
        credentials = UnifiCredentials.objects.get(custom_id=1)
        host = credentials.host
        port = credentials.port
        version = credentials.version
        username = credentials.username
        password = credentials.password
        
        
        uconn = controller.Controller(host=host, port=port, version=version)
        
        uconn.username = username
        uconn.password = password
        
        response = uconn.authorize_guest(mac=mac, ap_mac=ap_mac, minutes=minutes, up=up, down=down, mbytes=mbytes)
        
        return response
        
        
    except UnifiCredentials.DoesNotExist:
        error = "Controller credentials not set"
        print(error)
        return error
    
    

@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated, ])
def access_points(request:Request):
    try:
        credentials = UnifiCredentials.objects.get(custom_id=1)
        host = credentials.host
        username = credentials.username
        password = credentials.password
        port = credentials.port
        
        uconn = controller.Controller(host=host, port=port)
        uconn.username = username
        uconn.password = password
        
        access_points_response = uconn.get_aps()
        
        try:
            all_access_points = AccessPoints.objects.all()
            
            if len(access_points_response) != len(all_access_points):
                AccessPoints.objects.all().delete()
                
                for item in access_points_response:
                    name = item.get("name")
                    mac = item.get("mac")
                    ip = item.get("ip")
                    model = item.get("model")
                    version = item.get("version")
                    
                    access_point_data = AccessPoints(name=name, mac=mac, ip=ip, model=model, version=version)
                    access_point_data.save()
        except Exception as e:
            print(f"An exception has occured: {e}")
        finally:
            return Response(data=access_points_response, status=status.HTTP_200_OK)
       
    except UnifiCredentials.DoesNotExist:
        return Response({"error": "Controller credentials not set"}, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        return Response({"error": f"An error has occurred: {e}"})


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated, ])
def events(request:Request):
    try:
        credentials = UnifiCredentials.objects.get(custom_id=1)
        host = credentials.host
        username = credentials.username
        password = credentials.password
        port = credentials.port
        
        uconn = controller.Controller(host=host, port=port)
        uconn.username = username
        uconn.password = password
        
        events_response = uconn.get_events()
        
        return Response(data=events_response[0:20], status=status.HTTP_200_OK)   
       
    except UnifiCredentials.DoesNotExist:
        return Response({"error": "Controller credentials not set"}, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        return Response({"error": f"An error has occurred: {e}"})


class ListAPView(generics.GenericAPIView, mixins.ListModelMixin):
    
    serializer_class = AccessPointsSerializer
    queryset = AccessPoints.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated, ])
def get_numbers(request:Request):
    connections = Payment.objects.all()
    numbers = []
    
    for connection in connections:
        if connection.phone_number not in numbers:
            numbers.append(connection.phone_number)
            
    return Response(data=numbers, status=status.HTTP_200_OK)

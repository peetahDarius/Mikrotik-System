from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from unifi import controller
from .models import UnifiCredentials
from rest_framework import status

@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated, ])
def authorize_guest(request:Request):
    data = request.data
    mac = data.get("mac")
    ap_mac = data.get("ap_mac")
    up = data.get("up")
    down = data.get("down")
    mbytes = data.get("mbytes")
    minutes = data.get("minutes")
    
    if not up:
        return Response({"error": "up is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    if not down:
        return Response({"error": "up is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    if not mac:
        return Response({"error": "MAC is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    if not ap_mac:
        return Response({"error": "AP_MAC is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        credentials = UnifiCredentials.objects.get(custom_id=1)
        host = credentials.host
        username = credentials.username
        password = credentials.password
        port = credentials.port
        
        uconn = controller.Controller(host=host, port=port)
        uconn.username = username
        uconn.password = password
        
        uconn.authorize_guest(mac=mac, ap_mac=ap_mac, up=up, down=down, mbytes=mbytes, minutes=minutes)
        
        return Response(status=status.HTTP_200_OK)   
       
    except UnifiCredentials.DoesNotExist:
        return Response({"error": "Controller credentials not set"}, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        return Response({"error": f"An error has occurred: {e}"})
    

@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated, ])
def forget_guest(request:Request):
    data = request.data
    mac = data.get("mac")
    if not mac:
        return Response({"error": "MAC is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        credentials = UnifiCredentials.objects.get(custom_id=1)
        host = credentials.host
        username = credentials.username
        password = credentials.password
        port = credentials.port
        
        uconn = controller.Controller(host=host, port=port)
        uconn.username = username
        uconn.password = password
        
        uconn.forget_sta(macs=[mac])
        
        return Response(status=status.HTTP_200_OK)   
       
    except UnifiCredentials.DoesNotExist:
        return Response({"error": "Controller credentials not set"}, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        return Response({"error": f"An error has occurred: {e}"})
    

@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated, ])
def block_guest(request:Request):
    data = request.data
    mac = data.get("mac")
    if not mac:
        return Response({"error": "MAC is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        credentials = UnifiCredentials.objects.get(custom_id=1)
        host = credentials.host
        username = credentials.username
        password = credentials.password
        port = credentials.port
        
        uconn = controller.Controller(host=host, port=port)
        uconn.username = username
        uconn.password = password
        
        uconn.block_sta(mac=mac)
        
        return Response(status=status.HTTP_200_OK)   
       
    except UnifiCredentials.DoesNotExist:
        return Response({"error": "Controller credentials not set"}, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        return Response({"error": f"An error has occurred: {e}"})
    
@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated, ])
def unblock_guest(request:Request):
    data = request.data
    mac = data.get("mac")
    if not mac:
        return Response({"error": "MAC is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        credentials = UnifiCredentials.objects.get(custom_id=1)
        host = credentials.host
        username = credentials.username
        password = credentials.password
        port = credentials.port
        
        uconn = controller.Controller(host=host, port=port)
        uconn.username = username
        uconn.password = password
        
        uconn.unblock_sta(mac=mac)
        
        return Response(status=status.HTTP_200_OK)   
       
    except UnifiCredentials.DoesNotExist:
        return Response({"error": "Controller credentials not set"}, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        return Response({"error": f"An error has occurred: {e}"})
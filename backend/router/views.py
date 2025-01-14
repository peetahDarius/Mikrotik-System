import os
from django.conf import settings
from django.core.files.base import ContentFile
import requests
from requests.auth import HTTPBasicAuth
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Router
from .serializers import RouterSerializer

@api_view(http_method_names=["POST", "GET", "DELETE"])
@permission_classes([IsAuthenticated])
def create_router(request):
    if request.method == "GET":
        routers = Router.objects.all()
        serializer = RouterSerializer(routers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    if request.method == "POST":
        # Extract and validate input data
        required_fields = ["name", "username", "password", "ip"]
        data = {field: request.data.get(field) for field in required_fields}

        missing_fields = [field for field, value in data.items() if not value]
        if missing_fields:
            return Response({"error": f"Router {', '.join(missing_fields)} is needed"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Handle file uploads
        cert_file = request.FILES.get('certificate')
        key_file = request.FILES.get('decrypted_key')

        if cert_file and key_file:
            # Read file contents
            cert_content = cert_file.read()
            key_content = key_file.read()

            # Ensure directories exist
            cert_dir = os.path.join(settings.MEDIA_ROOT, 'certificates')
            key_dir = os.path.join(settings.MEDIA_ROOT, 'keys')
            os.makedirs(cert_dir, exist_ok=True)
            os.makedirs(key_dir, exist_ok=True)

            # Save the files to permanent storage
            cert_path = os.path.join(cert_dir, 'cert_webfig.crt')
            key_path = os.path.join(key_dir, 'cert_webfig_decrypt.key')
            
            with open(cert_path, 'wb') as cert_f:
                cert_f.write(cert_content)

            with open(key_path, 'wb') as key_f:
                key_f.write(key_content)

            # Validate the router's credentials
            url = f'https://{data["ip"]}/rest/system/resource'
            try:
                print(f"[+] creating a request to send to url {url}")
                response = requests.get(
                    url=url,
                    auth=HTTPBasicAuth(username=data["username"], password=data["password"]),
                    cert=(cert_path, key_path), verify=False
                )
                # print(response.json())
                print(f"[+] sent request to router {url} successfully")
                if response.status_code == 200:
                    print("[+] The router returned response code 200..")
                    # Delete existing routers and associated files
                    try:
                        routers = Router.objects.all()
                        for router in routers:
                            if router.cert_webfig:
                                router.cert_webfig.delete(save=False)
                            if router.cert_webfig_decrypt:
                                router.cert_webfig_decrypt.delete(save=False)
                            router.delete()
                            
                        router = Router(
                            name=data["name"],
                            username=data["username"],
                            password=data["password"],
                            ip=data["ip"],
                            cert_webfig=cert_path,
                            cert_webfig_decrypt=key_path
                        )
                        router.save()
                    except Router.DoesNotExist:
                    # Create and save new router object
                        router = Router(
                            name=data["name"],
                            username=data["username"],
                            password=data["password"],
                            ip=data["ip"],
                            cert_webfig=cert_path,
                            cert_webfig_decrypt=key_path
                        )
                        router.save()
                        
                    finally:
                        with open(cert_path, 'wb') as cert_f:
                            cert_f.write(cert_content)

                        with open(key_path, 'wb') as key_f:
                            key_f.write(key_content)


                    return Response(RouterSerializer(router).data, status=status.HTTP_201_CREATED)
                else:
                    print(f"[-] The router returned response code {response.status_code}")
                    raise ValueError(f"The request returned an error {response.status_code}")
                
            except requests.exceptions.SSLError as ssl_err:
                return Response({"error": "SSL error: " + str(ssl_err)}, status=status.HTTP_400_BAD_REQUEST)
            
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        else:
            return Response({"error": "Certificate and decrypted key files are required"}, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "DELETE":
        try:
            router = Router.objects.get(custom_id=1)
            # Delete the router and its associated files
            if router.cert_webfig:
                router.cert_webfig.delete(save=False)
            if router.cert_webfig_decrypt:
                router.cert_webfig_decrypt.delete(save=False)
            router.delete()
            return Response({"message": "Router deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        
        except Router.DoesNotExist:
            return Response({"error": "Router not found"}, status=status.HTTP_404_NOT_FOUND)

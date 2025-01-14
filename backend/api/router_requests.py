import json
import requests
from django.conf import settings

def interceptor_requests(method, path, **kwargs):
    from router.models import Router

    # Paths for certificates
    CERT_PATH = f"{settings.MEDIA_ROOT}/certificates/cert_webfig.crt"
    KEY_PATH = f"{settings.MEDIA_ROOT}/keys/cert_webfig_decrypt.key"

    # Basic authentication credentials
    USERNAME = None
    PASSWORD = None
    BASE_URL = None

    try:
        router = Router.objects.get(custom_id=1)
        USERNAME = router.username
        PASSWORD = router.password
        BASE_URL = f"https://{router.ip}/rest/"
    except Router.DoesNotExist:
        # Handle the case where the Router instance does not exist
        print("Router instance with ID 1 does not exist.")
        # Set default or fallback values
        USERNAME = 'default_username'
        PASSWORD = 'default_password'
        BASE_URL = 'https://default_ip/rest/'
        
    except Exception as e:
        print(f"An error has occured: {e}")
    
    # Prepend the base URL to the path
    url = BASE_URL + path
    
    # Include the cert and verify arguments by default
    kwargs['cert'] = (CERT_PATH, KEY_PATH)
    kwargs['verify'] = False
    
    # Set the Content-Type to application/json by default
    headers = kwargs.get('headers', {})
    headers['Content-Type'] = 'application/json'
    kwargs['headers'] = headers
    
    # Add basic authentication
    kwargs['auth'] = (USERNAME, PASSWORD)
    
    # Serialize JSON data if provided
    if 'json' in kwargs:
        kwargs['data'] = json.dumps(kwargs.pop('json'))

    # Call the appropriate requests method
    response = requests.request(method, url, **kwargs)
    
    return response

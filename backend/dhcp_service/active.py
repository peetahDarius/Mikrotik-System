from api.router_requests import interceptor_requests
import requests


def get_client_status(service_address):
    try:
        data = {
            "address": service_address,
            "count": 2,
        }
        response = interceptor_requests("post", path=f"ping", json=data)
        
        return "offline" if response.json()[0]["received"] == "0" else "online"


    except requests.exceptions.RequestException as e:
        return f"Connection error: {str(e)}"
    
    except Exception as e:
        return f"{e}"

from api.router_requests import interceptor_requests
import requests


def get_client_status(service_name):
    try:
        response = interceptor_requests("get", path="ppp/active")
        # response = requests.get(url, auth=HTTPBasicAuth(mikrotik_user, mikrotik_password))

        if response.status_code == 200:
            active_services = response.json()

            # Check if the client is active
            for service in active_services:
                if service['name'] == service_name:
                    return 'online'

            return 'offline'
        else:
            return f"Error: {response.status_code}"

    except requests.exceptions.RequestException as e:
        return f"Connection error: {str(e)}"

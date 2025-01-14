from django.urls import re_path
from .consumers import ClientStatusConsumer

websocket_url_patterns = [
    re_path(r'api/ws/dhcp/service-status/', ClientStatusConsumer.as_asgi())
]
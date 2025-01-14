"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
import ppp_service.routing as ppp_service_routing
import dhcp_service.routing as dhcp_service_routing
import hotspot.routing as hotspot_routing
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# application = get_asgi_application()

application = ProtocolTypeRouter({
    "http": get_asgi_application(), 
    "websocket": AuthMiddlewareStack(  # Handle WebSocket connections
        URLRouter(
            ppp_service_routing.websocket_url_patterns +
            dhcp_service_routing.websocket_url_patterns +
            hotspot_routing.websocket_urlpatterns    
        )
    ),
})
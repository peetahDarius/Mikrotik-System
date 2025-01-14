from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'api/ws/payment_status/(?P<room_name>\w+)/$', consumers.PaymentStatusConsumer.as_asgi()),
    re_path(r'api/ws/active-devices/$', consumers.ActiveDevicesConsumer.as_asgi()),
]

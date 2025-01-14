from django.urls import path
from . import views

urlpatterns = [
    path("", views.ListCreateDHCPServiceView.as_view(), name="list-create-dhcp-service"),
    path("<int:pk>/", views.RetrieveUpdateDestroyDHCPServiceView.as_view(), name="retrieve-update-destroy-dhcp-service"),
    path("client/<int:client>/", views.get_dhcp_services_for_single_client, name="get-client-dhcp-services"),
    path("client/suspend/<int:client>/", views.suspend_client, name="suspend-client"),
    path("client/activate/<int:client>/", views.activate_client_view, name="activate-client"),
    path("client/mac/", views.client_mac_address, name="get-mac-address")
]

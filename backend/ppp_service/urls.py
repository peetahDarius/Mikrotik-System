from django.urls import path
from . import views

urlpatterns = [
    path("", views.ListCreatePPPServiceView.as_view(), name="list-create-ppp-service"),
    path("<int:pk>/", views.RetrieveUpdateDestroyPPPServiceView.as_view(), name="retrieve-update-delete-ppp-service"),
    path("client/<int:client>/", views.get_ppp_services_for_single_client, name="get-client-ppp-services"),
    path("client/suspend/<int:client>/", views.suspend_client, name="suspend-client"),
    path("client/activate/<int:client>/", views.activate_client_view, name="activate-client"),
    path("client/mac/", views.client_mac_address, name="get-mac-address")
]
from . import views
from django.urls import path

urlpatterns = [
    path("servers/", views.ListCreateServerView.as_view(), name="list-create-server"),
    path("servers/<int:pk>/", views.RetrieveUpdateDeleteServerView.as_view(), name="retrieve-update-server"),
    path("networks/", views.ListCreateNetworkView.as_view(), name="list-create-network"),
    path("networks/<int:pk>/", views.RetrieveUpdateDeleteNetworkView.as_view(), name="retrieve-update-network"),
    path("ip/available/", views.available, name="available-ips"),
]

from . import views
from django.urls import path

urlpatterns = [
    path("", views.ListCreateAddressView.as_view(), name="list-create-address"),
    path("<int:pk>/", views.RetrieveUpdateDestroyAddresssView.as_view(), name="retrieve-update-destroy-address"),
]

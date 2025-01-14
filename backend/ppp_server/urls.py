from django.urls import path
from . import views

urlpatterns = [
    path("", views.ListCreatePPPServerView.as_view(), name="create-list-ppp-server"),
    path("<int:pk>/", views.RetrieveUpdateEditDestroyPPPServerView.as_view(), name="retrieve-update-delete-ppp-server")
]

from django.urls import path
from . import views

urlpatterns = [
    path("", views.ListCreatePPPProfileView.as_view(), name="list_create_ppp_rofile"),
    path("<int:pk>/", views.RetrieveUpdateDeleteEditPPPProfileView.as_view(), name="retrieve_update_delete_ppp_profile"),
]

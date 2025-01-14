from . import views
from django.urls import path


urlpatterns = [
    path("", views.listCreatePoolView.as_view(), name="list-create-pool"),
    path("<int:pk>/", views.RetrieveUpdateDeletePoolView.as_view(), name="retrieve-update-delete-pool")
]

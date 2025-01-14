from . import views
from django.urls import path


urlpatterns = [
    path("", views.ListCreateQueueView.as_view(), name="list-create-queue"),
    path("<int:pk>/", views.RetrieveUpdateDestroyQueueView.as_view(), name="retrieve-update-delete-queue"),
]

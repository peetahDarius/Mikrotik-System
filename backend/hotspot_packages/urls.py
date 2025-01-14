from django.urls import path
from . import views

urlpatterns = [
    path("", views.ListCreatePackageView.as_view(), name="list-create-package"),
    path("<int:pk>/", views.RetrieveUpdateEditDestroyPackageView.as_view(), name="retrieve-update-delete-package")
]

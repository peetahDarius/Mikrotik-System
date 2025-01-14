from django.urls import path
from . import views


urlpatterns = [
    path("", views.ListCreateStaticPackageView.as_view(), name="list-create-static-package"),
    path("<int:pk>/", views.RetrieveUpdateDestroyStaticPackageView.as_view(), name="retrieve-update-destroy-static-package"),
]

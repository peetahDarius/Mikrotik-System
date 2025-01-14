from django.urls import path
from . import views
from .import_export import import_profiles_csv, export_profiles_csv


urlpatterns = [
    path('', views.ListCreateClientsView.as_view(), name='list-create'),
    path('services/<int:pk>/', views.get_services_for_single_client, name="get-single-client-services"),
    path('<int:pk>/', views.RetrieveUpdateDestroyClientView.as_view(), name='retrieve-update-delete'),
    path('export-csv/', export_profiles_csv, name='export_profiles_csv'),
    path('import-csv/', import_profiles_csv, name='import_profiles_csv'),
]

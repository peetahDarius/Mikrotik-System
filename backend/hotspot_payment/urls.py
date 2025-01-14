from django.urls import path
from . import views


urlpatterns = [
    path("credentials/", views.ListCreateMpesaExpressCredentials.as_view(), name="list-create-mpesa-credentials"),
    path("credentials/<int:pk>/", views.DestroyMpesaExpressCredentialsView.as_view(), name="destroy-mpesa-credentials"),
    path("", views.ListPaymentsView.as_view(), name="list-payments"),
    path("<str:receipt>/", views.RetrievePaymentsView.as_view(), name="retrieve-payment"),
]

from . import views
from django.urls import path

urlpatterns = [
    path("create/", views.create_cash_payment, name="create-cash-payment"),
    path("confirm/", views.confirm, name="confirm"),
    path("simulate/", views.simulate, name="simulate"),
    path("register/", views.register_url, name="register"),
    path("validate/", views.validate, name="validate"),
    path("mpesa/", views.ListMPesaPaymentsView.as_view(), name="list-mpesa-payments"),
    path("mpesa/<str:receipt>/", views.RetrieveMpesaPaymentView.as_view(), name="retrieve-mpesa-payment"),
    path("credentials/", views.ListCreatePaymentDetailsView.as_view(), name="payment-details")
]

from . import views
from django.urls import path

urlpatterns = [
    path("", views.send_sms, name="send-sms"),
    path("create-client-options/", views.create_client_options, name="create-client-options"),
    path("create-service-options/", views.create_service_options, name="create-service-options"),
    path("near-due-options/", views.near_due_options, name="near-due-options"),
    path("suspended-options/", views.suspended_options, name="suspended-options"),
    path("payment-received-options/", views.payment_received_options, name="payment-received-options"),
    path("activate-service-options/", views.activate_service_options, name="activate-service-options"),
    path("create-client/", views.ListCreateClientSMSView.as_view(), name="create-client"),
    path("create-service/", views.ListCreateServiceSMSView.as_view(), name="create-service"),
    path("near-due/", views.ListCreateNearDueSMSView.as_view(), name="near-due"),
    path("suspended/", views.ListCreateSuspendedSMSView.as_view(), name="suspended"),
    path("payment-received/", views.ListCreatePaymentReceivedSMSView.as_view(), name="payment-received"),
    path("credentials/", views.ListCreateSMSCredentialsView.as_view(), name="sms-credentials"),
    path("activate-service/", views.ListCreateActivateServiceSMSView.as_view(), name="activate-service"),
    path("remaining-credits/", views.get_sms_account_data, name="get-remaining-credits"),
    path("sent-sms/", views.get_sent_sms, name="get-sent-sms")
]

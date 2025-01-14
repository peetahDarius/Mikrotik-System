from django.urls import path
from . import views

urlpatterns = [
    path("configurations/", views.ListCreateEmailConfigurationsView.as_view(), name="list-create-email-configuration"),
    path("configurations/<int:pk>/", views.RetrieveUpdateDeleteEmailConfigurationView.as_view(), name="retrieve-update-destroy-configuration"),
    path("send/", views.ListCreateSendEmailView.as_view(), name="list-create-send-email"),
    path("send/<int:pk>/", views.RetrieveUpdateDestroySendEmailView.as_view(), name="retrieve-update-destroy-send-email"),
    path("sent-emails/", views.get_sent_emails, name="get-sent-emails"),
]

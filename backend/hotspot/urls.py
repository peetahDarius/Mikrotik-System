from django.urls import path

from . import reports
from . import actions
from . import views

urlpatterns = [
    path("credentials/", views.ListCreateUnifiCredentials.as_view(), name="unifi-credentials"),
    path("credentials/<int:pk>/", views.DestroyUnifiCredentialsView.as_view(), name="delete-unifi-credentials"),
    path("connect/", views.stk_push, name="send-stk-push"),
    path("confirm/", views.confirm, name="callback-url"),
    path("access-points/", views.access_points, name="access-points"),
    path("access-points-mac/", views.ListAPView.as_view(), name="ap-macs"),
    path("events/", views.events, name="events"),
    path("authorize/", actions.authorize_guest, name="authorize"),
    path("forget/", actions.forget_guest, name="forget"),
    path("block/", actions.block_guest, name="block"),
    path("unblock/", actions.unblock_guest, name="unblock"),
    path("report/connections/", reports.connections_report, name="connections-report"),
    path("report/payments/", reports.payments_report, name="payments-report"),
    path("report/connections/time/", reports.connections_time_report, name="connections-time-report"),
    path("report/payments/time/", reports.payments_time_report, name="payments-time-report"),
    path("report/connections/specific/", reports.specific_ap_connections, name="specific-access-points-connections"),
    path("numbers/", views.get_numbers, name="get-numbers"),
]

from __future__ import absolute_import, unicode_literals
import os

from celery import Celery
from celery.schedules import crontab

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

app = Celery('backend')

app.config_from_object("django.conf.settings", namespace="CELERY")

app.autodiscover_tasks()

app.conf.beat_schedule = {
    'suspend-ppp-clients-every-minute': {
        'task': 'ppp_service.tasks.suspend_ppp_clients',
        'schedule': crontab(minute='*/1'),
    },
    'send-ppp-near-due-sms': {
        'task': 'ppp_service.tasks.ppp_near_due',
        'schedule': crontab(hour=0, minute=0),  # Runs daily at midnight
    },
    'suspend-dhcp-clients-every-minute': {
        'task': 'dhcp_service.tasks.suspend_dhcp_clients',
        'schedule': crontab(minute='*/1'),
    },
    'send-dhcp-near-due-sms': {
        'task': 'dhcp_service.tasks.dhcp_near_due',
        'schedule': crontab(hour=0, minute=0),  # Runs daily at midnight
    },
}

# Generated by Django 5.1 on 2024-08-29 08:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ppp_service', '0002_pppservice_is_suspended'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='pppservice',
            name='suspended_profile',
        ),
    ]

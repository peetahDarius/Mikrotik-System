# Generated by Django 5.1.1 on 2024-11-20 14:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('emails', '0004_alter_emailconfiguration_email_host_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='sendemail',
            name='length',
            field=models.IntegerField(default=1),
        ),
    ]

# Generated by Django 5.1 on 2024-11-14 12:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('emails', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='emailconfiguration',
            name='email_host',
            field=models.CharField(blank=True, default='smtp.gmail.com', max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='emailconfiguration',
            name='email_port',
            field=models.PositiveIntegerField(blank=True, default=587, null=True),
        ),
        migrations.AlterField(
            model_name='emailconfiguration',
            name='is_active',
            field=models.BooleanField(blank=True, default=True, null=True),
        ),
        migrations.AlterField(
            model_name='emailconfiguration',
            name='use_tls',
            field=models.BooleanField(blank=True, default=True, null=True),
        ),
    ]

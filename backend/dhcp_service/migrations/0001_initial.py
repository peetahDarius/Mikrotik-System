# Generated by Django 5.1 on 2024-10-07 07:56

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('client', '0003_alter_client_custom_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='DHCPService',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('package', models.CharField(max_length=200)),
                ('ip_address', models.CharField(max_length=200)),
                ('disabled', models.BooleanField(default=False)),
                ('suspension_date', models.DateTimeField(blank=True, null=True)),
                ('due_date', models.DateTimeField(blank=True, null=True)),
                ('is_suspended', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('client', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='dhcp_services', to='client.client')),
            ],
        ),
    ]

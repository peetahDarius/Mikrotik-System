# Generated by Django 5.1 on 2024-09-11 11:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('payment', '0005_paymentdetails'),
    ]

    operations = [
        migrations.RenameField(
            model_name='paymentdetails',
            old_name='comsumer_secret',
            new_name='consumer_secret',
        ),
    ]

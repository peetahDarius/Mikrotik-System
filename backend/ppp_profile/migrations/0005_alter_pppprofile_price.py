# Generated by Django 5.1 on 2024-10-04 07:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ppp_profile', '0004_pppprofile_expiry'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pppprofile',
            name='price',
            field=models.IntegerField(default=0),
        ),
    ]

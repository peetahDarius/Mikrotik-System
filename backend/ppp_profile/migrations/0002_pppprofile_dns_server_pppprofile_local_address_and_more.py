# Generated by Django 5.1 on 2024-09-04 06:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ppp_profile', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='pppprofile',
            name='dns_server',
            field=models.CharField(default='8.8.8.8', max_length=50),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='pppprofile',
            name='local_address',
            field=models.CharField(default='8.8.8.8', max_length=200),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='pppprofile',
            name='rate_limit',
            field=models.CharField(default='8.8.8.8', max_length=50),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='pppprofile',
            name='remote_address',
            field=models.CharField(default='8.8.8.8', max_length=200),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='pppprofile',
            name='secondary_dns',
            field=models.CharField(default='8.8.8.8', max_length=50),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='pppprofile',
            name='name',
            field=models.CharField(max_length=150, unique=True),
        ),
    ]

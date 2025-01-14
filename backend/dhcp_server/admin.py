from django.contrib import admin
from .models import Network, Server

# Register your models here.

admin.site.register(Server)
admin.site.register(Network)
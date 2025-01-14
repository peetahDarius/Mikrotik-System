from django.contrib import admin

from .models import AccessPoints, SuccessfullConnection, TempData

# Register your models here.


admin.site.register(TempData)
admin.site.register(AccessPoints)
admin.site.register(SuccessfullConnection)
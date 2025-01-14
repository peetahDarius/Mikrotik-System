from rest_framework import serializers
from .models import StaticPackage


class StaticPackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaticPackage
        fields = "__all__"
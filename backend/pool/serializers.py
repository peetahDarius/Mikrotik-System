from dataclasses import fields
from rest_framework import serializers
from .models import Pool

class PoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pool
        fields = "__all__"

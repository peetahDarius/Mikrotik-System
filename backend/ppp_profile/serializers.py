from rest_framework import serializers
from .models import PPPProfile

class PPPProfileSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = PPPProfile
        fields = "__all__"
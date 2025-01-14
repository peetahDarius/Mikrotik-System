from .models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "email", "phone", "date_joined", "password"]
        extra_kwargs = {
            "password": {"write_only": True},  # Hide the password in responses
            "date_joined": {"read_only": True}  # Prevent clients from setting this field
        }
        
    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create_user(password=password, **validated_data)
        return user
from rest_framework import serializers
from .models import User
from .models import Project
import uuid

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'unique_code', 'full_name', 'password', 'role', 'activation_token')
        extra_kwargs = {'password': {'write_only': True}, 'activation_token': {'read_only': True}}

    def create(self, validated_data):
        validated_data['activation_token'] = uuid.uuid4().hex  # Generate a unique activation token
        user = User(
            email=validated_data['email'],
            unique_code=validated_data['unique_code'],
            full_name=validated_data['full_name'],
            role=validated_data['role'],
            activation_token=validated_data['activation_token']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    unique_code = serializers.CharField()
    password = serializers.CharField(write_only=True)


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('id', 'title', 'description', 'contactEmail')
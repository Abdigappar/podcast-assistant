from rest_framework import serializers
from .models import User, PodcastScript, AIHistory


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ['id', 'username', 'email', 'role', 'is_blocked', 'date_joined']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model  = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class PodcastScriptSerializer(serializers.ModelSerializer):
    owner_name = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model  = PodcastScript
        fields = ['id', 'owner', 'owner_name', 'title', 'topic',
                  'content', 'status', 'created_at', 'updated_at']
        read_only_fields = ['owner', 'created_at', 'updated_at']


class AIHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = AIHistory
        fields = ['id', 'user', 'prompt', 'result', 'created_at']
        read_only_fields = ['user', 'result', 'created_at']

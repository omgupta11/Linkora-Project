from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User, ConsumerProfile, ProviderProfile


class ConsumerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsumerProfile
        exclude = ("id", "user")


class ProviderProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProviderProfile
        fields = (
            "business_name",
            "owner_name",
            "category",
            "address",
            "city",
            "state",
            "country",
            "pincode",
            "landmark",
            "gst_number",
            "cover_image",
            "owner_image",
            "created_at",
        )
        read_only_fields = ("created_at",)


class UserSerializer(serializers.ModelSerializer):
    consumer_profile = ConsumerProfileSerializer(read_only=True)
    provider_profile = ProviderProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "username",
            "role",
            "phone",
            "is_verified",
            "consumer_profile",
            "provider_profile",
        )


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Login with email + password (USERNAME_FIELD is email). Adds user payload for the client."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        return token

    def validate(self, attrs):
        identifier = (attrs.get(User.USERNAME_FIELD) or "").strip()
        if identifier and "@" not in identifier:
            match = User.objects.filter(username__iexact=identifier).first()
            if match:
                attrs[User.USERNAME_FIELD] = match.email
        data = super().validate(attrs)
        data["user"] = UserSerializer(self.user).data
        return data

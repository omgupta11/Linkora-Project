from rest_framework import serializers

from .models import Service, ServiceImage


class ServiceImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceImage
        fields = ["id", "image", "alt_text", "created_at"]
        read_only_fields = ["id", "created_at"]


class ServiceSerializer(serializers.ModelSerializer):
    provider_name = serializers.CharField(
        source="provider.username",
        read_only=True,
    )
    provider_business_name = serializers.SerializerMethodField()
    images = ServiceImageSerializer(many=True, read_only=True)

    class Meta:
        model = Service
        fields = [
            "id",
            "provider",
            "provider_name",
            "provider_business_name",
            "title",
            "description",
            "price",
            "category",
            "duration_minutes",
            "lat",
            "lng",
            "is_active",
            "created_at",
            "images",
        ]
        read_only_fields = ["provider", "created_at"]

    def get_provider_business_name(self, obj):
        profile = getattr(obj.provider, "provider_profile", None)
        if profile:
            return profile.business_name
        return obj.provider.username

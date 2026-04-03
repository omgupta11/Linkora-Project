from rest_framework import serializers
from .models import Review, ServiceReview


class ServiceReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(
        source="user.username",
        read_only=True
    )

    class Meta:
        model = ServiceReview
        fields = [
            "id",
            "user_name",
            "rating",
            "comment",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]


class ReviewSerializer(serializers.ModelSerializer):
    consumer_name = serializers.CharField(
        source="consumer.username",
        read_only=True
    )

    class Meta:
        model = Review
        fields = [
            "id",
            "booking",
            "consumer_name",
            "rating",
            "comment",
            "created_at",
        ]
        read_only_fields = ["created_at"]

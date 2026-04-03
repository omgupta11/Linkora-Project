from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import serializers

from .models import Booking
from services.models import Service


class BookingSerializer(serializers.ModelSerializer):
    service_title = serializers.CharField(
        source="service.title",
        read_only=True,
    )
    provider_business_name = serializers.SerializerMethodField()
    consumer_email = serializers.SerializerMethodField()
    service_id = serializers.IntegerField(write_only=True)
    scheduled_date = serializers.DateField(required=False, allow_null=True)
    scheduled_time = serializers.TimeField(required=False, allow_null=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "service",
            "service_id",
            "service_title",
            "provider_business_name",
            "consumer_email",
            "consumer",
            "provider",
            "status",
            "scheduled_date",
            "scheduled_time",
            "price",
            "payment_status",
            "payment_method",
            "created_at",
        ]
        read_only_fields = [
            "consumer",
            "provider",
            "status",
            "price",
            "created_at",
        ]

    def get_provider_business_name(self, obj):
        profile = getattr(obj.provider, "provider_profile", None)
        if profile:
            return profile.business_name
        return obj.provider.email

    def get_consumer_email(self, obj):
        return obj.consumer.email

    def validate(self, attrs):
        if self.instance is None:
            sid = attrs.pop("service_id")
            attrs["service"] = get_object_or_404(Service, pk=sid, is_active=True)
            if not attrs.get("scheduled_date"):
                attrs["scheduled_date"] = timezone.now().date()
            if not attrs.get("scheduled_time"):
                attrs["scheduled_time"] = timezone.now().time()

            # ✅ SET PRICE FROM SERVICE (for historical accuracy)
            service = attrs["service"]
            attrs["price"] = service.price

            # Payment validation and setting
            payment_method = attrs.get("payment_method")
            payment_status = attrs.get("payment_status")

            if service.payment_type == "pay_now":
                if payment_method not in ["upi", "card"]:
                    raise serializers.ValidationError("Payment method required (UPI or Card)")
                attrs["payment_status"] = "paid"
            elif service.payment_type == "pay_later":
                attrs["payment_method"] = "cod"
                attrs["payment_status"] = "pending"
            elif service.payment_type == "both":
                if payment_method == "cod":
                    attrs["payment_status"] = "pending"
                elif payment_method in ["upi", "card"]:
                    attrs["payment_status"] = "paid"

            # Default safety
            if not attrs.get("payment_method"):
                attrs["payment_method"] = "cod"
                attrs["payment_status"] = "pending"

        return attrs


class BookingStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ["status"]

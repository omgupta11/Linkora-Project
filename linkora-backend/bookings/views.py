from django.shortcuts import get_object_or_404
from django.db.models import Count, Q, Sum
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from .models import Booking
from .serializers import BookingSerializer, BookingStatusSerializer
from services.models import Service


# ✅ CREATE BOOKING
class BookingCreateView(generics.CreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user

        if user.role != "consumer":
            raise permissions.PermissionDenied(
                "Only consumers can book services"
            )

        service = serializer.validated_data["service"]

        exists = Booking.objects.filter(
            service=service,
            scheduled_date=serializer.validated_data.get("scheduled_date"),
            scheduled_time=serializer.validated_data.get("scheduled_time"),
            status__in=["pending", "accepted"],
        ).exists()

        if exists:
            raise ValidationError("This slot is already booked")

        serializer.save(
            consumer=user,
            provider=service.provider,
            service=service,
        )


# ✅ USER / PROVIDER BOOKINGS LIST
class MyBookingsView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == "consumer":
            return Booking.objects.filter(consumer=user).select_related(
                "service", "consumer", "provider"
            )

        return Booking.objects.filter(provider=user).select_related(
            "service", "consumer", "provider"
        )


# ✅ PROVIDER ONLY BOOKINGS
class ProviderBookingsView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role != "provider":
            raise permissions.PermissionDenied(
                "Only providers can access this list"
            )

        return Booking.objects.filter(provider=user).select_related(
            "service", "consumer", "provider"
        )


# ✅ BOOKING DETAIL
class BookingDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, booking_id):
        booking = get_object_or_404(
            Booking.objects.select_related("service", "consumer", "provider"),
            pk=booking_id,
        )

        user = request.user

        if user.role == "consumer" and booking.consumer_id != user.id:
            return Response(
                {"error": "Not your booking"},
                status=status.HTTP_403_FORBIDDEN,
            )

        if user.role == "provider" and booking.provider_id != user.id:
            return Response(
                {"error": "Not your booking"},
                status=status.HTTP_403_FORBIDDEN,
            )

        return Response(BookingSerializer(booking).data)


# ✅ NEW: STATUS UPDATE API (FINAL CLEAN VERSION)
class BookingStatusUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, booking_id):
        booking = get_object_or_404(
            Booking.objects.select_related("service", "consumer", "provider"),
            pk=booking_id,
        )

        user = request.user
        new_status = request.data.get("status", "").lower()

        # ✅ VALID STATUS
        if new_status not in ["accepted", "completed", "cancelled"]:
            return Response(
                {"error": "Invalid status"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ❌ FINAL STATES LOCK
        if booking.status in ["completed", "cancelled"]:
            return Response(
                {"error": "Cannot update finalized booking"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ✅ PROVIDER ACTIONS
        if new_status in ["accepted", "completed"]:
            if user.role != "provider" or booking.provider_id != user.id:
                return Response(
                    {"error": "Not authorized"},
                    status=status.HTTP_403_FORBIDDEN,
                )

        # ✅ USER ACTION
        if new_status == "cancelled":
            if user.role != "consumer" or booking.consumer_id != user.id:
                return Response(
                    {"error": "Not authorized"},
                    status=status.HTTP_403_FORBIDDEN,
                )

        # 🔁 TRANSITION RULES
        valid_transitions = {
            "pending": ["accepted", "cancelled"],
            "accepted": ["completed"],
            "completed": [],
            "cancelled": [],
        }

        if new_status not in valid_transitions[booking.status]:
            return Response(
                {"error": f"Cannot change {booking.status} → {new_status}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ✅ SAVE
        serializer = BookingStatusSerializer(
            booking,
            data={"status": new_status},
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            BookingSerializer(booking).data,
            status=status.HTTP_200_OK,
        )


# ✅ PROVIDER DASHBOARD STATS
class ProviderDashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        # ✅ ONLY PROVIDERS
        if user.role != "provider":
            return Response(
                {"error": "Only providers can access this endpoint"},
                status=status.HTTP_403_FORBIDDEN,
            )

        # ✅ GET ALL BOOKINGS FOR THIS PROVIDER
        bookings = Booking.objects.filter(provider=user).select_related(
            "service"
        )

        # ✅ COUNT TOTAL BOOKINGS
        total_bookings = bookings.count()

        # ✅ COUNT PENDING REQUESTS (status = pending)
        pending_requests = bookings.filter(status="pending").count()

        # ✅ COUNT COMPLETED JOBS (status = completed)
        completed_jobs = bookings.filter(status="completed").count()

        # ✅ CALCULATE EARNINGS (sum of service prices for completed bookings)
        earnings = (
            bookings.filter(status="completed")
            .values_list("service__price", flat=True)
            .aggregate(total=Sum("service__price"))["total"]
            or 0
        )

        return Response(
            {
                "total_bookings": total_bookings,
                "pending_requests": pending_requests,
                "completed_jobs": completed_jobs,
                "earnings": float(earnings),
            },
            status=status.HTTP_200_OK,
        )

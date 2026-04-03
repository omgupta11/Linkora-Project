from rest_framework import generics, permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Avg, Count

from .models import Review, ServiceReview
from .serializers import ReviewSerializer, ServiceReviewSerializer
from bookings.models import Booking
from services.models import Service


class ServiceReviewListView(generics.ListAPIView):
    serializer_class = ServiceReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        service_id = self.kwargs.get("service_id")
        return ServiceReview.objects.filter(service_id=service_id).order_by("-created_at")


class ServiceReviewCreateUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, service_id):
        try:
            service = Service.objects.get(id=service_id)
        except Service.DoesNotExist:
            return Response({"error": "Service not found"}, status=status.HTTP_404_NOT_FOUND)

        rating = request.data.get("rating")
        comment = request.data.get("comment", "")

        if not rating:
            return Response({"error": "Rating required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            rating = int(rating)
            if rating < 1 or rating > 5:
                return Response({"error": "Rating must be between 1 and 5"}, status=status.HTTP_400_BAD_REQUEST)
        except (ValueError, TypeError):
            return Response({"error": "Invalid rating"}, status=status.HTTP_400_BAD_REQUEST)

        review, created = ServiceReview.objects.update_or_create(
            user=request.user,
            service=service,
            defaults={"rating": rating, "comment": comment}
        )

        serializer = ServiceReviewSerializer(review)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class ServiceRatingView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, service_id):
        try:
            service = Service.objects.get(id=service_id)
        except Service.DoesNotExist:
            return Response({"error": "Service not found"}, status=status.HTTP_404_NOT_FOUND)

        stats = service.reviews.aggregate(
            average_rating=Avg("rating"),
            total_reviews=Count("id")
        )

        return Response({
            "average_rating": round(stats["average_rating"], 1) if stats["average_rating"] else 0,
            "total_reviews": stats["total_reviews"] or 0,
        })


class ReviewCreateView(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        booking = Booking.objects.get(
            id=self.request.data.get("booking")
        )
        user = self.request.user

        if user.role != "consumer":
            raise ValidationError("Only consumers can leave reviews")

        if booking.consumer != user:
            raise ValidationError("Not your booking")

        if booking.status != "done":
            raise ValidationError("Booking not completed yet")

        if Review.objects.filter(booking=booking).exists():
            raise ValidationError("Review already exists")

        review = serializer.save(
            booking=booking,
            consumer=user,
            provider=booking.provider,
        )
        provider_profile = booking.provider.provider_profile
        if hasattr(provider_profile, "total_reviews") and hasattr(provider_profile, "average_rating"):
            provider_profile.total_reviews += 1
            total_rating = (
                provider_profile.average_rating * (provider_profile.total_reviews - 1)
            ) + review.rating
            provider_profile.average_rating = total_rating / provider_profile.total_reviews
            provider_profile.save()

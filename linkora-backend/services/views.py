from django.db.models import F, FloatField, ExpressionWrapper, Avg, Count
from django.db.models.functions import Power, Sqrt

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Service, ServiceImage
from .serializers import ServiceSerializer, ServiceImageSerializer


class ServiceListCreateView(generics.ListCreateAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Service.objects.filter(provider=self.request.user)

    def perform_create(self, serializer):
        serializer.save(provider=self.request.user)


class ProviderServiceListView(generics.ListAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        provider_id = self.kwargs.get("provider_id")
        return Service.objects.filter(
            provider_id=provider_id,
            is_active=True,
        )


class NearbyServiceListView(generics.ListAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            lat = float(self.request.query_params.get("lat"))
            lng = float(self.request.query_params.get("lng"))
            radius = float(self.request.query_params.get("radius"))
        except (TypeError, ValueError):
            return Service.objects.none()

        category = self.request.query_params.get("category")
        min_price = self.request.query_params.get("min_price")
        max_price = self.request.query_params.get("max_price")

        qs = Service.objects.filter(is_active=True).exclude(
            lat__isnull=True
        ).exclude(
            lng__isnull=True
        )

        if category:
            qs = qs.filter(category=category)

        if min_price:
            qs = qs.filter(price__gte=min_price)

        if max_price:
            qs = qs.filter(price__lte=max_price)

        # ✅ FIXED DISTANCE CALCULATION
        qs = qs.annotate(
            distance=ExpressionWrapper(
                Sqrt(
                    Power(F("lat") - lat, 2) +
                    Power(F("lng") - lng, 2)
                ) * 111,
                output_field=FloatField()
            )
        ).filter(distance__lte=radius).order_by("distance")

        return qs


class ServiceRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.method == "GET":
            return Service.objects.filter(is_active=True)
        return Service.objects.filter(provider=self.request.user)

    def perform_destroy(self, instance):
        # ✅ SOFT DELETE (mark as inactive instead of hard delete)
        instance.is_active = False
        instance.save()


class ServiceImageUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, service_id):
        try:
            service = Service.objects.get(id=service_id, provider=request.user)
        except Service.DoesNotExist:
            return Response({"error": "Service not found"}, status=404)

        if service.images.count() >= 5:
            return Response(
                {"error": "Maximum 5 images allowed"},
                status=400
            )

        serializer = ServiceImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(service=service)
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)


class ServiceImageDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, service_id, image_id):
        try:
            service = Service.objects.get(id=service_id, provider=request.user)
            image = ServiceImage.objects.get(id=image_id, service=service)
        except (Service.DoesNotExist, ServiceImage.DoesNotExist):
            return Response({"error": "Not found"}, status=404)

        image.delete()
        return Response({"message": "Deleted"}, status=204)


# ✅ PROVIDER SERVICES WITH RATINGS
class ProviderServicesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # ✅ ONLY PROVIDERS
        if user.role != "provider":
            return Response(
                {"error": "Only providers can access this endpoint"},
                status=status.HTTP_403_FORBIDDEN,
            )

        # ✅ GET ALL SERVICES FOR THIS PROVIDER
        services = Service.objects.filter(provider=user).annotate(
            average_rating=Avg("reviews__rating"),
            total_reviews=Count("reviews", distinct=True),
        ).prefetch_related("images").order_by("-created_at")

        # ✅ BUILD RESPONSE
        data = []
        for service in services:
            # Get first image if exists
            image_url = None
            if service.images.exists():
                image_url = service.images.first().image.url if service.images.first().image else None

            data.append({
                "id": service.id,
                "title": service.title,
                "price": float(service.price),
                "image": image_url,
                "rating": round(service.average_rating, 1) if service.average_rating else None,
                "total_reviews": service.total_reviews,
                "category": service.category,
                "is_active": service.is_active,
            })

        return Response(data, status=status.HTTP_200_OK)

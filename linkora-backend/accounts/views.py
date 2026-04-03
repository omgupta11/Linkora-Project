from django.db import IntegrityError
from django.contrib.auth import get_user_model

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from .models import ConsumerProfile, ProviderProfile
from .serializers import (
    UserSerializer,
    ConsumerProfileSerializer,
    ProviderProfileSerializer,
)

User = get_user_model()


# ============================
# REGISTER (CONSUMER / PROVIDER)
# ============================
class RegisterAPIView(APIView):
    permission_classes = [AllowAny]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        data = request.data

        required_fields = ["email", "password", "role"]
        for field in required_fields:
            if not data.get(field):
                return Response({field: "This field is required"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=data.get("email")).exists():
            return Response(
                {"email": "User already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if data.get("role") == "provider":
            provider_fields = ["business_name", "owner_name", "category"]
            for field in provider_fields:
                if not data.get(field):
                    return Response({field: "This field is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.create_user(
                username=data["email"],
                email=data["email"],
                password=data["password"],
                role=data["role"],
                phone=data.get("phone"),
            )
        except IntegrityError:
            return Response(
                {"email": "User already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        try:
            if user.role == "consumer":
                ConsumerProfile.objects.create(
                    user=user,
                    full_name=data["full_name"],
                    address=data.get("address", ""),
                    city=data.get("city", ""),
                    state=data.get("state", ""),
                    country=data.get("country", "India"),
                    pincode=data.get("pincode", ""),
                    profile_image=data.get("profile_image"),
                )

            if user.role == "provider":
                ProviderProfile.objects.create(
                    user=user,
                    business_name=data["business_name"],
                    owner_name=data["owner_name"],
                    category=data["category"],
                    address=data.get("address", ""),
                    city=data.get("city", ""),
                    state=data.get("state", ""),
                    country=data.get("country", "India"),
                    pincode=data.get("pincode", ""),
                    landmark=data.get("landmark", ""),
                    gst_number=data.get("gst_number"),
                    cover_image=data.get("cover_image"),
                    owner_image=data.get("owner_image"),
                )
        except Exception as e:
            user.delete()
            return Response(
                {"error": f"Profile creation failed: {e!s}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"message": "Account created successfully"},
            status=status.HTTP_201_CREATED,
        )


# ============================
# ME (PROFILE)
# ============================
class MeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


# ============================
# UPDATE CONSUMER PROFILE
# ============================
class UpdateConsumerProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def patch(self, request):
        profile = request.user.consumer_profile
        serializer = ConsumerProfileSerializer(
            profile, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ============================
# UPDATE PROVIDER PROFILE
# ============================
class UpdateProviderProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def patch(self, request):
        if request.user.role != "provider":
            return Response({"error": "Not a provider"}, status=status.HTTP_403_FORBIDDEN)

        profile = request.user.provider_profile
        serializer = ProviderProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

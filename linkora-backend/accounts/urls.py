from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .serializers import CustomTokenObtainPairSerializer
from .views import RegisterAPIView, MeAPIView, UpdateConsumerProfileAPIView, UpdateProviderProfileAPIView

urlpatterns = [
    path("register/", RegisterAPIView.as_view()),
    path("me/", MeAPIView.as_view()),
    path("profile/consumer/", UpdateConsumerProfileAPIView.as_view()),
    path("profile/provider/", UpdateProviderProfileAPIView.as_view()),
    path("login/", TokenObtainPairView.as_view(serializer_class=CustomTokenObtainPairSerializer)),
    path("token/refresh/", TokenRefreshView.as_view()),
]

from django.urls import path

from .views import (
    ServiceListCreateView,
    ProviderServiceListView,
    ProviderServicesView,
    NearbyServiceListView,
    ServiceRetrieveUpdateDestroyView,
    ServiceImageUploadView,
    ServiceImageDeleteView,
)

urlpatterns = [
    path("nearby/", NearbyServiceListView.as_view()),
    path("provider/services/", ProviderServicesView.as_view(), name="provider-services"),
    path("<int:pk>/", ServiceRetrieveUpdateDestroyView.as_view()),
    path("<int:service_id>/images/", ServiceImageUploadView.as_view()),
    path("<int:service_id>/images/<int:image_id>/", ServiceImageDeleteView.as_view()),
    path("provider/<int:provider_id>/", ProviderServiceListView.as_view()),
    path("", ServiceListCreateView.as_view()),
]


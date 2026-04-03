from django.urls import path
from .views import ReviewCreateView, ServiceReviewListView, ServiceReviewCreateUpdateView, ServiceRatingView

urlpatterns = [
    path("", ReviewCreateView.as_view(), name="create-review"),
    path("service/<int:service_id>/reviews/", ServiceReviewListView.as_view(), name="service-reviews"),
    path("service/<int:service_id>/review/", ServiceReviewCreateUpdateView.as_view(), name="service-review-create-update"),
    path("service/<int:service_id>/rating/", ServiceRatingView.as_view(), name="service-rating"),
]
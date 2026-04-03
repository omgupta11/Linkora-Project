from django.urls import path

from .views import (
    BookingCreateView,
    MyBookingsView,
    ProviderBookingsView,
    BookingDetailView,
    BookingStatusUpdateView,
    ProviderDashboardStatsView,
)

urlpatterns = [
    # ✅ Create booking
    path("", BookingCreateView.as_view(), name="booking-create"),

    # ✅ Consumer bookings
    path("my/", MyBookingsView.as_view(), name="my-bookings"),

    # ✅ Provider bookings
    path("provider/", ProviderBookingsView.as_view(), name="provider-bookings"),

    # ✅ Provider dashboard stats
    path("provider/dashboard/", ProviderDashboardStatsView.as_view(), name="provider-dashboard-stats"),

    # ✅ Booking detail
    path("<int:booking_id>/", BookingDetailView.as_view(), name="booking-detail"),

    # ✅ Status update API
    path(
        "<int:booking_id>/status/",
        BookingStatusUpdateView.as_view(),
        name="booking-status-update",
    ),
]
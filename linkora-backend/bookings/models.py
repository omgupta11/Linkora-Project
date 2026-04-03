from django.db import models
from django.conf import settings
from services.models import Service


class Booking(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    consumer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="bookings_made"
    )
    provider = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="bookings_received"
    )
    service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE,
        related_name="bookings"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )
    scheduled_date = models.DateField()
    scheduled_time = models.TimeField()

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text="Service price at time of booking"
    )

    payment_status = models.CharField(
        max_length=20,
        choices=[
            ("pending", "Pending"),
            ("paid", "Paid"),
        ],
        default="pending"
    )

    payment_method = models.CharField(
        max_length=20,
        choices=[
            ("upi", "UPI"),
            ("card", "Card"),
            ("cod", "Cash on Service"),
        ],
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking #{self.id} - {self.service.title}"


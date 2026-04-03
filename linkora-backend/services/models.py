from django.db import models
from django.conf import settings
from django.core.validators import FileExtensionValidator

class Service(models.Model):
    provider = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="services"
    )

    title = models.CharField(max_length=200)
    description = models.TextField()

    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=100)

    duration_minutes = models.PositiveIntegerField()

    # location (provider based)
    lat = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    lng = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    is_active = models.BooleanField(default=True)

    payment_type = models.CharField(
        max_length=20,
        choices=[
            ("pay_later", "Pay Later"),
            ("pay_now", "Pay Now"),
            ("both", "Both"),
        ],
        default="pay_later"
    )

    price_type = models.CharField(
        max_length=20,
        choices=[
            ("fixed", "Fixed"),
            ("range", "Range"),
        ],
        default="fixed"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class ServiceImage(models.Model):
    service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE,
        related_name="images"
    )
    image = models.ImageField(
        upload_to="services/",
        validators=[
            FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'gif', 'webp'])
        ]
    )
    alt_text = models.CharField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.service.title}"

from django.db import migrations, models


def forwards(apps, schema_editor):
    Booking = apps.get_model("bookings", "Booking")
    Booking.objects.filter(status="completed").update(status="done")
    Booking.objects.filter(status="cancelled").update(status="rejected")


def backwards(apps, schema_editor):
    Booking = apps.get_model("bookings", "Booking")
    Booking.objects.filter(status="done").update(status="completed")
    Booking.objects.filter(status="rejected").update(status="cancelled")


class Migration(migrations.Migration):

    dependencies = [
        ("bookings", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(forwards, backwards),
        migrations.AlterField(
            model_name="booking",
            name="status",
            field=models.CharField(
                choices=[
                    ("pending", "Pending"),
                    ("accepted", "Accepted"),
                    ("rejected", "Rejected"),
                    ("done", "Done"),
                ],
                default="pending",
                max_length=20,
            ),
        ),
    ]

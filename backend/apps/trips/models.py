import uuid
import secrets
from django.db import models
from django.conf import settings

class TimeStampedUUIDModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Trip(TimeStampedUUIDModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='trips')
    title = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()
    cover_image = models.URLField(blank=True, null=True)
    budget_limit = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_public = models.BooleanField(default=False)
    share_token = models.CharField(max_length=64, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.share_token:
            self.share_token = secrets.token_urlsafe(32)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.user.username})"

    class Meta:
        ordering = ['-start_date']


from datetime import timedelta

class TripDestination(TimeStampedUUIDModel):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='destinations')
    city_name = models.CharField(max_length=255)
    arrival_date = models.DateField()
    departure_date = models.DateField()
    order_index = models.PositiveIntegerField(default=0)

    def save(self, *args, **kwargs):
        is_new = self._state.adding
        super().save(*args, **kwargs)
        
        if self.arrival_date and self.departure_date:
            current_date = self.arrival_date
            valid_dates = []
            while current_date <= self.departure_date:
                day, created = ItineraryDay.objects.get_or_create(
                    destination=self,
                    date=current_date
                )
                valid_dates.append(current_date)
                current_date += timedelta(days=1)
            
            if not is_new:
                ItineraryDay.objects.filter(destination=self).exclude(date__in=valid_dates).delete()

    def __str__(self):
        return f"{self.city_name} - {self.trip.title}"

    class Meta:
        ordering = ['order_index']
        indexes = [
            models.Index(fields=['trip', 'order_index']),
        ]



class ItineraryDay(TimeStampedUUIDModel):
    destination = models.ForeignKey(TripDestination, on_delete=models.CASCADE, related_name='days')
    date = models.DateField()

    def __str__(self):
        return f"Day {self.date} in {self.destination.city_name}"

    class Meta:
        ordering = ['date']
        indexes = [
            models.Index(fields=['destination', 'date']),
        ]


class Activity(TimeStampedUUIDModel):
    CATEGORY_CHOICES = [
        ('food', 'Food & Drink'),
        ('sightseeing', 'Sightseeing'),
        ('transport', 'Transport'),
        ('accommodation', 'Accommodation'),
        ('shopping', 'Shopping'),
        ('nightlife', 'Nightlife'),
        ('other', 'Other'),
    ]
    day = models.ForeignKey(ItineraryDay, on_delete=models.CASCADE, related_name='activities')
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default='other')
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    place_id = models.CharField(max_length=255, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.title} on {self.day.date}"

    class Meta:
        ordering = ['start_time']


class PackingItem(TimeStampedUUIDModel):
    CATEGORY_CHOICES = [
        ('clothing', 'Clothing'),
        ('documents', 'Documents'),
        ('toiletries', 'Toiletries'),
        ('electronics', 'Electronics'),
        ('medications', 'Medications'),
        ('other', 'Other'),
    ]
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='packing_items')
    label = models.CharField(max_length=200)
    is_checked = models.BooleanField(default=False)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default='other')

    def __str__(self):
        return f"{self.label} ({'✓' if self.is_checked else '○'})"

    class Meta:
        ordering = ['category', 'created_at']


class TripNote(TimeStampedUUIDModel):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='notes')
    content = models.TextField()

    def __str__(self):
        return f"Note for {self.trip.title} at {self.created_at}"

    class Meta:
        ordering = ['-created_at']


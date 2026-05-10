from rest_framework import viewsets, permissions
from .models import Trip, TripDestination, ItineraryDay, Activity
from .serializers import (
    TripSerializer, TripDestinationSerializer,
    ItineraryDaySerializer, ActivitySerializer
)

class IsOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to access it.
    """
    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'user'):
            return obj.user == request.user
        elif hasattr(obj, 'trip'):
            return obj.trip.user == request.user
        elif hasattr(obj, 'destination'):
            return obj.destination.trip.user == request.user
        elif hasattr(obj, 'day'):
            return obj.day.destination.trip.user == request.user
        return False


class TripViewSet(viewsets.ModelViewSet):
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Trip.objects.filter(user=self.request.user).prefetch_related(
            'destinations__days__activities'
        )


class TripDestinationViewSet(viewsets.ModelViewSet):
    serializer_class = TripDestinationSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return TripDestination.objects.filter(trip__user=self.request.user)


class ItineraryDayViewSet(viewsets.ModelViewSet):
    serializer_class = ItineraryDaySerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return ItineraryDay.objects.filter(destination__trip__user=self.request.user)


class ActivityViewSet(viewsets.ModelViewSet):
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Activity.objects.filter(day__destination__trip__user=self.request.user)

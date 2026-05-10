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


from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction

class TripDestinationViewSet(viewsets.ModelViewSet):
    serializer_class = TripDestinationSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return TripDestination.objects.filter(trip__user=self.request.user)

    @action(detail=False, methods=['post'])
    def reorder(self, request):
        trip_id = request.data.get('trip')
        destination_ids = request.data.get('destination_ids', [])

        if not trip_id or not destination_ids:
            return Response({"error": "trip and destination_ids are required."}, status=status.HTTP_400_BAD_REQUEST)

        destinations = TripDestination.objects.filter(trip_id=trip_id, trip__user=request.user)
        valid_ids = set(str(d.id) for d in destinations)

        if not all(str(dest_id) in valid_ids for dest_id in destination_ids):
            return Response({"error": "Invalid destination IDs provided."}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            for index, dest_id in enumerate(destination_ids):
                TripDestination.objects.filter(id=dest_id).update(order_index=index)

        return Response({"status": "reordered"})


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

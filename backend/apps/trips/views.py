from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import transaction
from django.shortcuts import get_object_or_404

from .models import Trip, TripDestination, ItineraryDay, Activity, PackingItem, TripNote
from .serializers import (
    TripSerializer, TripDestinationSerializer,
    ItineraryDaySerializer, ActivitySerializer,
    PackingItemSerializer, TripNoteSerializer,
    PublicTripSerializer,
)


class IsOwner(permissions.BasePermission):
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
        ).select_related('user')

    @action(detail=True, methods=['post'], url_path='toggle-public')
    def toggle_public(self, request, pk=None):
        trip = self.get_object()
        trip.is_public = not trip.is_public
        trip.save(update_fields=['is_public'])
        return Response({
            'is_public': trip.is_public,
            'share_token': trip.share_token,
            'share_url': f"/share/{trip.share_token}",
        })


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


class PackingItemViewSet(viewsets.ModelViewSet):
    serializer_class = PackingItemSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        trip_id = self.request.query_params.get('trip')
        qs = PackingItem.objects.filter(trip__user=self.request.user)
        if trip_id:
            qs = qs.filter(trip_id=trip_id)
        return qs


class TripNoteViewSet(viewsets.ModelViewSet):
    serializer_class = TripNoteSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        trip_id = self.request.query_params.get('trip')
        qs = TripNote.objects.filter(trip__user=self.request.user)
        if trip_id:
            qs = qs.filter(trip_id=trip_id)
        return qs


class PublicTripView(APIView):
    """No auth required — returns public trip by share_token."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, token):
        trip = get_object_or_404(
            Trip.objects.prefetch_related('destinations__days__activities'),
            share_token=token,
            is_public=True,
        )
        serializer = PublicTripSerializer(trip)
        return Response(serializer.data)

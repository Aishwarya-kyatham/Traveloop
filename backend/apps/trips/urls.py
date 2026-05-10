from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TripViewSet, TripDestinationViewSet,
    ItineraryDayViewSet, ActivityViewSet,
    PackingItemViewSet, TripNoteViewSet,
    PublicTripView,
)

router = DefaultRouter()
router.register(r'trips', TripViewSet, basename='trip')
router.register(r'destinations', TripDestinationViewSet, basename='destination')
router.register(r'days', ItineraryDayViewSet, basename='day')
router.register(r'activities', ActivityViewSet, basename='activity')
router.register(r'checklist', PackingItemViewSet, basename='checklist')
router.register(r'notes', TripNoteViewSet, basename='note')

urlpatterns = [
    path('', include(router.urls)),
    # Public share endpoint — no auth needed
    path('share/<str:token>/', PublicTripView.as_view(), name='public-trip'),
]

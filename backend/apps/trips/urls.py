from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TripViewSet, TripDestinationViewSet,
    ItineraryDayViewSet, ActivityViewSet
)

router = DefaultRouter()
router.register(r'trips', TripViewSet, basename='trip')
router.register(r'destinations', TripDestinationViewSet, basename='destination')
router.register(r'days', ItineraryDayViewSet, basename='day')
router.register(r'activities', ActivityViewSet, basename='activity')

urlpatterns = [
    path('', include(router.urls)),
]

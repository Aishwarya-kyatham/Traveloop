from rest_framework import serializers
from .models import Trip, TripDestination, ItineraryDay, Activity

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')


class ItineraryDaySerializer(serializers.ModelSerializer):
    activities = ActivitySerializer(many=True, read_only=True)

    class Meta:
        model = ItineraryDay
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')


class TripDestinationSerializer(serializers.ModelSerializer):
    days = ItineraryDaySerializer(many=True, read_only=True)

    class Meta:
        model = TripDestination
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')


class TripSerializer(serializers.ModelSerializer):
    destinations = TripDestinationSerializer(many=True, read_only=True)

    class Meta:
        model = Trip
        fields = '__all__'
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')
        
    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)

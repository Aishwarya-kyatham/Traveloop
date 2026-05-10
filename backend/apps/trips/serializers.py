from rest_framework import serializers
from .models import Trip, TripDestination, ItineraryDay, Activity
from rest_framework.exceptions import ValidationError

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')
        
    def validate(self, data):
        if data.get('start_time') and data.get('end_time'):
            if data['start_time'] >= data['end_time']:
                raise ValidationError({"end_time": "End time must be after start time."})
        return data


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

    def validate(self, data):
        if data.get('arrival_date') and data.get('departure_date'):
            if data['arrival_date'] > data['departure_date']:
                raise ValidationError({"departure_date": "Departure date cannot be before arrival date."})
        return data


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

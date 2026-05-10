from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
import random

User = get_user_model()


def generate_otp():
    return str(random.randint(100000, 999999))


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name',
                  'phone', 'city', 'country', 'additional_info', 'is_verified')
        read_only_fields = ('id', 'is_verified')


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        if not self.user.is_verified:
            raise AuthenticationFailed(
                "Email not verified. Please check your inbox for the verification code."
            )
        return data


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name',
                  'phone', 'city', 'country', 'additional_info')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', ''),
            city=validated_data.get('city', ''),
            country=validated_data.get('country', ''),
            additional_info=validated_data.get('additional_info', ''),
        )

        # Generate a 6-digit OTP, valid for 10 minutes
        otp = generate_otp()
        user.verification_otp = otp
        user.otp_expiry = timezone.now() + timedelta(minutes=10)
        user.save()

        send_mail(
            subject='Your Traveloop verification code',
            message=(
                f"Hi {user.first_name or user.username},\n\n"
                f"Your verification code is: {otp}\n\n"
                f"This code expires in 10 minutes.\n\n"
                f"— The Traveloop team"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )

        return user


class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6, min_length=6)

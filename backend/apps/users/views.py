from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.utils import timezone
from .serializers import (
    UserSerializer, RegisterSerializer,
    CustomTokenObtainPairSerializer, VerifyOTPSerializer
)

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer


class VerifyOTPView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        otp = serializer.validated_data['otp']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        if user.is_verified:
            return Response({'message': 'Account already verified.'}, status=status.HTTP_200_OK)

        if not user.verification_otp or user.verification_otp != otp:
            return Response({'error': 'Invalid verification code.'}, status=status.HTTP_400_BAD_REQUEST)

        if user.otp_expiry and timezone.now() > user.otp_expiry:
            return Response({'error': 'Verification code has expired. Please register again.'}, status=status.HTTP_400_BAD_REQUEST)

        user.is_verified = True
        user.verification_otp = None
        user.otp_expiry = None
        user.save()

        return Response({'message': 'Email verified successfully. You can now log in.'}, status=status.HTTP_200_OK)


class ResendOTPView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        if user.is_verified:
            return Response({'message': 'Account already verified.'})

        from django.core.mail import send_mail
        from django.conf import settings
        from datetime import timedelta
        from .serializers import generate_otp

        otp = generate_otp()
        user.verification_otp = otp
        user.otp_expiry = timezone.now() + timedelta(minutes=10)
        user.save()

        send_mail(
            subject='Your new Traveloop verification code',
            message=(
                f"Hi {user.first_name or user.username},\n\n"
                f"Your new verification code is: {otp}\n\n"
                f"This code expires in 10 minutes.\n\n"
                f"— The Traveloop team"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )

        return Response({'message': 'A new code has been sent to your email.'})


class UserDetailView(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

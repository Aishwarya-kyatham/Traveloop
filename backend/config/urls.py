from django.contrib import admin
from django.urls import path, include
from apps.health_views import health_check

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='health_check'),
]

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('', include('frontend.urls')),
    path('', include('schedules.urls')),
    path('', include('accounts.urls'))
]

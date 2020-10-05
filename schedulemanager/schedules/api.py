from schedules.models import Schedule
from rest_framework import viewsets, permissions
from .serializers import ScheduleSerializer

# Schedule Viewset
class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = ScheduleSerializer
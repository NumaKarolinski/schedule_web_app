from schedules.models import Schedule
from rest_framework import viewsets, permissions
from .serializers import ScheduleSerializer

# Schedule Viewset


class ScheduleViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = ScheduleSerializer

    def get_queryset(self):
        return self.request.user.schedules.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

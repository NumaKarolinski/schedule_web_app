from schedules.models import Schedule
from rest_framework import viewsets, permissions
from .serializers import ScheduleSerializer, viewsSerializer, EventDefinitionSerializer, TimeDeltaSerializer, occurs_on_1Serializer, occurs_on_2Serializer


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


# views Viewset


class viewsViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = viewsSerializer

    def get_queryset(self):
        return self.request.user.views.all()

    def perform_create(self, serializer):
        serializer.save(viewer=self.request.user,
                        schedule=self.request.schedule)


# EventDefinition Viewset


class EventDefinitionViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = EventDefinitionSerializer

    def get_queryset(self):
        return self.request.user.eventdefinitions.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


# TimeDelta Viewset


class TimeDeltaViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = TimeDeltaSerializer

    def get_queryset(self):
        return self.request.user.timedeltas.all()

    def perform_create(self, serializer):
        serializer.save(schedule=self.request.schedule,
                        event=self.request.eventdefinition)


# occurs_on_1 Viewset


class occurs_on_1ViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = occurs_on_1Serializer

    def get_queryset(self):
        return self.request.user.occurs_on_1s.all()

    def perform_create(self, serializer):
        serializer.save(event=self.request.strictevent,
                        day=self.request.day, time=self.request.time)


# occurs_on_2 Viewset


class occurs_on_2ViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = occurs_on_2Serializer

    def get_queryset(self):
        return self.request.user.occurs_on_2s.all()

    def perform_create(self, serializer):
        serializer.save(event=self.request.looseevent,
                        day=self.request.day)

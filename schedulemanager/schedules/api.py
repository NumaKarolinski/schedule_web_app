from .models import Schedule, views, EventDefinition, TimeDelta, StrictEvent, LooseEvent, Day, Time, occurs_on_1, occurs_on_2
from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from .serializers import ScheduleSerializer, viewsSerializer, EventDefinitionSerializer, TimeDeltaSerializer, StrictEventSerializer, LooseEventSerializer, DaySerializer, TimeSerializer, occurs_on_1Serializer, occurs_on_2Serializer

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

    def perform_update(self, serializer):
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

# StrictEvent Viewset


class StrictEventViewSet(viewsets.ModelViewSet):

    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = StrictEventSerializer

    def get_queryset(self):

        event_filter = self.request.GET.get("event_filter", None)

        if event_filter == 'last':
            all_queryset = StrictEvent.objects.all()
            ordered_all_queryset = all_queryset.order_by("-event_id")
            if ordered_all_queryset.count() == 0:
                return []
            else:
                return [ordered_all_queryset.first()]

        if event_filter == 'first':
            all_queryset = StrictEvent.objects.all()
            ordered_all_queryset = all_queryset.order_by("event_id")
            if ordered_all_queryset.count() == 0:
                return []
            else:
                return [ordered_all_queryset.first()]

        eventdefinitions = self.request.user.eventdefinitions.all()
        queryset = StrictEvent.objects.filter(event_id__in=eventdefinitions)

        if (event_filter == 'all') or (event_filter is None):
            return queryset
        else:
            return queryset.filter(event_id=int(event_filter))

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        serializer.save(owner=self.request.user)

# LooseEvent Viewset


class LooseEventViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = LooseEventSerializer

    def get_queryset(self):

        all_queryset = LooseEvent.objects.all()

        event_filter = self.request.GET.get("event_filter", None)

        if event_filter == 'last':
            ordered_all_queryset = all_queryset.order_by("-event_id")
            if ordered_all_queryset.count() == 0:
                return []
            else:
                return [ordered_all_queryset.first()]

        if event_filter == 'first':
            ordered_all_queryset = all_queryset.order_by("event_id")
            if ordered_all_queryset.count() == 0:
                return []
            else:
                return [ordered_all_queryset.first()]

        eventdefinitions = self.request.user.eventdefinitions.all()
        queryset = LooseEvent.objects.filter(event_id__in=eventdefinitions)

        if (event_filter == 'all') or (event_filter is None):
            return queryset
        else:
            return queryset.filter(event_id=int(event_filter))

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        serializer.save(owner=self.request.user)

# Day Viewset


class DayViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = DaySerializer

    def get_queryset(self):

        day_filter = self.request.GET.get("day_filter", None)

        if day_filter == 'last':
            all_queryset = Day.objects.all()
            ordered_all_queryset = all_queryset.order_by("-day_id")
            if ordered_all_queryset.count() == 0:
                return []
            else:
                return [ordered_all_queryset.first()]

        if day_filter == 'first':
            all_queryset = Day.objects.all()
            ordered_all_queryset = all_queryset.order_by("day_id")
            if ordered_all_queryset.count() == 0:
                return []
            else:
                return [ordered_all_queryset.first()]

        eventdefinitions = self.request.user.eventdefinitions.all()
        strictevents = StrictEvent.objects.filter(
            event_id__in=eventdefinitions)
        looseevents = LooseEvent.objects.filter(event_id__in=eventdefinitions)
        occurs_on_1s = occurs_on_1.objects.filter(event_id__in=strictevents)
        occurs_on_2s = occurs_on_2.objects.filter(event_id__in=looseevents)
        queryset_1 = Day.objects.filter(
            day_id__in=occurs_on_1s.values("day_id"))
        queryset_2 = Day.objects.filter(day_id__in=occurs_on_2s)
        queryset = queryset_1 | queryset_2

        if day_filter is None:
            return queryset
        elif day_filter[0] == "[":
            day_filter_list = day_filter[1:-1].split(",")
            return queryset.filter(day_id__in=day_filter_list)
        else:
            print("Error in DayViewSet Return")

    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        serializer.save()


# Time Viewset


class TimeViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = TimeSerializer

    def get_queryset(self):

        time_filter = self.request.GET.get("time_filter", None)

        if time_filter == 'last':
            all_queryset = Time.objects.all()
            ordered_all_queryset = all_queryset.order_by("-time_id")
            if ordered_all_queryset.count() == 0:
                return []
            else:
                return [ordered_all_queryset.first()]

        if time_filter == 'first':
            all_queryset = Time.objects.all()
            ordered_all_queryset = all_queryset.order_by("time_id")
            if ordered_all_queryset.count() == 0:
                return []
            else:
                return [ordered_all_queryset.first()]

        eventdefinitions = self.request.user.eventdefinitions.all()
        strictevents = StrictEvent.objects.filter(
            event_id__in=eventdefinitions)
        occurs_on_1s = occurs_on_1.objects.filter(event_id__in=strictevents)
        queryset = Time.objects.filter(
            time_id__in=occurs_on_1s.values("time_id"))

        if time_filter is None:
            return queryset
        elif time_filter[0] == "[":
            time_filter_list = time_filter[1:-1].split(",")
            return queryset.filter(time_id__in=time_filter_list)
        else:
            print("Error in TimeViewSet Return")

    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        serializer.save()

# occurs_on_1 Viewset


class occurs_on_1ViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = occurs_on_1Serializer

    def get_queryset(self):

        o_o_1_filter = self.request.GET.get("o_o_1_filter", None)

        if o_o_1_filter == 'last':
            all_queryset = occurs_on_1.objects.all()
            ordered_all_queryset = all_queryset.order_by("-id")
            if ordered_all_queryset.count() == 0:
                return []
            else:
                return [ordered_all_queryset.first()]

        if o_o_1_filter == 'first':
            all_queryset = occurs_on_1.objects.all()
            ordered_all_queryset = all_queryset.order_by("id")
            if ordered_all_queryset.count() == 0:
                return []
            else:
                return [ordered_all_queryset.first()]

        eventdefinitions = self.request.user.eventdefinitions.all()
        strictevents = StrictEvent.objects.filter(
            event_id__in=eventdefinitions)
        queryset = occurs_on_1.objects.filter(event_id__in=strictevents)

        if o_o_1_filter is None:
            return queryset
        elif o_o_1_filter[0] == "[":
            o_o_1_filter_list = o_o_1_filter[1:-1].split(",")
            return queryset.filter(id__in=o_o_1_filter_list)
        else:
            print("Error in occurs_on_1ViewSet Return")

    # there is a lock in this perform_create function
    # by the time this function is called, the perform_create function of a
    # strict_event, day, and time have already been called, but it's possible
    # that they have not yet been fully created when this is called, so I have it
    # wait for the other three objects to be created properly first.
    # you can tell when it is done because the object will not be None
    def perform_create(self, serializer):

        strict_event = None
        day = None
        time = None

        while strict_event is None:
            strict_event = StrictEvent.objects.filter(
                event_id=self.request.data['event_id']).first()

        while day is None:
            day = Day.objects.filter(
                day_id=self.request.data['day_id']).first()

        while time is None:
            time = Time.objects.filter(
                time_id=self.request.data['time_id']).first()

        serializer.save(event=strict_event, day=day, time=time)

    # there is a lock in this destroy function
    # by the time this function is called, the destroy function of a
    # day, and time have already been called, but it's possible
    # that they have not yet been fully destroyed when this is called, so I have it
    # wait for the other two objects to be destroyed properly first.
    # you can tell when it is done because the two other objects will be None
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        while (instance.day is not None) or (instance.time is not None):
            instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


# occurs_on_2 Viewset


class occurs_on_2ViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = occurs_on_2Serializer

    def get_queryset(self):

        o_o_2_filter = self.request.GET.get("o_o_2_filter", None)

        if o_o_2_filter == 'last':
            all_queryset = occurs_on_2.objects.all()
            ordered_all_queryset = all_queryset.order_by("-id")
            if ordered_all_queryset.count() == 0:
                return []
            else:
                return [ordered_all_queryset.first()]

        if o_o_2_filter == 'first':
            all_queryset = occurs_on_2.objects.all()
            ordered_all_queryset = all_queryset.order_by("id")
            if ordered_all_queryset.count() == 0:
                return []
            else:
                return [ordered_all_queryset.first()]

        eventdefinitions = self.request.user.eventdefinitions.all()
        looseevents = LooseEvent.objects.filter(event_id__in=eventdefinitions)
        queryset = occurs_on_2.objects.filter(event_id__in=looseevents)

        if o_o_2_filter is None:
            return queryset
        elif o_o_2_filter[0] == "[":
            o_o_2_filter_list = o_o_2_filter[1:-1].split(",")
            return queryset.filter(id__in=o_o_2_filter_list)
        else:
            print("Error in occurs_on_2ViewSet Return")

    # there is a lock in this perform_create function
    # by the time this function is called, the perform_create function of a
    # loose_event, and day have already been called, but it's possible
    # that they have not yet been fully created when this is called, so I have it
    # wait for the other two objects to be created properly first.
    # you can tell when it is done because the object will not be None
    def perform_create(self, serializer):

        loose_event = None
        day = None

        while loose_event is None:
            loose_event = LooseEvent.objects.filter(
                event_id=self.request.data['event_id']).first()

        while day is None:
            day = Day.objects.filter(
                day_id=self.request.data['day_id']).first()

        serializer.save(event=loose_event, day=day)

    # there is a lock in this destroy function
    # by the time this function is called, the destroy function of a
    # day has already been called, but it's possible
    # that it has not yet been fully destroyed when this is called, so I have it
    # wait for the other object to be destroyed properly first.
    # you can tell when it is done because the other object will be None
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        while instance.day is not None:
            instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

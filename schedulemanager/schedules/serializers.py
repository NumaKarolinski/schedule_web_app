from rest_framework import serializers
from .models import Schedule, views, EventDefinition, TimeDelta, StrictEvent, LooseEvent, Day, Time, occurs_on_1, occurs_on_2

# Schedule Serializer


class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = '__all__'

# views Serializer


class viewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = views
        fields = '__all__'

# EventDefinition Serializer


class EventDefinitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventDefinition
        fields = '__all__'

# TimeDelta Serializer


class TimeDeltaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeDelta
        fields = '__all__'

# StrictEvent Serializer


class StrictEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = StrictEvent
        fields = '__all__'

# LooseEvent Serializer


class LooseEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = LooseEvent
        fields = '__all__'

# Day Serializer


class DaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Day
        fields = '__all__'

# Time Serializer


class TimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Time
        fields = '__all__'

# occurs_on_1 Serializer


class occurs_on_1Serializer(serializers.ModelSerializer):
    class Meta:
        model = occurs_on_1
        fields = '__all__'

# occurs_on_2 Serializer


class occurs_on_2Serializer(serializers.ModelSerializer):
    class Meta:
        model = occurs_on_2
        fields = '__all__'

from rest_framework import serializers
from schedules.models import Schedule, views, EventDefinition, TimeDelta, occurs_on_1, occurs_on_2

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

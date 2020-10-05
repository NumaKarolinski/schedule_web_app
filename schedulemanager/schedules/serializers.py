from rest_framework import serializers
from schedules.models import Schedule

#Schedule Serializer
class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = '__all__'
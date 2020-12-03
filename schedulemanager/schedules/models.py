from django.db import models
from django.contrib.auth.models import User


class Schedule(models.Model):
    schedule_id = models.AutoField(primary_key=True)
    schedule_name = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(
        User, related_name="schedules", on_delete=models.CASCADE, null=True)

    class Meta:
        ordering = ['schedule_id']


class views(models.Model):
    viewer = models.ForeignKey(
        User, related_name="views", on_delete=models.CASCADE, null=True)
    schedule = models.ForeignKey(
        Schedule, related_name="views", on_delete=models.CASCADE, null=True)

    class Meta:
        ordering = ['id']


class EventDefinition(models.Model):
    event_id = models.SmallIntegerField(primary_key=True)
    event_name = models.CharField(max_length=50)
    priority = models.SmallIntegerField()
    recurring = models.BooleanField()
    active_for_generation = models.BooleanField()
    owner = models.ForeignKey(
        User, related_name="eventdefinitions", on_delete=models.CASCADE, null=True)

    class Meta:
        ordering = ['event_id']


class TimeDelta(models.Model):
    td_id = models.AutoField(primary_key=True)
    date_time = models.DateTimeField()
    start_end = models.BooleanField()
    rating = models.SmallIntegerField(blank=True, null=True)
    schedule = models.ForeignKey(
        Schedule, related_name="timedeltas", on_delete=models.CASCADE, null=True)
    event = models.ForeignKey(
        EventDefinition, related_name="timedeltas", on_delete=models.CASCADE, null=True)

    class Meta:
        db_constraints = {
            'CHK_Rating': 'CHECK (rating <= 10 AND rating >= 1)'
        }
        ordering = ['td_id']


class StrictEvent(EventDefinition):
    pass


class LooseEvent(EventDefinition):
    e_oa_1 = models.BooleanField()
    e_oa_2 = models.BooleanField()
    nn_n_1 = models.BooleanField()
    nn_n_2 = models.BooleanField()
    nn_n_3 = models.BooleanField()
    nn_n_4 = models.BooleanField()
    n_occ = models.SmallIntegerField()
    n_occ_more = models.SmallIntegerField()
    n_occ_less = models.SmallIntegerField()
    occ_same_day = models.BooleanField()
    n_time = models.TimeField()
    n_time_more = models.TimeField()
    n_time_less = models.TimeField()


class Day(models.Model):
    day_id = models.SmallIntegerField(primary_key=True)
    day_date = models.DateField(blank=True, null=True)
    day_str = models.CharField(max_length=2, blank=True)

    class Meta:
        db_constraints = {
            'CHK_DayNotNull': 'CHECK (day_date IS NOT NULL OR day_str <> "")'
        }
        ordering = ['day_id']


class Time(models.Model):
    time_id = models.SmallIntegerField(primary_key=True)
    start = models.TimeField(blank=False, null=False)
    end = models.TimeField(blank=False, null=False)

    class Meta:
        ordering = ['time_id']


class occurs_on_1(models.Model):
    event = models.ForeignKey(
        StrictEvent, related_name="occurs_on_1s", on_delete=models.CASCADE, null=True)
    day = models.ForeignKey(
        Day, related_name="occurs_on_1s", on_delete=models.SET_NULL, null=True)
    time = models.ForeignKey(
        Time, related_name="occurs_on_1s", on_delete=models.SET_NULL, null=True)

    class Meta:
        ordering = ['id']


class occurs_on_2(models.Model):
    event = models.ForeignKey(
        LooseEvent, related_name="occurs_on_2s", on_delete=models.CASCADE, null=True)
    day = models.ForeignKey(
        Day, related_name="occurs_on_2s", on_delete=models.SET_NULL, null=True)

    class Meta:
        ordering = ['id']

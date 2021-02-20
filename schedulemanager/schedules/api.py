from django.http import HttpRequest
from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.settings import api_settings


from .models import Schedule, views, EventDefinition, TimeDelta, StrictEvent, LooseEvent, Day, Time, occurs_on_1, occurs_on_2
from .serializers import ScheduleSerializer, TimeDeltaSerializer, viewsSerializer, EventDefinitionSerializer, StrictEventSerializer, LooseEventSerializer, DaySerializer, TimeSerializer, occurs_on_1Serializer, occurs_on_2Serializer

import random as r
import math as m
import moment
import datetime

from .customFunctions import cpdf, generate_gaussian
# Schedule Viewset


class ScheduleViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = ScheduleSerializer

    def get_queryset(self):

        schedule_filter = self.request.GET.get("schedule_filter", None)

        schedules = self.request.user.schedules.all()

        # This might not work, but if the user has no schedule, then make one
        if schedules.first() == None:
            request = HttpRequest()
            request.method = "POST"
            request.data = {"schedule_name": self.request.user.username}
            self.create(request)
            schedules = self.request.user.schedules.all()

        if (schedule_filter == 'all') or (schedule_filter is None):
            return schedules
        else:
            return schedules.filter(event_id=int(schedule_filter))

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


# TimeDelta Viewset


class TimeDeltaViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = TimeDeltaSerializer

    def get_queryset(self):

        # Whenever we get the time deltas we get all of the time deltas for some schedule(s)
        # That means the timedelta_filter will normally be "all", None, or an integer
        # representing a schedule_id that we want the timedeltas of
        timedelta_filter = self.request.GET.get("timedelta_filter", None)
        day_date_filter = self.request.GET.get("day_date_filter", None)

        schedules = self.request.user.schedules.all()

        if (timedelta_filter == 'all') or (timedelta_filter is None):
            return TimeDelta.objects.filter(schedule_id__in=schedules)

        else:
            day_year = day_date_filter[0:4]
            day_month = day_date_filter[5:7]
            day_day = day_date_filter[8:10]

            return TimeDelta.objects.filter(schedule_id=int(timedelta_filter),
                                            date_time__year=day_year,
                                            date_time__month=day_month,
                                            date_time__day=day_day)

    # This needs to be tested since there are currently no timedeltas in the database,
    # and thus it will need to be tested after the
    def destroy(self, request, *args, **kwargs):

        schedules = request.user.schedules.all()
        timedeltas = TimeDelta.objects.filter(schedule_id__in=schedules)

        day_date = kwargs['pk']
        day_year = day_date[0:4]
        day_month = day_date[5:7]
        day_day = day_date[8:10]

        deleted_timedeltas = timedeltas.filter(date_time__year=day_year,
                                               date_time__month=day_month,
                                               date_time__day=day_day)

        for deleted_timedelta in deleted_timedeltas:
            self.perform_destroy(deleted_timedelta)

        return Response(status=status.HTTP_204_NO_CONTENT)

        # for deleted_timedelta in deleted_timedeltas:
        # self.perform_destroy(deleted_timedelta)
        # return Response(status=status.HTTP_204_NO_CONTENT)

    def create(self, request, *args, **kwargs):

        schedule_filter = self.request.GET.get("schedule_filter", None)

        schedules = self.request.user.schedules.all()
        schedules_filtered = schedules.filter(schedule_id=int(schedule_filter))
        timedeltas = TimeDelta.objects.filter(
            schedule_id__in=schedules_filtered)

        day_str_filter = self.request.GET.get("day_str_filter", None)
        day_date_filter = self.request.GET.get("day_date_filter", None)

        day_str_list = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
        for j in range(len(day_str_list)):
            if day_str_list[j] == day_str_filter:
                todayVal = j

        todaysDate = moment.date(day_date_filter, "YYYY-MM-DD")
        thisWeeksDates = []

        for i in range(-1, 8):
            tempDate = todaysDate.clone()
            if (i - todayVal) < 0:
                thisWeeksDates.append(tempDate.subtract(
                    days=(todayVal-i)).format("YYYY-MM-DD"))
            else:
                thisWeeksDates.append(tempDate.add(
                    days=(i-todayVal)).format("YYYY-MM-DD"))

        prev_generated_day_timedeltas = timedeltas.filter(
            date_time__year=thisWeeksDates[j+1][0:4], date_time__month=thisWeeksDates[j+1][5:7], date_time__day=thisWeeksDates[j+1][8:10])

        # If today's schedule hasn't yet deleted, keep checking until it is deleted.
        while(prev_generated_day_timedeltas.exists()):
            prev_generated_day_timedeltas = timedeltas.filter(
                date_time__year=thisWeeksDates[j+1][0:4], date_time__month=thisWeeksDates[j+1][5:7], date_time__day=thisWeeksDates[j+1][8:10])

        this_week_timedeltas = [timedeltas.filter(date_time__year=thisWeeksDates[i][0:4],
                                                  date_time__month=thisWeeksDates[i][5:7],
                                                  date_time__day=thisWeeksDates[i][8:10]) for i in range(9)]

        print("============================================================")
        for i in range(9):
            if i == 0:
                print("The timedeltas for ", day_str_list[6],
                      ": ", this_week_timedeltas[i])
            elif i == 8:
                print("The timedeltas for ", day_str_list[0],
                      ": ", this_week_timedeltas[i])
            else:
                print("The timedeltas for ", day_str_list[i - 1],
                      ": ", this_week_timedeltas[i])
        print("============================================================")

       # print()

        eventdefinitions = self.request.user.eventdefinitions.all()
        strictevents = StrictEvent.objects.filter(
            event_id__in=eventdefinitions)
        looseevents = LooseEvent.objects.filter(event_id__in=eventdefinitions)

        occurs_on_1s = occurs_on_1.objects.filter(event_id__in=strictevents)
        occurs_on_2s = occurs_on_2.objects.filter(event_id__in=looseevents)

        days_1 = Day.objects.filter(
            day_id__in=occurs_on_1s.values("day_id"))
        days_2 = Day.objects.filter(
            day_id__in=occurs_on_2s.values("day_id"))

        days_str_1 = days_1.filter(day_str=day_str_filter)
        days_date_1 = days_1.filter(day_date=day_date_filter)
        days_str_2 = days_2.filter(day_str=day_str_filter)
        days_date_2 = days_2.filter(day_date=day_date_filter)

        days_str = days_str_1 | days_str_2
        days_date = days_date_1 | days_date_2

        days = days_str | days_date

        valid_occurs_on_1s = occurs_on_1.objects.filter(
            day_id__in=days.values("day_id"))
        valid_occurs_on_2s = occurs_on_2.objects.filter(
            day_id__in=days.values("day_id"))

        valid_strictevents = StrictEvent.objects.filter(
            event_id__in=valid_occurs_on_1s.values("event_id"))
        valid_looseevents = LooseEvent.objects.filter(
            event_id__in=valid_occurs_on_2s.values("event_id"))

        valid_active_strictevents = valid_strictevents.filter(
            active_for_generation=True)
        valid_active_looseevents = valid_looseevents.filter(
            active_for_generation=True)

        all_valid_active_o_o_1s = occurs_on_1.objects.filter(
            event_id__in=valid_active_strictevents, id__in=valid_occurs_on_1s)

        all_valid_active_times = Time.objects.filter(
            time_id__in=all_valid_active_o_o_1s.values("time"))

        all_valid_active_o_o_2s = occurs_on_2.objects.filter(
            event_id__in=valid_active_looseevents, id__in=valid_occurs_on_2s)

        all_valid_active_days_2 = Day.objects.filter(
            day_id__in=all_valid_active_o_o_2s.values("day"))

        need_full_week_of_strictevent_timedeltas = False

        if valid_active_looseevents.count() > 0:
            for valid_active_looseevent in valid_active_looseevents:
                event_id = valid_active_looseevent.event_id

                valid_active_o_o_2s = all_valid_active_o_o_2s.filter(
                    event_id=int(event_id))

                valid_active_days = all_valid_active_days_2.filter(
                    day_id__in=valid_active_o_o_2s.values("day_id"))

                first_valid_active_day = valid_active_days.first()

                if first_valid_active_day.day_date.isoformat() == "9999-01-01":
                    need_full_week_of_strictevent_timedeltas = True
                    break

        all_serializer_data = []
        today_and_ungenerated_day_data = {}

        if valid_active_looseevents.count() > 0:
            for i in range(9):
                if this_week_timedeltas[i].count() == 0:
                    if need_full_week_of_strictevent_timedeltas or ((i - 1) <= (todayVal + 1) and (i - 1) >= (todayVal - 1)):
                        today_and_ungenerated_day_data[i - 1] = []

                        if i == 0:
                            days_str_1 = days_1.filter(day_str=day_str_list[6])
                        elif i == 8:
                            days_str_1 = days_1.filter(day_str=day_str_list[0])
                        else:
                            days_str_1 = days_1.filter(
                                day_str=day_str_list[i - 1])

                        days_date_1 = days_1.filter(day_date=thisWeeksDates[i])

                        days = days_str_1 | days_date_1

                        valid_occurs_on_1s = occurs_on_1.objects.filter(
                            day_id__in=days.values("day_id"))

                        valid_strictevents = StrictEvent.objects.filter(
                            event_id__in=valid_occurs_on_1s.values("event_id"))

                        valid_active_strictevents = valid_strictevents.filter(
                            active_for_generation=True)

                        all_valid_active_o_o_1s = occurs_on_1.objects.filter(
                            event_id__in=valid_active_strictevents, id__in=valid_occurs_on_1s)

                        all_valid_active_times = Time.objects.filter(
                            time_id__in=all_valid_active_o_o_1s.values("time"))

                        for valid_active_strictevent in valid_active_strictevents:

                            event_id = valid_active_strictevent.event_id
                            event_name = valid_active_strictevent.event_name
                            priority = valid_active_strictevent.priority

                            valid_active_o_o_1s = all_valid_active_o_o_1s.filter(
                                event_id=int(event_id))

                            valid_active_times = all_valid_active_times.filter(
                                time_id__in=valid_active_o_o_1s.values("time_id"))

                            for valid_active_time in valid_active_times:

                                start = valid_active_time.start
                                end = valid_active_time.end

                                date_time = datetime.datetime(
                                    int(thisWeeksDates[i][0:4]),
                                    int(thisWeeksDates[i][5:7]),
                                    int(thisWeeksDates[i][8:10]),
                                    start.hour,
                                    start.minute,
                                    start.second)
                                end_time = datetime.datetime(
                                    int(thisWeeksDates[i][0:4]),
                                    int(thisWeeksDates[i][5:7]),
                                    int(thisWeeksDates[i][8:10]),
                                    end.hour,
                                    end.minute,
                                    end.second)

                                if end <= start:
                                    end_time = end_time + \
                                        datetime.timedelta(days=1)

                                data = {
                                    "date_time": date_time,
                                    "end_time": end_time,
                                    "schedule": int(schedule_filter),
                                    "event": event_id
                                }

                                serializer = self.get_serializer(data=data)
                                serializer.is_valid(raise_exception=True)

                                if (i - 1) == todayVal:
                                    self.perform_create(serializer)
                                    headers = self.get_success_headers(
                                        serializer.data)
                                    all_serializer_data.append(serializer.data)

                                today_and_ungenerated_day_data[i - 1].append(
                                    serializer.data)

        else:
            for valid_active_strictevent in valid_active_strictevents:

                event_id = valid_active_strictevent.event_id
                event_name = valid_active_strictevent.event_name
                priority = valid_active_strictevent.priority

                valid_active_o_o_1s = all_valid_active_o_o_1s.filter(
                    event_id=int(event_id))

                valid_active_times = all_valid_active_times.filter(
                    time_id__in=valid_active_o_o_1s.values("time_id"))

                for valid_active_time in valid_active_times:

                    start = valid_active_time.start
                    end = valid_active_time.end

                    date_time = datetime.datetime(
                        int(day_date_filter[0:4]),
                        int(day_date_filter[5:7]),
                        int(day_date_filter[8:10]),
                        start.hour,
                        start.minute,
                        start.second)
                    end_time = datetime.datetime(
                        int(day_date_filter[0:4]),
                        int(day_date_filter[5:7]),
                        int(day_date_filter[8:10]),
                        end.hour,
                        end.minute,
                        end.second)

                    # I don't think this would work, 'end' and 'start' are TimeFields so it depends how they are returned
                    if end <= start:
                        end_time = end_time + datetime.timedelta(days=1)

                    data = {
                        "date_time": date_time,
                        "end_time": end_time,
                        "schedule": int(schedule_filter),
                        "event": event_id
                    }

                    serializer = self.get_serializer(data=data)
                    serializer.is_valid(raise_exception=True)
                    self.perform_create(serializer)
                    headers = self.get_success_headers(serializer.data)
                    all_serializer_data.append(serializer.data)

        print("------------------------------------------------------------")
        for key, value in today_and_ungenerated_day_data.items():
            if key == -1:
                print("The ungenerated strict event time deltas for previous ",
                      day_str_list[6], ": ", value)
            elif key == 7:
                print("The ungenerated strict event time deltas for next ",
                      day_str_list[0], ": ", value)
            else:
                print("The ungenerated strict event time deltas for ",
                      day_str_list[key], ": ", value)
        print("all serializer data which is the list of strict event time deltas for the day being generated: ", all_serializer_data)
        print("------------------------------------------------------------")

        all_tds = {}
        all_diff_tds = {}

        for key, list_of_tds in today_and_ungenerated_day_data.items():
            # make the tds list, and the diff_tds list
            # for each ungenerated day you will have to get the start/end of the previous day's last timedelta
            # and you will also have to get tomrrow's first timedelta
            if need_full_week_of_strictevent_timedeltas or (key == todayVal):
                if (key < 7) and (key > -1):
                    if (key - 1) in list(map(lambda aTuple: aTuple[0], today_and_ungenerated_day_data.items())):
                        prev_end_times = list(map(
                            lambda dataDict: dataDict['end_time'], today_and_ungenerated_day_data[key - 1]))

                        last_prev_end_time = prev_end_times[0]

                    else:
                        prevTimeDeltas = this_week_timedeltas[key]

                        prev_end_times = list(
                            map(lambda a_td: a_td.end_time, prevTimeDeltas)
                        )

                        last_prev_end_time = str(prev_end_times[0])

                    for i in range(len(prev_end_times)):
                        last_prev_end_time_datetime = datetime.datetime(int(last_prev_end_time[0:4]), int(last_prev_end_time[5:7]), int(
                            last_prev_end_time[8:10]), int(last_prev_end_time[11:13]), int(last_prev_end_time[14:16]))
                        prev_end_time_arr_datetime = datetime.datetime(int(str(prev_end_times[i])[0:4]), int(str(prev_end_times[i])[5:7]), int(
                            str(prev_end_times[i])[8:10]), int(str(prev_end_times[i])[11:13]), int(str(prev_end_times[i])[14:16]))
                        time_difference_minutes = (
                            prev_end_time_arr_datetime - last_prev_end_time_datetime).total_seconds() / 60

                        if time_difference_minutes > 0:
                            last_prev_end_time = str(prev_end_times[i])

                    current_date_str = thisWeeksDates[key + 1]
                    print("current_date_str is: ", current_date_str)
                    midnight_beginning_of_current_date_datetime = datetime.datetime(int(
                        current_date_str[0:4]), int(current_date_str[5:7]), int(current_date_str[8:10]), 0, 0)
                    print("midnight_beginning_of_current_date_datetime is: ",
                          midnight_beginning_of_current_date_datetime)
                    last_prev_end_time_datetime = datetime.datetime(int(last_prev_end_time[0:4]), int(last_prev_end_time[5:7]), int(
                        last_prev_end_time[8:10]), int(last_prev_end_time[11:13]), int(last_prev_end_time[14:16]))
                    print("last_prev_end_time_datetime: ",
                          last_prev_end_time_datetime)
                    time_difference_minutes = (
                        last_prev_end_time_datetime - midnight_beginning_of_current_date_datetime).total_seconds() / 60
                    print("time_difference_minutes: ", time_difference_minutes)
                    if time_difference_minutes > 0:
                        first_val = last_prev_end_time
                    else:
                        first_val = current_date_str + "T00:00Z"
                    print(first_val)

                if (key < 7) and (key > -1):

                    if (key + 1) in list(map(lambda aTuple: aTuple[0], today_and_ungenerated_day_data.items())):
                        next_start_times = list(map(
                            lambda dataDict: dataDict['date_time'], today_and_ungenerated_day_data[key + 1]))

                        first_next_start_time = next_start_times[0]

                    else:
                        nextTimeDeltas = this_week_timedeltas[key + 2]

                        next_start_times = list(
                            map(lambda a_td: a_td.date_time, nextTimeDeltas))

                        first_next_start_time = str(next_start_times[0])

                    for i in range(len(next_start_times)):
                        first_next_start_time_datetime = datetime.datetime(int(first_next_start_time[0:4]), int(first_next_start_time[5:7]), int(
                            first_next_start_time[8:10]), int(first_next_start_time[11:13]), int(first_next_start_time[14:16]))
                        next_start_time_arr_datetime = datetime.datetime(int(str(next_start_times[i])[0:4]), int(str(next_start_times[i])[5:7]), int(
                            str(next_start_times[i])[8:10]), int(str(next_start_times[i])[11:13]), int(str(next_start_times[i])[14:16]))
                        time_difference_minutes = (
                            next_start_time_arr_datetime - first_next_start_time_datetime).total_seconds() / 60

                        if time_difference_minutes < 0:
                            first_next_start_time = str(next_start_times[i])

                    last_val = first_next_start_time
                    print("last_val is: ", last_val)

                if (key < 7) and (key > -1):
                    tds = [first_val]

                    tds_date_time = [td["date_time"] for td in list_of_tds]
                    tds_end_time = [td["end_time"] for td in list_of_tds]

                    # Big O-n^2 sorting algorithm of dates, I just really don't feel like figuring out another way right now
                    # The input array will always be very small since n = # of timedeltas in a day (amount of things you schedule in a day)
                    for i in range(len(tds_date_time) - 1):
                        for j in range(len(tds_date_time) - 1):
                            date_time_1_str = tds_date_time[j]
                            date_time_2_str = tds_date_time[j + 1]
                            date_time_1_datetime = datetime.datetime(int(date_time_1_str[0:4]), int(date_time_1_str[5:7]), int(
                                date_time_1_str[8:10]), int(date_time_1_str[11:13]), int(date_time_1_str[14:16]))
                            date_time_2_datetime = datetime.datetime(int(date_time_2_str[0:4]), int(date_time_2_str[5:7]), int(
                                date_time_2_str[8:10]), int(date_time_2_str[11:13]), int(date_time_2_str[14:16]))
                            time_difference_minutes = (
                                date_time_2_datetime - date_time_1_datetime).total_seconds() / 60
                            end_time_1_str = tds_end_time[j]
                            end_time_2_str = tds_end_time[j + 1]
                            if time_difference_minutes < 0:
                                tds_date_time[j] = date_time_2_str
                                tds_date_time[j + 1] = date_time_1_str
                                tds_end_time[j] = end_time_2_str
                                tds_end_time[j + 1] = end_time_1_str

                    print("= = = = = = = = = = = = = = = = = =")
                    print("The key is: ", key)
                    print("Time Delta Start Times: ", tds_date_time)
                    print("Time Delta End Times: ", tds_end_time)

                    for i in range(len(tds_date_time)):
                        tds.append(tds_date_time[i])
                        tds.append(tds_end_time[i])

                    tds.append(last_val)

                    diff_tds = []

                    for i in range(int(len(tds) / 2)):
                        first_time_date = datetime.datetime(int(tds[2 * i][0:4]), int(tds[2 * i][5:7]), int(
                            tds[2 * i][8:10]), int(tds[2 * i][11:13]), int(tds[2 * i][14:16]))
                        second_time_date = datetime.datetime(int(tds[2 * i + 1][0:4]), int(tds[2 * i + 1][5:7]), int(
                            tds[2 * i + 1][8:10]), int(tds[2 * i + 1][11:13]), int(tds[2 * i + 1][14:16]))
                        minute_difference = int(
                            (second_time_date - first_time_date).total_seconds() / 60)
                        print(first_time_date)
                        print(second_time_date)
                        print(minute_difference)
                        diff_tds.append(minute_difference)

                    print("Time Delta Time Differences: ", diff_tds)

                    all_tds[key] = tds
                    all_diff_tds[key] = diff_tds

        # I think it's best to prioritize the random events that require the most amount of time spent.
        # So I order 'valid_active_looseevents' by n_time * n_occ

        print(valid_active_looseevents)
        print([v_a_l.n_time * v_a_l.n_occ for v_a_l in valid_active_looseevents])

        all_loose_event_times_per_week = []
        loose_event_indexes_ordered_highest_time_per_week_first = []

        for valid_active_looseevent in valid_active_looseevents:

            n_occ = valid_active_looseevent.n_occ
            n_time = valid_active_looseevent.n_time

            all_loose_event_times_per_week.append(n_occ * n_time)

        for i in range(len(all_loose_event_times_per_week)):

            largest_time_per_week_index = -1
            largest_time_per_week = -1

            j = -1

            for time_per_week in all_loose_event_times_per_week:
                j += 1
                if time_per_week > largest_time_per_week:

                    largest_time_per_week = time_per_week
                    largest_time_per_week_index = j

            loose_event_indexes_ordered_highest_time_per_week_first.append(
                largest_time_per_week_index)
            all_loose_event_times_per_week[largest_time_per_week_index] = -1

        print("loose_event_indexes_ordered_highest_time_per_week_first")
        print(loose_event_indexes_ordered_highest_time_per_week_first)

        ordered_valid_active_looseevents = []

        j = 0

        for val in valid_active_looseevents:
            i = -1
            for valid_active_looseevent in valid_active_looseevents:
                i += 1
                if i == loose_event_indexes_ordered_highest_time_per_week_first[j]:
                    ordered_valid_active_looseevents.append(
                        valid_active_looseevent)
            j += 1

        print(ordered_valid_active_looseevents)
        print([v_a_l.n_time * v_a_l.n_occ for v_a_l in ordered_valid_active_looseevents])

        for valid_active_looseevent in valid_active_looseevents:

            event_id = valid_active_looseevent.event_id
            event_name = valid_active_looseevent.event_name
            priority = valid_active_looseevent.priority
            e_oa_1 = valid_active_looseevent.e_oa_1
            e_oa_2 = valid_active_looseevent.e_oa_2
            nn_n_1 = valid_active_looseevent.nn_n_1
            nn_n_2 = valid_active_looseevent.nn_n_2
            nn_n_3 = valid_active_looseevent.nn_n_3
            nn_n_4 = valid_active_looseevent.nn_n_4
            n_occ = valid_active_looseevent.n_occ
            n_occ_more = valid_active_looseevent.n_occ_more
            n_occ_less = valid_active_looseevent.n_occ_less
            occ_same_day = valid_active_looseevent.occ_same_day
            n_time = valid_active_looseevent.n_time
            n_time_more = valid_active_looseevent.n_time_more
            n_time_less = valid_active_looseevent.n_time_less

            # This is an event that might occur more than one day out of the week, so we use all of the potential available timedelta
            # start slots of the week to determine how many possible slots could be filled with this loose event's timedeltas.
            # This is why we generate the 'all_tds' dictionary and the 'all_diff_tds' dictionaries.
            todays_tds = all_tds[todayVal]
            todays_diff_tds = all_diff_tds[todayVal]

            print("= = = = = = We are currently looking at event: ",
                  event_name, ", with event_id: ", event_id, " = = = = = =")

            print("----todays_tds and todays_diff_tds----")
            print(todays_tds)
            print(todays_diff_tds)

            if need_full_week_of_strictevent_timedeltas:

                this_event_o_o_2s = occurs_on_2.objects.filter(
                    event_id=int(event_id))

                this_event_day_2s = Day.objects.filter(
                    day_id__in=this_event_o_o_2s.values("day_id"))

                this_event_day_strs = [
                    this_event_day.day_str for this_event_day in this_event_day_2s]
                this_event_day_indexes = []

                for i in range(len(day_str_list)):
                    if day_str_list[i] in this_event_day_strs:
                        this_event_day_indexes.append(i + 1)

                this_event_day_dates = [thisWeeksDates[this_event_day_index]
                                        for this_event_day_index in this_event_day_indexes]

                print("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-")
                print(this_event_o_o_2s)
                print(this_event_day_2s)
                print(this_event_day_strs)
                print(this_event_day_indexes)
                print("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-")

                all_o_o_2s_for_this_event_day_strs = [occurs_on_2.objects.filter(day_id__in=Day.objects.filter(
                    day_str=this_event_day_str).values("day_id")) for this_event_day_str in this_event_day_strs]
                all_o_o_2s_for_this_event_day_dates = [occurs_on_2.objects.filter(day_id__in=Day.objects.filter(
                    day_date=this_event_day_date).values("day_id")) for this_event_day_date in this_event_day_dates]

                all_loose_events_for_this_event_day_strs = [LooseEvent.objects.filter(
                    occurs_on_2s__in=all_o_o_2s_for_this_event_day_str) for all_o_o_2s_for_this_event_day_str in all_o_o_2s_for_this_event_day_strs]
                all_loose_events_for_this_event_day_dates = [LooseEvent.objects.filter(
                    occurs_on_2s__in=all_o_o_2s_for_this_event_day_date) for all_o_o_2s_for_this_event_day_date in all_o_o_2s_for_this_event_day_dates]

                all_loose_events_for_this_event = [all_loose_events_for_this_event_day_strs[i] |
                                                   all_loose_events_for_this_event_day_dates[i] for i in range(len(all_loose_events_for_this_event_day_strs))]

                ordered_all_loose_events_for_this_event = []
                ordered_all_loose_events_for_this_event_event_id = []
                loose_event_indexes_ordered_highest_time_per_week_first_this_event = []

                print(all_loose_events_for_this_event)

                for loose_events_for_one_day in all_loose_events_for_this_event:

                    all_loose_event_times_per_week = []
                    loose_event_indexes_ordered_highest_time_per_week_first = []

                    for loose_event_for_one_day in loose_events_for_one_day:

                        temp_n_occ = loose_event_for_one_day.n_occ
                        temp_n_time = loose_event_for_one_day.n_time

                        all_loose_event_times_per_week.append(
                            temp_n_occ * temp_n_time)

                    for i in range(len(all_loose_event_times_per_week)):

                        largest_time_per_week_index = -1
                        largest_time_per_week = -1

                        j = -1

                        for time_per_week in all_loose_event_times_per_week:
                            j += 1
                            if time_per_week > largest_time_per_week:

                                largest_time_per_week = time_per_week
                                largest_time_per_week_index = j

                        loose_event_indexes_ordered_highest_time_per_week_first.append(
                            largest_time_per_week_index)
                        all_loose_event_times_per_week[largest_time_per_week_index] = -1

                    loose_event_indexes_ordered_highest_time_per_week_first_this_event.append(
                        loose_event_indexes_ordered_highest_time_per_week_first)

                    ordered_valid_active_looseevents = []

                    j = 0

                    for val in loose_events_for_one_day:
                        i = -1
                        for loose_event_for_one_day in loose_events_for_one_day:
                            i += 1
                            if i == loose_event_indexes_ordered_highest_time_per_week_first[j]:
                                ordered_valid_active_looseevents.append(
                                    loose_event_for_one_day)
                        j += 1

                    ordered_all_loose_events_for_this_event.append(
                        ordered_valid_active_looseevents)

                    found_event_id = False
                    temp_o_a_l_e_f_t_e_e_i = []
                    for o_v_a_l in ordered_valid_active_looseevents:
                        if o_v_a_l.event_id == event_id:
                            found_event_id = True
                        if not found_event_id:
                            temp_o_a_l_e_f_t_e_e_i.append(o_v_a_l.event_id)

                    ordered_all_loose_events_for_this_event_event_id.append(
                        temp_o_a_l_e_f_t_e_e_i)

                print(ordered_all_loose_events_for_this_event)
                print(ordered_all_loose_events_for_this_event_event_id)
                print(loose_event_indexes_ordered_highest_time_per_week_first_this_event)
                print("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-")

                pot_nocc = 0
                prev_nocc = 0
                total_available_slots = 0

                # Investigate how this works, in particular the values of (key + 1) and
                # the values in this_event_day_indexes. The same kind of if statement
                # might need to be placed in the next for-loop (and also in the
                # way-outer else statement way-below)
                for key, diff_tds in all_diff_tds.items():
                    if (key + 1) in this_event_day_indexes:
                        print("-------diff_tds and n_time-------")
                        print(diff_tds)
                        print(n_time)
                        print("- - - - - - pot_nocc - - - - - -")
                        for diff_td in diff_tds:
                            rounded_down_diff_td = m.floor(diff_td / 5) * 5
                            if rounded_down_diff_td >= n_time:
                                print(((rounded_down_diff_td - n_time) / 5) + 1)
                                pot_nocc += (((rounded_down_diff_td - n_time) / 5) + 1)
                                total_available_slots += m.floor(
                                    rounded_down_diff_td / n_time)
                print("pot_nocc before subtracting for all loose events: ", pot_nocc)
                print("total_available_slots before subtracting for all loose events: ",
                      total_available_slots)

                # If our event ocurrs on Monday, Wednesday, Friday, and Saturday, then we are iterating on values
                # i = 0, 1, 2, 3. The value of 'this_event_day_index' should iterate through 1, 3, 5, 6.
                # If today is 'Wednesday', then 'todayVal' would be 2, so todayVal + 1 = 3. Suppose we have already
                # generated a schedule for Monday, and Tuesday, then the numbers in the list
                # 'list(map(lambda aTuple: aTuple[0], today_and_ungenerated_day_data.items()))'
                # would be [0, 1]. We want to subtract from pot_nocc the expected time scheduled for ungenerated days
                # that our event will occur on, not including today, which means only for subset [5, 6] C [1, 3, 5, 6] == this_event_day_indexes.
                print("Read comment line ~ 734")
                print(this_event_day_indexes)
                print(todayVal + 1)
                print(
                    list(map(lambda aTuple: aTuple[0], today_and_ungenerated_day_data.items())))
                for i in range(len(this_event_day_indexes)):
                    this_event_day_index = this_event_day_indexes[i]
                    if (this_event_day_index != (todayVal + 1)) and (this_event_day_index - 1 in list(map(lambda aTuple: aTuple[0], today_and_ungenerated_day_data.items()))):
                        temp_loose_events = LooseEvent.objects.filter(
                            event_id__in=ordered_all_loose_events_for_this_event_event_id[i])
                        for temp_loose_event in temp_loose_events:
                            temp_n_occ = temp_loose_event.n_occ
                            temp_n_time = temp_loose_event.n_time
                            subtracted_time = m.floor(
                                ((temp_n_occ * temp_n_time / 7.) + 2.5) / 5) * 5
                            pot_nocc -= (subtracted_time / 5)
                            total_available_slots -= m.floor(
                                subtracted_time / n_time)

                print("pot_nocc after subtracting for all loose events: ", pot_nocc)
                print("total_available_slots after subtracting for all loose events: ",
                      total_available_slots)

                # I'm pretty sure that 'prev_nocc' should only be a count of the number of times that
                # the event ocurred this week and should not count last sunday or the next monday
                print("==this_week_timedeltas & prev_nocc==")
                print(this_week_timedeltas)
                for i in range(1, 8):
                    if i in this_event_day_indexes:
                        for timedelta_in_day in this_week_timedeltas[i]:
                            print(timedelta_in_day.event.event_id)
                            print(event_id)
                            print(timedelta_in_day.event_id == event_id)
                            if timedelta_in_day.event.event_id == event_id:
                                prev_nocc += 1
                print("prev_nocc is: ", prev_nocc)

                num_available_days = 0

                for this_event_day_index in this_event_day_indexes:
                    if this_event_day_index - 1 in list(map(lambda aTuple: aTuple[0], today_and_ungenerated_day_data.items())):
                        num_available_days += 1

                initial_pot_nocc = pot_nocc

                acc_sub_pot_nocc = 0

                if occ_same_day:

                    i = -1

                    while (i + 1) < len(todays_diff_tds):

                        i += 1

                        if e_oa_1:
                            n_occ_mult = n_occ
                        else:
                            n_occ_mult = generate_gaussian(
                                nn_n_1, nn_n_2, n_occ, n_occ_more, n_occ_less, (n_occ + 20 * (n_occ_more - n_occ)))
                        print("e_oa_1 is: ", e_oa_1)
                        print("n_occ_mult is: ", n_occ_mult)

                        extra_pot_nocc_sub = int(
                            (n_occ_mult - prev_nocc) * ((n_time / 5) - 1))

                        pot_nocc = initial_pot_nocc - \
                            (extra_pot_nocc_sub + acc_sub_pot_nocc)

                        print("--------------------------------------------------")
                        print("--------------------------------------------------")

                        rounded_down_diff_td = m.floor(
                            todays_diff_tds[i] / 5) * 5
                        print("rounded_down_diff_td:", rounded_down_diff_td)

                        if rounded_down_diff_td >= n_time:
                            td_start_time = todays_tds[2 * i]
                            print("td_start_time: ", td_start_time)
                            td_start_time_datetime = datetime.datetime(int(td_start_time[0:4]), int(td_start_time[5:7]), int(
                                td_start_time[8:10]), int(td_start_time[11:13]), int(td_start_time[14:16]))
                            print("td_start_time_datetime: ",
                                  td_start_time_datetime)
                            tomorrow_midnight = datetime.datetime(
                                int(thisWeeksDates[todayVal + 2][0:4]), int(thisWeeksDates[todayVal + 2][5:7]), int(thisWeeksDates[todayVal + 2][8:10]), 0, 0)
                            print("tomorrow_midnight:", tomorrow_midnight)
                            minute_difference_from_midnight_rounded = m.floor(
                                ((tomorrow_midnight - td_start_time_datetime).total_seconds() / 60) / 5) * 5
                            print("minute_difference_from_midnight_rounded: ",
                                  minute_difference_from_midnight_rounded)

                            # This if-logic doesn't make a lot of sense to me
                            # (seeing it a couple of weeks later,
                            # why would we care whether midnight is before tomorrow's first event?
                            # wouldn't this only matter for the last slice of time in the day?
                            # maybe it is because the start of the last event shouldn't start after midnight?)
                            if rounded_down_diff_td <= minute_difference_from_midnight_rounded:
                                temp_pot_nocc = ((
                                    rounded_down_diff_td - n_time) / 5) + 1

                            else:
                                temp_pot_nocc = ((
                                    minute_difference_from_midnight_rounded - n_time) / 5) + 1
                            print("temp_pot_nocc: ", temp_pot_nocc)

                            print("pot_nocc is: ", pot_nocc)

                            j = 0
                            while (j < temp_pot_nocc) and (rounded_down_diff_td >= n_time):

                                pot_nocc = initial_pot_nocc - \
                                    (extra_pot_nocc_sub + acc_sub_pot_nocc)

                                if pot_nocc <= 0:
                                    odds_of_insertion = 1

                                elif (n_occ_mult - prev_nocc) <= 0:
                                    odds_of_insertion = 0
                                else:
                                    odds_of_insertion = (
                                        n_occ_mult - prev_nocc) / pot_nocc

                                    if odds_of_insertion < 0:
                                        odds_of_insertion = 0

                                random_val_0_to_1 = r.random()

                                if random_val_0_to_1 > (1 - odds_of_insertion):

                                    print(
                                        "------ todays_tds & todays_diff_tds ------")
                                    print(todays_tds)
                                    print(todays_diff_tds)
                                    print (
                                        "-----------------------------------------")
                                    print("i is: ", i)
                                    print("j is: ", j)
                                    print("random value is: ",
                                          random_val_0_to_1)
                                    print("(1 - odds_of_insertion) is: ",
                                          (1 - odds_of_insertion))

                                    inserted_start_time = td_start_time_datetime + \
                                        datetime.timedelta(minutes=(5 * j))

                                    print("inserted start time: ",
                                          inserted_start_time)

                                    available_time = rounded_down_diff_td - \
                                        (5 * j)

                                    print("nn_n_3 is: ", nn_n_3)
                                    print("nn_n_4 is: ", nn_n_4)
                                    print("n_time is: ", n_time)
                                    print("n_time_more is: ", n_time_more)
                                    print("n_time_less is: ", n_time_less)
                                    print("available_time is: ",
                                          available_time)

                                    if e_oa_2:
                                        randomly_generated_time = n_time
                                    else:
                                        randomly_generated_time = m.floor((generate_gaussian(
                                            nn_n_3, nn_n_4, n_time, n_time_more, n_time_less, available_time) + 2.5) / 5) * 5

                                    print("randomly generated time is: ",
                                          randomly_generated_time)

                                    inserted_end_time = inserted_start_time + \
                                        datetime.timedelta(
                                            minutes=randomly_generated_time)

                                    print("inserted end time: ",
                                          inserted_end_time)

                                    data = {
                                        "date_time": inserted_start_time,
                                        "end_time": inserted_end_time,
                                        "schedule": int(schedule_filter),
                                        "event": event_id
                                    }

                                    serializer = self.get_serializer(data=data)
                                    serializer.is_valid(raise_exception=True)
                                    self.perform_create(serializer)
                                    headers = self.get_success_headers(
                                        serializer.data)
                                    all_serializer_data.append(serializer.data)

                                    inserted_start_time_str = str(inserted_start_time)[
                                        0:10] + 'T' + str(inserted_start_time)[11:19] + 'Z'
                                    inserted_end_time_str = str(inserted_end_time)[
                                        0:10] + 'T' + str(inserted_end_time)[11:19] + 'Z'

                                    todays_tds.insert(
                                        (2 * i) + 1, inserted_start_time_str)
                                    todays_tds.insert(
                                        2 * (i + 1), inserted_end_time_str)
                                    all_tds[todayVal] = todays_tds
                                    todays_diff_tds.insert(
                                        i + 1, available_time - randomly_generated_time)
                                    todays_diff_tds[i] = j * 5
                                    all_diff_tds[todayVal] = todays_diff_tds

                                    num_of_5_minutes_in_duration = randomly_generated_time / 5

                                    prev_nocc += 1
                                    temp_pot_nocc = ((
                                        available_time - randomly_generated_time) / 5) + 1
                                    j = 0
                                    i += 1

                                    rounded_down_diff_td = m.floor(
                                        todays_diff_tds[i] / 5) * 5
                                    print("rounded_down_diff_td:",
                                          rounded_down_diff_td)

                                    if rounded_down_diff_td >= n_time:
                                        td_start_time = todays_tds[2 * i]
                                        print("td_start_time: ", td_start_time)
                                        td_start_time_datetime = datetime.datetime(int(td_start_time[0:4]), int(td_start_time[5:7]), int(
                                            td_start_time[8:10]), int(td_start_time[11:13]), int(td_start_time[14:16]))
                                        print("td_start_time_datetime: ",
                                              td_start_time_datetime)
                                        tomorrow_midnight = datetime.datetime(
                                            int(thisWeeksDates[todayVal + 2][0:4]), int(thisWeeksDates[todayVal + 2][5:7]), int(thisWeeksDates[todayVal + 2][8:10]), 0, 0)
                                        print("tomorrow_midnight:",
                                              tomorrow_midnight)
                                        minute_difference_from_midnight_rounded = m.floor(
                                            ((tomorrow_midnight - td_start_time_datetime).total_seconds() / 60) / 5) * 5
                                        print("minute_difference_from_midnight_rounded: ",
                                              minute_difference_from_midnight_rounded)

                                        # This if-logic doesn't make a lot of sense to me
                                        # (seeing it a couple of weeks later,
                                        # why would we care whether midnight is before tomorrow's first event?
                                        # wouldn't this only matter for the last slice of time in the day?
                                        # maybe it is because the start of the last event shouldn't start after midnight?)
                                        if rounded_down_diff_td <= minute_difference_from_midnight_rounded:
                                            temp_pot_nocc = ((
                                                rounded_down_diff_td - n_time) / 5) + 1

                                        else:
                                            temp_pot_nocc = ((
                                                minute_difference_from_midnight_rounded - n_time) / 5) + 1

                                else:

                                    acc_sub_pot_nocc += 1
                                    j += 1

                                    if j == temp_pot_nocc:
                                        acc_sub_pot_nocc += (n_time / 5.)

                else:

                    today_odds = (n_occ_mult - prev_nocc) / num_available_days

                    print("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
                    print("number_of_available_days: ", num_available_days)
                    print("n_occ_mult: ", n_occ_mult)
                    print("prev_nocc: ", prev_nocc)
                    print("today_odds: ", today_odds)
                    print("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")

                    r2 = r.random()
                    if r2 <= today_odds:

                        today_pot_nocc = 0

                        for diff_td in todays_diff_tds:
                            rounded_down_diff_td = m.floor(diff_td / 5) * 5
                            if rounded_down_diff_td >= n_time:
                                today_pot_nocc += (
                                    ((rounded_down_diff_td - n_time) / 5) + 1)

                        i = -1
                        while (i + 1) < len(todays_diff_tds):

                            i += 1

                            rounded_down_diff_td = m.floor(
                                todays_diff_tds[i] / 5) * 5

                            if rounded_down_diff_td >= n_time:

                                td_start_time = todays_tds[2 * i]
                                td_start_time_datetime = datetime.datetime(int(td_start_time[0:4]), int(td_start_time[5:7]), int(
                                    td_start_time[8:10]), int(td_start_time[11:13]), int(td_start_time[14:16]))
                                tomorrow_midnight = datetime.datetime(
                                    int(thisWeeksDates[todayVal + 2][0:4]), int(thisWeeksDates[todayVal + 2][5:7]), int(thisWeeksDates[todayVal + 2][8:10]), 0, 0)
                                minute_difference_from_midnight_rounded = m.floor(
                                    ((tomorrow_midnight - td_start_time_datetime).total_seconds() / 60) / 5) * 5

                                if rounded_down_diff_td <= minute_difference_from_midnight_rounded:
                                    temp_pot_nocc = ((
                                        rounded_down_diff_td - n_time) / 5) + 1

                                else:
                                    temp_pot_nocc = ((
                                        minute_difference_from_midnight_rounded - n_time) / 5) + 1

                                j = 0
                                while j < temp_pot_nocc:

                                    if today_pot_nocc <= 0:
                                        odds_of_insertion = 1
                                    else:
                                        odds_of_insertion = 1 / today_pot_nocc

                                    if odds_of_insertion <= 0:
                                        odds_of_insertion = 0

                                    random_val_0_to_1 = r.random()

                                    if random_val_0_to_1 > (1 - odds_of_insertion):

                                        inserted_start_time = td_start_time_datetime + \
                                            datetime.timedelta(minutes=(5 * j))

                                        available_time = rounded_down_diff_td - \
                                            (5 * j)

                                        if e_oa_2:
                                            randomly_generated_time = n_time
                                        else:
                                            randomly_generated_time = m.floor((generate_gaussian(
                                                nn_n_3, nn_n_4, n_time, n_time_more, n_time_less, available_time) + 2.5) / 5) * 5

                                        inserted_end_time = inserted_start_time + \
                                            datetime.timedelta(
                                                minutes=randomly_generated_time)

                                        data = {
                                            "date_time": inserted_start_time,
                                            "end_time": inserted_end_time,
                                            "schedule": int(schedule_filter),
                                            "event": event_id
                                        }

                                        serializer = self.get_serializer(
                                            data=data)
                                        serializer.is_valid(
                                            raise_exception=True)
                                        self.perform_create(serializer)
                                        headers = self.get_success_headers(
                                            serializer.data)
                                        all_serializer_data.append(
                                            serializer.data)

                                        inserted_start_time_str = str(inserted_start_time)[
                                            0:10] + 'T' + str(inserted_start_time)[11:19] + 'Z'
                                        inserted_end_time_str = str(inserted_end_time)[
                                            0:10] + 'T' + str(inserted_end_time)[11:19] + 'Z'

                                        todays_tds.insert(
                                            (2 * i) + 1, inserted_start_time_str)
                                        todays_tds.insert(
                                            2 * (i + 1), inserted_end_time_str)
                                        all_tds[todayVal] = todays_tds
                                        todays_diff_tds.insert(
                                            i + 1, available_time - randomly_generated_time)
                                        todays_diff_tds[i] = j * 5
                                        all_diff_tds[todayVal] = todays_diff_tds

                                        num_of_5_minutes_in_duration = randomly_generated_time / 5

                                        prev_nocc += 1
                                        today_pot_nocc -= num_of_5_minutes_in_duration
                                        temp_pot_nocc = ((
                                            available_time - randomly_generated_time) / 5) + 1
                                        j = temp_pot_nocc
                                        i = len(todays_diff_tds)

                                    else:
                                        today_pot_nocc -= 1
                                        j += 1

                                        if j == temp_pot_nocc:
                                            today_pot_nocc -= (n_time / 5.)

            # This event ocurrs only once, and it is the current day on the calendar, so instead of using all of potential available
            # timedelta start slots of the week, we only use the available slots of the data which can be found in 'all_serializer_data'.
            else:

                pot_nocc = 0
                prev_nocc = 0
                total_available_slots = 0

                for diff_td in todays_diff_tds:
                    rounded_down_diff_td = m.floor(diff_td / 5) * 5
                    if rounded_down_diff_td >= n_time:
                        pot_nocc += (((rounded_down_diff_td - n_time) / 5) + 1)
                        total_available_slots += m.floor(
                            rounded_down_diff_td / n_time)

                initial_pot_nocc = pot_nocc
                acc_sub_pot_nocc = 0

                i = -1

                while (i + 1) < len(todays_diff_tds):

                    i += 1

                    if e_oa_1:
                        n_occ_mult = n_occ
                    else:
                        n_occ_mult = generate_gaussian(
                            nn_n_1, nn_n_2, n_occ, n_occ_more, n_occ_less, (n_occ + 20 * (n_occ_more - n_occ)))

                    rounded_down_diff_td = m.floor(todays_diff_tds[i] / 5) * 5

                    if rounded_down_diff_td >= n_time:

                        td_start_time = todays_tds[2 * i]
                        td_start_time_datetime = datetime.datetime(int(td_start_time[0:4]), int(td_start_time[5:7]), int(
                            td_start_time[8:10]), int(td_start_time[11:13]), int(td_start_time[14:16]))
                        tomorrow_midnight = datetime.datetime(
                            int(thisWeeksDates[todayVal + 2][0:4]), int(thisWeeksDates[todayVal + 2][5:7]), int(thisWeeksDates[todayVal + 2][8:10]), 0, 0)
                        minute_difference_from_midnight_rounded = m.floor(
                            ((tomorrow_midnight - td_start_time_datetime).total_seconds() / 60) / 5) * 5

                        if rounded_down_diff_td <= minute_difference_from_midnight_rounded:
                            temp_pot_nocc = (rounded_down_diff_td - n_time) / 5

                        else:
                            temp_pot_nocc = (
                                minute_difference_from_midnight_rounded - n_time) / 5

                        j = 0
                        while j < temp_pot_nocc:

                            pot_nocc = initial_pot_nocc - acc_sub_pot_nocc

                            if pot_nocc <= 0:
                                odds_of_insertion = 1
                            elif (n_occ_mult - prev_nocc) <= 0:
                                odds_of_insertion = 0
                            else:
                                odds_of_insertion = (
                                    n_occ_mult - prev_nocc) / pot_nocc

                                if odds_of_insertion < 0:
                                    odds_of_insertion = 0

                            random_val_0_to_1 = r.random()

                            if random_val_0_to_1 > (1 - odds_of_insertion):

                                inserted_start_time = td_start_time_datetime + \
                                    datetime.timedelta(minutes=(5 * j))

                                available_time = rounded_down_diff_td - (5 * j)

                                if e_oa_2:
                                    randomly_generated_time = n_time
                                else:
                                    randomly_generated_time = m.floor((generate_gaussian(
                                        nn_n_3, nn_n_4, n_time, n_time_more, n_time_less, available_time) + 2.5) / 5) * 5

                                inserted_end_time = inserted_start_time + \
                                    datetime.timedelta(
                                        minutes=randomly_generated_time)

                                data = {
                                    "date_time": inserted_start_time,
                                    "end_time": inserted_end_time,
                                    "schedule": int(schedule_filter),
                                    "event": event_id
                                }

                                serializer = self.get_serializer(data=data)
                                serializer.is_valid(raise_exception=True)
                                self.perform_create(serializer)
                                headers = self.get_success_headers(
                                    serializer.data)
                                all_serializer_data.append(serializer.data)

                                inserted_start_time_str = str(inserted_start_time)[
                                    0:10] + 'T' + str(inserted_start_time)[11:19] + 'Z'
                                inserted_end_time_str = str(inserted_end_time)[
                                    0:10] + 'T' + str(inserted_end_time)[11:19] + 'Z'

                                todays_tds.insert(
                                    (2 * i) + 1, inserted_start_time_str)
                                todays_tds.insert(
                                    2 * (i + 1), inserted_end_time_str)
                                all_tds[todayVal] = todays_tds
                                todays_diff_tds.insert(
                                    i + 1, available_time - randomly_generated_time)
                                todays_diff_tds[i] = j * 5
                                all_diff_tds[todayVal] = todays_diff_tds

                                num_of_5_minutes_in_duration = randomly_generated_time / 5

                                prev_nocc += 1
                                temp_pot_nocc = ((
                                    available_time - randomly_generated_time) / 5) + 1
                                acc_sub_pot_nocc += num_of_5_minutes_in_duration
                                j = 0
                                i += 1

                            else:
                                acc_sub_pot_nocc += 1
                                j += 1

                                if j == temp_pot_nocc:
                                    acc_sub_pot_nocc += (n_time / 5.)

        try:
            theReturn = Response(
                all_serializer_data, status=status.HTTP_201_CREATED, headers=headers)
            return theReturn

        except UnboundLocalError:
            return Response(None, status=status.HTTP_204_NO_CONTENT, headers={})

    # This is going to be much more complicated, will need to use eventdefinitions and schedule

    def perform_create(self, serializer):
        serializer.save()

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

        event_filter = self.request.GET.get("event_filter", None)
        eventdefinitions = self.request.user.eventdefinitions.all()

        if event_filter == 'last':
            ordered_all_queryset = eventdefinitions.order_by("-event_id")
            if ordered_all_queryset.count() == 0:
                return []
            else:
                return [ordered_all_queryset.first()]

        if event_filter == 'first':
            ordered_all_queryset = eventdefinitions.order_by("event_id")
            if ordered_all_queryset.count() == 0:
                return []
            else:
                return [ordered_all_queryset.first()]

        if event_filter is None:
            return eventdefinitions
        elif event_filter[0] == "[":
            event_filter_list = event_filter[1:-1].split(",")
            print(event_filter_list)
            print(eventdefinitions.filter(event_id__in=event_filter_list))
            return eventdefinitions.filter(event_id__in=event_filter_list)
        else:
            print("Error in EventDefinitionViewSet Return")

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        serializer.save(owner=self.request.user)


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

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        eventdefinitions = self.request.user.eventdefinitions.all()
        looseevent_not_deleted = LooseEvent.objects.filter(
            event_id=request.data['event_id']).first()
        print(looseevent_not_deleted)
        # Sometimes during edits a strict event is replaced by a loose event,  or vice-versa,
        # but since they share an event_id it can't be tricky since a loose event is created after the
        # strict event is deleted, so this lock is in place to wait for the strict event to be deleted
        while looseevent_not_deleted is not None:
            looseevent_not_deleted = LooseEvent.objects.filter(
                event_id=request.data['event_id']).first()
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

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

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        eventdefinitions = self.request.user.eventdefinitions.all()
        strictevent_not_deleted = StrictEvent.objects.filter(
            event_id=request.data['event_id']).first()
        print(strictevent_not_deleted)
        # Sometimes during edits a strict event is replaced by a loose event,  or vice-versa,
        # but since they share an event_id it can't be tricky since a loose event is created after the
        # strict event is deleted, so this lock is in place to wait for the strict event to be deleted
        while strictevent_not_deleted is not None:
            strictevent_not_deleted = StrictEvent.objects.filter(
                event_id=request.data['event_id']).first()
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        serializer.save(owner=self.request.user)

    # def destroy(self, request, *args, **kwargs):
        # instance = self.get_object()
        # self.perform_destroy(instance)
        # return Response(status=status.HTTP_204_NO_CONTENT)

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
        queryset_2 = Day.objects.filter(
            day_id__in=occurs_on_2s.values("day_id"))
        queryset = queryset_1 | queryset_2

        if day_filter is None:
            return queryset
        elif day_filter[0] == "[":
            day_filter_list = day_filter[1:-1].split(",")
            print(day_filter_list)
            print(queryset.filter(day_id__in=day_filter_list))
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

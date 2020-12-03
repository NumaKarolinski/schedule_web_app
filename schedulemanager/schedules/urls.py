from rest_framework import routers
from .api import ScheduleViewSet, viewsViewSet, EventDefinitionViewSet, TimeDeltaViewSet, StrictEventViewSet, LooseEventViewSet, DayViewSet, TimeViewSet, occurs_on_1ViewSet, occurs_on_2ViewSet

router = routers.DefaultRouter()

router.register('api/schedules', ScheduleViewSet, 'schedules')
router.register('api/views', viewsViewSet, 'views')
router.register('api/eventdefinitions',
                EventDefinitionViewSet, 'eventdefinitions')
router.register('api/timedeltas', TimeDeltaViewSet, 'timedeltas')
router.register('api/strictevents', StrictEventViewSet, 'strictevents')
router.register('api/looseevents', LooseEventViewSet, 'looseevents')
router.register('api/days', DayViewSet, 'days')
router.register('api/times', TimeViewSet, 'times')
router.register('api/occurs_on_1s', occurs_on_1ViewSet, 'occurs_on_1s')
router.register('api/occurs_on_2s', occurs_on_2ViewSet, 'occurs_on_2s')

urlpatterns = router.urls

from rest_framework import routers
from .api import ScheduleViewSet, viewsViewSet, EventDefinitionViewSet, TimeDeltaViewSet, occurs_on_1ViewSet, occurs_on_2ViewSet

router = routers.DefaultRouter()

router.register('api/schedules', ScheduleViewSet, 'schedules')
router.register('api/views', viewsViewSet, 'views')
router.register('api/eventdefinitions',
                EventDefinitionViewSet, 'eventdefinitions')
router.register('api/timedeltas', TimeDeltaViewSet, 'timedeltas')
router.register('api/occurs_on_1s', occurs_on_1ViewSet, 'occurs_on_1s')
router.register('api/occurs_on_2s', occurs_on_2ViewSet, 'occurs_on_2s')

urlpatterns = router.urls

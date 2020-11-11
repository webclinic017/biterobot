from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import StrategyViewSet


router = DefaultRouter()

router.register(r'strategies', StrategyViewSet)
urlpatterns = router.urls

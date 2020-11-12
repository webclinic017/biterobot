from django.urls import path
from rest_framework.routers import DefaultRouter

#from .views import StrategyViewSet
from .views import StrategyView


#router = DefaultRouter()

#router.register(r'strategies', StrategyViewSet)
#urlpatterns = router.urls

urlpatterns = [
    path('', StrategyView.as_view()),
]

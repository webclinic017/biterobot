from django.urls import path
#from rest_framework.routers import DefaultRouter

from .views import StrategyView, startPage, iframeStrategyEditor


#router = DefaultRouter()

#router.register(r'strategies', StrategyViewSet)
#urlpatterns = router.urls

urlpatterns = [
    path('strategies/', StrategyView.as_view()),
    path('strategies/<str:pk>/', StrategyView.as_view()),
    path('', startPage),
    path('iframe_strategyEditor.html', iframeStrategyEditor),
]

from django.urls import path

from .views import StrategyView, startPage


urlpatterns = [
    path('', startPage),  # Strategies and Tests template
    path('strategies/', StrategyView.as_view()),  # Requests for Strategies
    path('strategies/<int:pk>/', StrategyView.as_view()),  # Requests for one Strategy
]

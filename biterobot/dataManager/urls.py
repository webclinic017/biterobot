from django.urls import path

from .views import startPage, InstrumentView, TickersView


urlpatterns = [
    path('', startPage),  # Data template
    path('instruments/', InstrumentView.as_view()),  # Requests for Data
    path('instruments/<int:pk>/', InstrumentView.as_view()),  # Requests for one Data
    path('instruments/tickers', TickersView.as_view()),  # Request for list of tickers
]

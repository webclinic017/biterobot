from django.urls import path

from .views import startPage, InstrumentView


urlpatterns = [
    path('', startPage),
    path('instruments/', InstrumentView.as_view()),
    path('instruments/<int:pk>/$/', InstrumentView.as_view()),
]

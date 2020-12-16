from django.urls import path

from .views import startPage


urlpatterns = [
    path('', startPage),
]

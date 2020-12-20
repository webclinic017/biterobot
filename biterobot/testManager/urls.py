from django.urls import path

from .views import startPage, TestView


urlpatterns = [
    #path('', startPage),
    path('', TestView.as_view()),
    path('tests/', TestView.as_view()),
]

from django.urls import path

from .views import startPage, TestArchiveView, TestView


urlpatterns = [
    #path('', startPage),
    path('', TestArchiveView.as_view()),
    path('tests/', TestArchiveView.as_view()),
    path('/check/<str:uuid>/', TestView.as_view())
]

from django.urls import path

from .views import TestArchiveView, CheckView, TestView, graphView, testView


urlpatterns = [
    path('', TestArchiveView.as_view()),  # Requests for Tests 1
    path('tests/<int:strategyId>/', testView),  # Requests for one Test
    path('tests/', TestArchiveView.as_view()),  # Requests for Tests 2
    path('check/<str:uuid>/', CheckView.as_view()),  # Requests for check Test status
    path('testres/<str:uuid>/', TestView.as_view()),  # Requests for results of Tests
    path('resultGraphs/<str:graphName>', graphView),  # Requests for Graph files .html
]

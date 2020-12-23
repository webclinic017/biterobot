from django.urls import path

from .views import startPage, TestArchiveView, CheckView, TestView, graphView, testView


urlpatterns = [
    #path('', startPage),
    path('', TestArchiveView.as_view()),
    path('tests/<int:id>/', testView),
    path('tests/', TestArchiveView.as_view()),
    path('check/<str:uuid>/', CheckView.as_view()),
    path('testres/<str:uuid>/', TestView.as_view()),
    path('resultGraphs/<str:graphName>', graphView),
]

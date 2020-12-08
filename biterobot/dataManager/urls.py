from django.urls import path

from .views import startPage, InstrumentView, iframeDataEditor


urlpatterns = [
    path('', startPage),
    path('instruments/', InstrumentView.as_view()),
    path('biterobot/data.html', iframeDataEditor),
]

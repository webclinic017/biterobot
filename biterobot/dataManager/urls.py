from django.urls import path, re_path

from .views import startPage, InstrumentView, iframeDataEditor


urlpatterns = [
    path('', startPage),
    path('instruments/', InstrumentView.as_view()),
    path('iframe_data.html', iframeDataEditor),
]

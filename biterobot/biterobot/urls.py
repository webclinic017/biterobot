from django.contrib import admin
from django.urls import path, include
from .views import indexPage, index, dataManager, strategyManager, documentationPage


urlpatterns = [
    path('admin/', admin.site.urls),
    path('strategyManager/', include('strategyManager.urls')),
    path('dataManager/', include('dataManager.urls')),
    path('testManager/', include('testManager.urls')),
    path('', index),
    path('index.html', indexPage),
    path('Documentation.html', documentationPage),
    path('strategyEditor.html', strategyManager),
    path('DataEditor.html', dataManager),
]

from django.contrib import admin
from django.urls import path, include
from .views import indexPage, index, dataManager, strategyManager, documentationPage


urlpatterns = [
    path('admin/', admin.site.urls),  # Admin panel
    path('strategyManager/', include('strategyManager.urls')),  # strategyManager app
    path('dataManager/', include('dataManager.urls')),  # dataManager app
    path('testManager/', include('testManager.urls')),  # testManager app
    path('', index),  # Main page
    path('index.html', indexPage),  # Main template
    path('Documentation.html', documentationPage),  # Documentation template
    path('strategyEditor.html', strategyManager),  # Strategies and Tests template
    path('DataEditor.html', dataManager),  # Data template
]

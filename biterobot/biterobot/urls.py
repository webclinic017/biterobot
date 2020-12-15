from django.contrib import admin
from django.urls import path, include
from .views import indexPage


urlpatterns = [
    path('admin/', admin.site.urls),
    path('strategyManager/', include('strategyManager.urls')),
    path('dataManager/', include('dataManager.urls')),
    path('index.html/', indexPage)
]

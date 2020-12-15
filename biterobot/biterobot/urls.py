from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('strategyManager/', include('strategyManager.urls')),
    path('dataManager/', include('dataManager.urls')),
]

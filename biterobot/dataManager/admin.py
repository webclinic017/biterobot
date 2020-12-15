from django.contrib import admin

from .models import InstrumentModel, CandleModel


admin.site.register(InstrumentModel)
admin.site.register(CandleModel)

from django.contrib import admin

from .models import InstrumentModel, CandleModel


admin.site.register(InstrumentModel)  # add InstrumentModel on admin panel
admin.site.register(CandleModel)  # add CandleModel on admin panel

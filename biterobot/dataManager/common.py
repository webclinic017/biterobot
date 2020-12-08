#from .tinkoffAPI import tinkoffApi
from .models import InstrumentModel


def checkInstrumentExists(ticker: str):
    return InstrumentModel.objects.filter(ticker=ticker)

checkInstrumentExists("APPL")

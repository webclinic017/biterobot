from .tinkoffAPI import tinkoffApi
from .models import InstrumentModel


def checkInstrumentExists(ticker: str):
    if len(InstrumentModel.objects.filter(ticker=ticker)) == 0:
        return False
    return True



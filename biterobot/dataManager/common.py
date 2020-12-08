from biterobot.dataManager.tinkoffAPI.tinkoffApi import *
from .models import InstrumentModel, DataIntervalModel, CandleModel


def checkInstrumentExists(ticker: str):
    if len(InstrumentModel.objects.filter(ticker=ticker)) == 0:
        return False
    return True

def addInstrument(ticker: str, token: str):
    tinkoffApi = TinkoffApi(token=token)  # ТОКЕН СЮДА
    instrumentInfo = tinkoffApi.getInfoByTicker(ticker=ticker)

    instrument = InstrumentModel(ticker=instrumentInfo.ticker, name=instrumentInfo.name, figi=instrumentInfo.figi, instrumentType=instrumentInfo.type.name, isin=instrumentInfo.isin,
                                    minPriceIncrement=instrumentInfo.minPriceIncrement, lot=instrumentInfo.lot, minQuantity=instrumentInfo.minQuantity, currency=instrumentInfo.currency.name)
    instrument.save()

def addDateInterval(instrumentId: int, dateBegin: datetime, dateEnd: datetime, candleLength: str):
    dateInterval = DataIntervalModel(instrument=instrumentId, dateBegin=dateBegin, dateEnd=dateEnd, candleLength=candleLength)
    dateInterval.save()

def addCandles(token: str, instrumentId: int, dateIntervalId: int, figi: str, dateFrom: datetime, dateTo: datetime, candleInterval: str):
    tinkoffApi = TinkoffApi(token=token)
    candles = tinkoffApi.getCandles(figi=figi, dateFrom=dateFrom, dateTo=dateTo, candleInterval=candleInterval)

    for c in candles:  # Возможно будут проблемы с полем time
        candle = CandleModel(instrument=instrumentId, dateInterval=dateIntervalId, candleLength=c.interval.name, o=c.o, c=c.c, h=c.h, l=c.l, v=c.v, candleTime=c.time)
        candle.save()

def dataHandler(token: str, ticker: str, dateBegin: datetime, dateEnd: datetime, candleLength: str):
    if not checkInstrumentExists(ticker=ticker):
        addInstrument(ticker=ticker, token=token)

    instrumentId = InstrumentModel.objects.get(ticker=ticker).id
    figi = InstrumentModel.objects.get(ticker=ticker).figi

    addDateInterval(instrumentId=instrumentId, dateBegin=dateBegin, dateEnd=dateEnd, candleLength=candleLength)

    dateIntervalId = DataIntervalModel.objects.get(instrument=instrumentId).id

    addCandles(token=token, instrumentId=instrumentId, dateIntervalId=dateIntervalId, figi=figi, dateFrom=dateBegin, dateTo=dateEnd, candleInterval=candleLength)

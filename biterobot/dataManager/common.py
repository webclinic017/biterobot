from .tinkoffAPI.tinkoffApi import *
from .models import InstrumentModel, DataIntervalModel, CandleModel


def checkInstrumentExists(ticker: str):
    if len(InstrumentModel.objects.filter(ticker=ticker)) == 0:
        return False
    return True

def addInstrument(ticker: str, token: str):
    tinkoffApi = TinkoffApi(token=token)  # ТОКЕН СЮДА
    instrumentInfo = asyncio.run(tinkoffApi.getInfoByTicker(ticker=ticker))

    # minQuantity = 1, тк тестовый запрос в Tinkoff дает None
    instrument = InstrumentModel(ticker=instrumentInfo.ticker, name=instrumentInfo.name, figi=instrumentInfo.figi, instrumentType=instrumentInfo.type.name, isin=instrumentInfo.isin,
                                    minPriceIncrement=instrumentInfo.minPriceIncrement, lot=instrumentInfo.lot, minQuantity=1, currency=instrumentInfo.currency.name)
    instrument.save()

def addDateInterval(ticker: str, instrument: int, dateBegin: datetime, dateEnd: datetime, candleLength: str):
    dateInterval = DataIntervalModel(ticker=ticker, instrument=instrument, dateBegin=dateBegin, dateEnd=dateEnd, candleLength=candleLength)
    dateInterval.save()

def addCandles(token: str, instrument: int, dataInterval: int, figi: str, dateFrom: datetime, dateTo: datetime, candleInterval: str):
    tinkoffApi = TinkoffApi(token=token)
    candles = asyncio.run(tinkoffApi.getCandles(figi=figi, dateFrom=dateFrom, dateTo=dateTo, candleInterval=candleInterval))

    for c in candles:  # Возможно будут проблемы с полем time
        candle = CandleModel(instrument=instrument, dataInterval=dataInterval, candleLength=c.interval.name, o=c.o, c=c.c, h=c.h, l=c.l, v=c.v, candleTime=c.time)
        candle.save()

def dataHandler(token: str, ticker: str, dateBegin: datetime, dateEnd: datetime, candleLength: str):
    if not checkInstrumentExists(ticker=ticker):
        addInstrument(ticker=ticker, token=token)

    instrument = InstrumentModel.objects.get(ticker=ticker)
    figi = InstrumentModel.objects.get(ticker=ticker).figi

    addDateInterval(ticker=ticker, instrument=instrument, dateBegin=dateBegin, dateEnd=dateEnd, candleLength=candleLength)

    dataInterval = DataIntervalModel.objects.get(ticker=ticker, dateBegin=dateBegin, dateEnd=dateEnd, candleLength=candleLength)

    addCandles(token=token, instrument=instrument, dataInterval=dataInterval, figi=figi, dateFrom=dateBegin, dateTo=dateEnd, candleInterval=candleLength)

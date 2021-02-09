from dataManager.models import InstrumentModel, DataIntervalModel, CandleModel
from dataManager.services.tinkoffAPI.tinkoffApi import *


def checkInstrumentExists(ticker: str) -> bool:
    '''
    Checking that Instrument exists in database
    :param ticker: Name of instrument's ticker
    :return: True(if the Instrument exists) or False(if the Instrument doesn't exists)
    '''
    if len(InstrumentModel.objects.filter(ticker=ticker)) == 0:
        return False
    return True

def addInstrument(ticker: str, token: str):
    '''
    Add Instrument in database
    :param ticker: Name of instrument's ticker
    :param token: Tinkoff_Invest token for Tinkoff OpenAPI
    :return: -
    '''
    tinkoffApi = TinkoffApi(token=token)
    instrumentInfo = asyncio.run(tinkoffApi.getInfoByTicker(ticker=ticker))

    # minQuantity = 1, because tinkoffAPI returns None on this parameter
    instrument = InstrumentModel(ticker=instrumentInfo.ticker, name=instrumentInfo.name, figi=instrumentInfo.figi, instrumentType=instrumentInfo.type.name, isin=instrumentInfo.isin,
                                    minPriceIncrement=instrumentInfo.minPriceIncrement, lot=instrumentInfo.lot, minQuantity=1, currency=instrumentInfo.currency.name)
    instrument.save()

def addDateInterval(ticker: str, instrument: int, dateBegin: datetime, dateEnd: datetime, candleLength: str):
    '''
    Add Date interval with Instrument and candle information where we have Instrument's data in database
    :param ticker: Name of instrument's ticker
    :param instrument: Instrument's id in database
    :param dateBegin: Date of beginning the Interval
    :param dateEnd: Date of ending the Interval
    :param candleLength: Length of candles on this Interval
    :return: -
    '''
    dateInterval = DataIntervalModel(ticker=ticker, instrument=instrument, dateBegin=dateBegin, dateEnd=dateEnd, candleLength=candleLength)
    dateInterval.save()

def addCandles(token: str, instrument: int, dataInterval: int, figi: str, dateFrom: datetime, dateTo: datetime, candleInterval: str):
    '''
    Add candles of the Instrument and Interval in database
    :param token: Tinkoff_Invest token for Tinkoff OpenAPI
    :param instrument: Instrument's id in database
    :param dataInterval: DataInterval's id in database
    :param figi: Special name of instrument
    :param dateFrom: Date of beginning the Interval
    :param dateTo: Date of ending the Interval
    :param candleInterval: Length of candle
    :return: -
    '''
    tinkoffApi = TinkoffApi(token=token)
    candles = asyncio.run(tinkoffApi.getCandles(figi=figi, dateFrom=dateFrom, dateTo=dateTo, candleInterval=candleInterval))

    for c in candles:
        candle = CandleModel(instrument=instrument, dataInterval=dataInterval, candleLength=c.interval.name, o=c.o, c=c.c, h=c.h, l=c.l, v=c.v, candleTime=c.time)
        candle.save()

def dataHandler(token: str, ticker: str, dateBegin: datetime, dateEnd: datetime, candleLength: str):
    '''
    Handle requests on add Candles in database
    :param token: Tinkoff_Invest token for Tinkoff OpenAPI
    :param ticker: Name of instrument's ticker
    :param dateBegin: Date of beginning the Interval
    :param dateEnd: Date of ending the Interval
    :param candleLength: Length of candle
    :return: -
    '''
    if not checkInstrumentExists(ticker=ticker):
        addInstrument(ticker=ticker, token=token)

    instrument = InstrumentModel.objects.get(ticker=ticker)
    figi = InstrumentModel.objects.get(ticker=ticker).figi

    addDateInterval(ticker=ticker, instrument=instrument, dateBegin=dateBegin, dateEnd=dateEnd, candleLength=candleLength)

    dataInterval = DataIntervalModel.objects.get(ticker=ticker, dateBegin=dateBegin, dateEnd=dateEnd, candleLength=candleLength)

    addCandles(token=token, instrument=instrument, dataInterval=dataInterval, figi=figi, dateFrom=dateBegin, dateTo=dateEnd, candleInterval=candleLength)

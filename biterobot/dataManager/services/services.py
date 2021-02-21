import datetime

from dataManager.models import InstrumentModel, DataIntervalModel, CandleModel
from dataManager.services.tinkoffAPI.tinkoffApi import *
from dataManager.services import dbServices


def checkInstrumentExists(ticker: str) -> (InstrumentModel, 0):
    '''
    Checking that Instrument exists in database
    :param ticker: Name of instrument's ticker
    :return: Instrument instance or False(if the Instrument doesn't exists)
    '''
    try:
        instrument = dbServices.getInstrumentInfo(ticker=ticker)
    except:
        return 0
    return instrument

def addInstrument(ticker: str, token: str):
    '''
    Add Instrument in database
    :param ticker: Name of instrument's ticker
    :param token: Tinkoff_Invest token for Tinkoff OpenAPI
    :return: -
    '''
    tinkoffApi = TinkoffApi(token=token)
    instrumentInfo = asyncio.run(tinkoffApi.getInfoByTicker(ticker=ticker))

    dbServices.saveInstrumentInfo(instrumentInfo=instrumentInfo)

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

    dbServices.saveCandlesInfo(candles=candles, instrument=instrument, dataInterval=dataInterval)

def instrumentHandler(token: str, ticker: str, dateBegin: datetime, dateEnd: datetime, candleLength: str):
    '''
    Handle requests on add Candles in database
    :param token: Tinkoff_Invest token for Tinkoff OpenAPI
    :param ticker: Name of instrument's ticker
    :param dateBegin: Date of beginning the Interval
    :param dateEnd: Date of ending the Interval
    :param candleLength: Length of candle
    :return: -
    '''
    instrument = checkInstrumentExists(ticker=ticker)
    if instrument == 0:
        addInstrument(ticker=ticker, token=token)
        instrument = dbServices.getInstrumentInfo(ticker=ticker)
    figi = instrument.figi

    dbServices.saveDateIntervalInfo(ticker=ticker, instrument=instrument, dateBegin=dateBegin, dateEnd=dateEnd, candleLength=candleLength)

    dataInterval = dbServices.getDataIntervalInfo(ticker=ticker, dateBegin=dateBegin, dateEnd=dateEnd, candleLength=candleLength)

    addCandles(token=token, instrument=instrument, dataInterval=dataInterval, figi=figi, dateFrom=dateBegin, dateTo=dateEnd, candleInterval=candleLength)

import datetime
from rest_framework.generics import get_object_or_404

from dataManager.models import DataIntervalModel, InstrumentModel, CandleModel


def deleteDataIntervalInfo(id: int):
    '''
    Delete DataInterval info from db
    :param id: DataInterval id in db
    :return: -
    '''
    dataInterval = get_object_or_404(DataIntervalModel.objects.all(), id=id)
    dataInterval.delete()

def getInstrumentInfo(ticker: str) -> InstrumentModel:
    '''
    Get Instrument info from db
    :param ticker: Name of instrument's ticker
    :return: Instrument instance
    '''
    return InstrumentModel.objects.get(ticker=ticker)

def getDataIntervalInfo(ticker: str, dateBegin: datetime, dateEnd: datetime, candleLength: str) -> DataIntervalModel:
    '''
    Get Data interval info from db
    :param ticker: Name of instrument's ticker
    :param dateBegin: Date of beginning the Interval
    :param dateEnd: Date of ending the Interval
    :param candleLength: Length of candle
    :return: Data interval instance
    '''
    return DataIntervalModel.objects.get(ticker=ticker, dateBegin=dateBegin, dateEnd=dateEnd, candleLength=candleLength)

def saveInstrumentInfo(instrumentInfo):
    '''
    Save Instrument info in db
    :param instrumentInfo: Tinkoff object with instrument info params
    :return: -
    '''
    # minQuantity = 1, because tinkoffAPI returns None on this parameter
    instrument = InstrumentModel(ticker=instrumentInfo.ticker, name=instrumentInfo.name, figi=instrumentInfo.figi,
                                 instrumentType=instrumentInfo.type.name, isin=instrumentInfo.isin,
                                 minPriceIncrement=instrumentInfo.minPriceIncrement, lot=instrumentInfo.lot,
                                 minQuantity=1, currency=instrumentInfo.currency.name)
    instrument.save()

def saveDateIntervalInfo(ticker: str, instrument: int, dateBegin: datetime, dateEnd: datetime, candleLength: str):
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

def saveCandlesInfo(candles: list, instrument: int, dataInterval: int):
    '''
    Add Candles in db
    :param candles: List of candles
    :param instrument: Instrument's id in database
    :param dataInterval: DataInterval's id in database
    :return: -
    '''
    for c in candles:
        candle = CandleModel(instrument=instrument, dataInterval=dataInterval, candleLength=c.interval.name, o=c.o, c=c.c, h=c.h, l=c.l, v=c.v, candleTime=c.time)
        candle.save()

import asyncio
from datetime import datetime
from datetime import timedelta
import pytz
from tinkoff.investments import (
    TinkoffInvestmentsRESTClient, Environment, CandleResolution
)
from tinkoff.investments.client.exceptions import TinkoffInvestmentsError
from tinkoff.investments.utils.historical_data import HistoricalData

candleIntervalChoices = {
    "MONTH": CandleResolution.MONTH,
    "WEEK": CandleResolution.WEEK,
    "DAY": CandleResolution.DAY,
    "HOUR": CandleResolution.HOUR,
    "MIN_30": CandleResolution.MIN_30,
    "MIN_15": CandleResolution.MIN_15,
    "MIN_10": CandleResolution.MIN_10,
    "MIN_5": CandleResolution.MIN_5,
    "MIN_3": CandleResolution.MIN_3,
    "MIN_2": CandleResolution.MIN_2,
    "MIN_1": CandleResolution.MIN_1
}


class TinkoffApi(object):
    '''
    Class for Tinkoff trades (getting candles and what not)
    '''

    def __init__(self, token):
        '''
        Initialization of the class
        :param token: the Sandbox token of Tinkoff. e.g. String: "asd"
        '''
        if token:
            self.token = token
        else:
            raise ValueError("Enter token please!")


    async def getCandlesNew(self, figi, dateFrom, dateTo, candleInterval):
        '''
        Function for g etting full information about candles for date between "dateFrom" and "dateTo"
        Runs faster than getCandlesHistorical but has restrictions with candleInterval:
            MONTH - < 10 years; WEEK - < 2 years; DAY - < 1 year; HOUR - < 8 days; MIN_* - < 1 day
        :param figi: String (e.g. "BBG000B9XRY4"). figi that you want candles for.
        :param dateFrom: from which date you want the candles to begin. Dict in this format: {"year": 2019, "month": 1, "day": 1}
        :param dateTo: to which date you want the candles to go. Dict in this format: {"year": 2019, "month": 2, "day": 1}
        If "dateTo" is less than "dateFrom" - raise error
        :param candleInterval: what interval is set for candles themselves. Choices we have:
            MONTH, WEEK, DAY, HOUR,  MIN_30, MIN_15, MIN_10, MIN_5, MIN_3, MIN_2, MIN_1
        If candleInterval is not in the choices - raise error
        :return: Array of candles (figi(string), candleInterval, o, c, h, l, v, time)
        Usage example: candles = asyncio.run(tinkoffApi.getCandlesFull("BBG000B9XRY4", dateFrom, dateTo, "MONTH")); candles[0].figi
        '''
        # Reformat into datetime
        # dateFrom = datetime(dateFrom['year'], dateFrom['month'], dateFrom['day'])
        # dateTo = datetime(dateTo['year'], dateTo['month'], dateTo['day'])
        # Exception if dateTo is earlier than dateFrom
        if dateTo < dateFrom:
            raise ValueError("dateTo must be after dateFrom")
        else:
            try:
                candleInterval = candleIntervalChoices[candleInterval]
                async with TinkoffInvestmentsRESTClient(
                        token=self.token,
                        environment=Environment.SANDBOX) as client:

                    candles = await client.market.candles.get(
                        figi=figi,
                        dt_from=dateFrom,
                        dt_to=dateTo,
                        interval=candleInterval
                    )
                    await client.close()
                    return candles
            except TinkoffInvestmentsError as e:
                raise TinkoffInvestmentsError(e)
            except KeyError:
                raise ValueError("candleInterval not in dict (wrong choice)")
            except Exception as e:
                raise ValueError(e)

    async def getCandles(self, figi, dateFrom, dateTo, candleInterval):
        '''
        Function for getting full information about candles for date between "dateFrom" and "dateTo"
        Works a bit slower than getCandlesNew, but has no restrictions
        :param figi: figi that you want candles from. String: "BBG000B9XRY4"
        :param dateFrom: from which date you want the candles to begin. Dict in this format: { "year" : 2019, "month" : 1, "day": 1}
        :param dateTo: to which date you want the candles to go. Dict in this format: { "year" : 2019, "month" : 2, "day": 1}
        if "dateTo" is less than "dateFrom" - error
        :param candleInterval: what interval is set for candles themselves. Choices we have:
            MONTH, WEEK, DAY, HOUR,  MIN_30, MIN_15, MIN_10, MIN_5, MIN_3, MIN_2, MIN_1
        If candleInterval is not in the choices - raise error
        :return: array of (figi(string), candleInterval, o, c, h, l, v, time).
        Usage example: candles = asyncio.run(tinkoffApi.getCandlesFull("BBG000B9XRY4", dateFrom, dateTo, "MONTH")); candles[0].figi
        '''
        # Reformat into datetime
        utc = pytz.UTC
        dateFrom = datetime.strptime(str(dateFrom), '%Y-%m-%d')
        dateTo = datetime.strptime(str(dateTo), '%Y-%m-%d')
        dateTo_loc = utc.localize(dateTo)
        print(dateTo_loc)

        # If criteria is met, we call the f aster function
        if ((candleInterval == "MONTH") and ((dateTo - dateFrom) < (timedelta(days=3650)))) or (
                (candleInterval == "WEEK") and ((dateTo - dateFrom) < (timedelta(days=730)))) or (
                (candleInterval == "DAY") and ((dateTo - dateFrom) < (timedelta(days=365)))) or (
                (candleInterval == "HOUR") and ((dateTo - dateFrom) <= (timedelta(days=7)))) or (
                ("MIN" in candleInterval) and ((dateTo - dateFrom) <= (timedelta(days=1)))):
            return await self.getCandlesNew(figi, dateFrom, dateTo, candleInterval)

        # Exception if dateTo is earlier than dateFrom
        if dateTo < dateFrom:
            raise ValueError("dateTo must be after dateFrom")
        else:
            try:
                candleInterval = candleIntervalChoices[candleInterval]
                client = TinkoffInvestmentsRESTClient(
                    token=self.token,
                    environment=Environment.SANDBOX)
                historical_data = HistoricalData(client)
                candles = []
                async for candle in historical_data.iter_candles(
                        figi=figi,
                        dt_from=dateFrom,
                        dt_to=dateTo,
                        interval=candleInterval,
                ):
                    # if candles time is lower than dateTo, then add it to array
                    if candle.time < dateTo_loc:
                        candles.append(candle)
                    # if candle time is higher, then close the session and return candles
                    else:
                        await client.close()
                        return candles

            # Exception for wrong candleInterval input
            except TinkoffInvestmentsError as e:
                raise TinkoffInvestmentsError(e)
            except KeyError:
                raise ValueError("candleInterval not in dict (wrong choice)")
            except Exception as e:
                raise ValueError(e)

    async def getInfoByTicker(self, ticker):
        '''
        :param instrument: String. Ticker of the instrument
        :return: info about the instrument with the provided ticker
            (figi, ticker, lot, name, type, currency, isin, minPriceIncrement, minQuantity)
        '''
        try:
            async with TinkoffInvestmentsRESTClient(
                    token=self.token,
                    environment=Environment.SANDBOX) as client:

                instruments = await client.market.instruments.search(ticker)
                instrument = instruments[0]
                return instrument
        except TinkoffInvestmentsError as e:
            raise ValueError(e)
        except IndexError:
            raise ValueError("Most probably wrong ticker")
        except Exception as e:
            raise ValueError("Something bad happened in getInfoByTicker" + e.__str__())


if __name__ == '__main__':
    # EXAMPLE OF USE
    # Rules:
    # 1. Always use try/except
    # 2. Insert token before use
    # 3. Use asyncio.run to run the class methods
    dateFrom = "2020-7-11"  # init of dates
    dateTo = "2020-7-15"
    tinkoffApi = TinkoffApi('')  # Class creation ВСТАВИТЬ КЛЮЧ
    try:
        candles = asyncio.run(tinkoffApi.getCandles("BBG000B9XRY4", dateFrom, dateTo, "MIN_1"))
        for candle in candles:
            print(candle)
        info = asyncio.run(tinkoffApi.getInfoByTicker("AAPL"))
        print(info)
    except Exception as e:
        print(e)

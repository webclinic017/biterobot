from database import Database
from exchange import Exchange
from type import TimeRange, CandleQuantity
from datetime import datetime


class Importer:
    LIMIT = 500

    def __init__(self, db: Database, exch: Exchange):
        self.database = db
        self.exchange = exch

    def importPair(self, ticker: str):
        tickerInfo = self.exchange.getMarket(ticker)
        # проверяем валюты на существование и создаем, если нужно
        if self.database.checkCurrency(tickerInfo['base']) is False:
            self.database.newCurrency(tickerInfo['base'])
        if self.database.checkCurrency(tickerInfo['quote']) is False:
            self.database.newCurrency(tickerInfo['quote'])
        # создаем пару
        self.database.newPair(self.exchange.exchangeName,
                              ticker,
                              tickerInfo['base'],
                              tickerInfo['quote'])

    def importQuantity(self, quantity: str):
        quantityTimedelta = CandleQuantity.parseQuantity(quantity)
        self.database.newQuantity(quantity, quantityTimedelta)

    def importTicks(self, ticker: str, timerange: TimeRange):
        # TODO: По какой-то причине при импорте в базу пытаются попатсть одинаковые записи
        self.__checkDB(ticker)
        timestamp = timerange.beginTime
        while timestamp < timerange.endTime:
            ticksList = self.exchange.getTicks(ticker, timestamp, self.LIMIT)
            timestamp = ticksList[-1].timestamp
            try:
                self.database.insertTicks(ticksList,
                                          self.exchange.exchangeName,
                                          ticker)
            except ValueError as e:
                print(e)

    def importCandles(self, ticker: str, timerange: TimeRange, quantity: str):
        self.__checkDB(ticker, quantity)
        timestamp = timerange.beginTime
        while timestamp < timerange.endTime:
            candlesList = self.exchange.getCandles(ticker, timestamp, quantity, self.LIMIT)
            timestamp = candlesList[-1].beginTimestamp + candlesList[-1].quantity
            try:
                self.database.insertCandles(candlesList, quantity,
                                            self.exchange.exchangeName,
                                            ticker)
            except ValueError as e:
                print(e)

    def __checkDB(self, ticker: str, quantity: str = None):
        if self.database.checkPair(self.exchange.exchangeName, ticker) is False:
            raise ValueError("Wrong exchange or ticker")
        if (quantity is not None) and (self.database.checkQuantity(quantity) is False):
            raise ValueError("Wrong quantity")


if __name__ == '__main__':
    importer = Importer(Database("sqlite", "", '../resources/db/sqlite3/bitbot_sqlalchemytest2.db'),
                        Exchange('bitmex'))
    importer.importPair('BTC/USD')
    importer.importQuantity('1d')
    try:
        importer.importTicks('BTC/USD', TimeRange(datetime(2016, 1, 1, 0, 0, 0, 0), datetime(2016, 1, 1, 2, 0, 0, 0)))
        importer.importCandles('BTC/USD', TimeRange(datetime(2016, 1, 1, 0, 0, 0, 0), datetime(2016, 2, 1, 0, 0, 0, 0)),
                               '1d')
    except ValueError as e:
        print(e)

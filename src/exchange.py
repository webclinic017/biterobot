from ccxt import bitmex
from database import Database
from datetime import datetime
from type import TimeRange, TickType, CandleType
from typing import List
from time import sleep


class Exchange:
    """Класс для подключения к биржам"""

    def __init__(self, exchange: str):
        """Конструктор. Создаем экземпляр класса для подключения, используя библиотеку ccxt"""
        if exchange is None:
            raise ValueError("You should provide exchange name to connect")

        self.exchangeName = exchange.lower()
        if self.exchangeName == 'bitmex':
            self.exchange = bitmex()
        else:
            raise NotImplementedError()

    def getTicks(self, ticker: str, timestamp: datetime, limit: int = None) -> List[TickType]:
        result = self.exchange.fetch_trades(ticker, int(timestamp.timestamp()*1000), limit)
        returnList = []
        tradeDirection = 0
        for i in result:
            if i['side'] == 'buy':
                tradeDirection = 1
            elif i['side'] == 'sell':
                tradeDirection = 2
            returnList.append(TickType(datetime.utcfromtimestamp(i['timestamp'] / 1000),
                                       # datetime.strptime(i['timestamp'], '%Y-%m-%dT%H:%M:%S.%fZ')
                                       # TODO: мб так будет быстрее?
                                       tradeDirection,
                                       i['price'],
                                       i['amount']))
        return returnList

    def getCandles(self, ticker: str, timestamp: datetime, quantity: str, limit: int) -> List[CandleType]:
        raise NotImplementedError()
        result = self.exchange.fetch_ohlcv(ticker, quantity, int(timestamp.timestamp() * 1000), limit)
        returnList = []
        tradeDirection = 0
        for i in result:
            returnList.append(CandleType(datetime.utcfromtimestamp(i['timestamp'] / 1000),
                                       # datetime.strptime(i['timestamp'], '%Y-%m-%dT%H:%M:%S.%fZ')
                                       tradeDirection,
                                       i['price'],
                                       i['amount']))
        return returnList


# if __name__ == "__main__":
#     bitmex = ccxt.bitmex()
#     print(bitmex.fetch_ohlcv('BTC/USD', '1m', 1514764800000))
if __name__ == "__main__":
    # db = Database('mssql', "UZER\SQLEXPRESS", "BitBot", "user", "password")
    bitmexExch = bitmex()
    res = bitmexExch.fetch_trades('BTC/USD', int(datetime(2020, 3, 22, 0, 0, 0, 0).timestamp() * 1000), 1000)
    sleep(5)
    exch = Exchange('bitmex')
    res2 = exch.getTicks('BTC/USD', datetime(2020, 3, 22, 0, 0, 0, 0), 1000)
    print('Done!')

    # db.insertTicks()
    # db.insertCandles()

from ccxt import bitmex
from datetime import datetime, timedelta
from type import TickType, CandleType, CandleQuantity
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
        self.rateLimit = self.exchange.rateLimit * 2  # для незарегистрированных пользователей интервал в 2 раза больше
        self.timeOfLastRequest = datetime.now()

    def getMarket(self, ticker: str) -> dict:
        self.__waitBeforeRequest()
        result = self.exchange.fetch_markets()
        for i in result:
            if i['symbol'] == ticker:
                return i
        raise ValueError("No such ticker")

    def getTicks(self, ticker: str, timestamp: datetime, limit: int = None) -> List[TickType]:
        self.__waitBeforeRequest()
        result = self.exchange.fetch_trades(ticker, int(timestamp.timestamp() * 1000), limit)
        # TODO: По какой-то причине попадаются одинаковые записи в ответе.
        #  Надо чекать записи и выкидывать повторяющиеся
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
                                       i['info']['foreignNotional']))  # потому что внутри ccxt баг - она возвращает
            # количество контрактов, а не количество долларов
        return returnList

    def getCandles(self, ticker: str, timestamp: datetime, quantity: str, limit: int) -> List[CandleType]:
        self.__waitBeforeRequest()
        result = self.exchange.fetch_ohlcv(ticker, quantity, int(timestamp.timestamp() * 1000), limit)
        # TODO: По какой-то причине попадаются одинаковые записи.
        #  Надо чекать записи и выкидывать повторяющиеся
        returnList = []
        quantityTimedelta = CandleQuantity.parseQuantity(quantity)
        for i in result:
            returnList.append(CandleType(quantityTimedelta, datetime.utcfromtimestamp(i[0] / 1000),
                                         # datetime.strptime(i['timestamp'], '%Y-%m-%dT%H:%M:%S.%fZ'),
                                         i[5],
                                         i[1],
                                         i[2],
                                         i[3],
                                         i[4]))
        return returnList

    def __waitBeforeRequest(self):
        if self.timeOfLastRequest + timedelta(milliseconds=self.rateLimit) > datetime.now():
            sleep(int(self.rateLimit / 1000))
        self.timeOfLastRequest = datetime.now()


# if __name__ == "__main__":
#     bitmex = ccxt.bitmex()
#     print(bitmex.fetch_ohlcv('BTC/USD', '1m', 1514764800000))
if __name__ == "__main__":
    # db = Database('mssql', "UZER\SQLEXPRESS", "BitBot", "user", "password")
    bitmexExch = bitmex()
    exch = Exchange('bitmex')
    res = exch.getMarket('BTC/USD')
    quote = res['quote']
    print('Done!')

    # db.insertTicks()
    # db.insertCandles()

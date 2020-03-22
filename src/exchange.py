from ccxt import bitmex
from database import Database
from datetime import datetime
from type import TimeRange


class Exchange:
    """Класс для подключения к биржам"""

    def __init__(self, exchange: str):
        """Конструктор. Создаем экземпляр класса для подключения, используя библиотеку ccxt"""
        if exchange is None:
            raise ValueError("You should provide exchange name to connect")

        self.exchange = exchange.lower()
        if self.exchange == 'bitmex':
            self.api = bitmex()
        else:
            raise NotImplementedError()

    def getTicks(self, timerange: TimeRange):
        pass

    def getCandles(self, timerange: TimeRange, quantity: str):
        pass


# if __name__ == "__main__":
#     bitmex = ccxt.bitmex()
#     print(bitmex.fetch_ohlcv('BTC/USD', '1m', 1514764800000))
if __name__ == "__main__":
    db = Database('mssql', "UZER\SQLEXPRESS", "BitBot", "user", "password")
    bitmex = bitmex()
    print(bitmex.fetch_ohlcv('BTC/USD', '1m', int(datetime(2020, 3, 22, 0, 0, 0, 0).timestamp() * 1000)))
    # db.insertTicks()
    # db.insertCandles()

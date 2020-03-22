from datetime import datetime
from type import TimeRange, TickType, CandleType
from typing import List, Tuple
from sqlalchemy import create_engine, Table, Column, MetaData, ForeignKey, UniqueConstraint,\
    Integer, Float, String,  DateTime, Interval
# from sqlalchemy.orm import mapper, sessionmaker


metadata = MetaData()
currency_table = \
    Table("Currency", metadata,
          Column("Id", Integer, primary_key=True, autoincrement=True),
          Column("Ticker", String(10), nullable=False),
          UniqueConstraint("Ticker"))
exchange_table = \
    Table("Exchange", metadata,
          Column("Id", Integer, primary_key=True, autoincrement=True),
          Column("Name", String(20), nullable=False),
          UniqueConstraint("Name"))
pair_table = \
    Table("Pair", metadata,
          Column("Id", Integer, primary_key=True, autoincrement=True),
          Column("Ticker", String(20), nullable=False),
          Column("BaseCurrency", Integer, ForeignKey("Currency.Id"), nullable=False),
          Column("QuoteCurrency", Integer, ForeignKey("Currency.Id"), nullable=False),
          Column("Exchange", Integer, ForeignKey("Exchange.Id"), nullable=False),
          UniqueConstraint("Exchange", "Ticker", name="UniqueTickerOnExchange"),
          UniqueConstraint("Exchange", "BaseCurrency", "QuoteCurrency", name="UniqueCurrencyPairOnExchange"))
trade_direction_table = \
    Table("TradeDirection", metadata,
          Column("Id", Integer, primary_key=True, autoincrement=True),
          Column("Direction", String(4), nullable=False),
          UniqueConstraint("Direction"))
tick_table = \
    Table("Tick", metadata,
          Column("Id", Integer, primary_key=True, autoincrement=True),
          Column("Pair", Integer, ForeignKey("Pair.Id"), nullable=False),
          Column("Timestamp", DateTime, nullable=False),
          Column("TradeDirection", Integer, ForeignKey("TradeDirection.Id"), nullable=False),
          Column("Price", Float, nullable=False),
          Column("Volume", Float, nullable=False),
          UniqueConstraint("Pair", "Timestamp", "TradeDirection", "Price", "Volume"))
candles_quantity_table = \
    Table("CandlesQuantity", metadata,
          Column("Id", Integer, primary_key=True, autoincrement=True),
          Column("Quantity", Interval, nullable=False),
          Column("Name", String(5)),
          UniqueConstraint("Quantity", name="UniqueQuantity"),
          UniqueConstraint("Name", name="UniqueName"))
candles_table = \
    Table("Candles", metadata,
          Column("Id", Integer, primary_key=True, autoincrement=True),
          Column("Pair", Integer, ForeignKey("Pair.Id"), nullable=False),
          Column("Quantity", Integer, ForeignKey("CandlesQuantity.Id"), nullable=False),
          Column("BeginTimestamp", DateTime, nullable=False),
          Column("Volume", Float, nullable=False),
          Column("Open", Float, nullable=False),
          Column("High", Float, nullable=False),
          Column("Low", Float, nullable=False),
          Column("Close", Float, nullable=False),
          UniqueConstraint("Pair", "Quantity", "BeginTimestamp", "Volume", "Open", "High", "Low", "Close"))

# type.py:
# TickType:
#     timestamp: datetime
#     tradeDirection: int
#     price: float
#     volume: float

# mapper(TickType, tick_table, properties={
#     'timestamp': tick_table.c.Timestamp,
#     'tradeDirection': tick_table.c.TradeDirection,
#     'price': tick_table.c.Price,
#     'volume': tick_table.c.Volume,
# })

# type.py:
# CandleType:
#     quantity: timedelta  # при таком определении можно будет проводить алгебр. операции
#     beginTimestamp: datetime
#     volume: float
#     open: float
#     high: float
#     low: float
#     close: float

# mapper(CandleType, candles_table, properties={
#     'quantity': candles_table.c.Quantity,
#     'beginTimestamp': candles_table.c.BeginTimestamp,
#     'volume': candles_table.c.Volume,
#     'open': candles_table.c.Open,
#     'high': candles_table.c.High,
#     'low': candles_table.c.Low,
#     'close': candles_table.c.Close,
# })


class Database:
    """Класс для работы с базой данных

    В классе реализованы методы для получения данных и записи в бд. Класс не предоставляет методов для исполнения любых
    запросов, а лишь явялется оболочкой для заранее заготовленных SQL запросов
    """

    def __init__(self, dbms: str, server: str, database: str, username: str = "", password: str = ""):
        """Конструктор класса бд

        Args:
            dbms: database management system - тип субд, к которой подключаемся
            server: адрес сервера или файла, где находится бд
            database: имя базы данных для подключения
            username: имя пользователя
            password: пароль TODO: Хорошая ли это идея хранить пароль в классе? Нужно ли его хранить вообще?
        """
        self.dbms: str = dbms.lower()
        self.server: str = server
        self.database: str = database
        self.username: str = username
        self.password: str = password
        if self.dbms == "sqlite":
            self.engine = create_engine('sqlite:///' + database)
        elif self.dbms == "mssql":
            self.engine = create_engine('mssql+pyodbc://' + username + ':' + password + '@' + server + '/' + database)
        else:
            raise NotImplementedError("This DBMS doesn't support")
        self.connection = self.engine.connect()

    def createDatabase(self):
        """Создаем базу данных"""
        metadata.create_all(bind=self.engine)

    def insertTicks(self, ticks: List[TickType], exchange: str, ticker: str):
        """Записываем тики в бд"""
        pairId = self.__findPairId(exchange, ticker)
        insert = tick_table.insert()
        for tick in ticks:
            self.connection.execute(insert, Pair=pairId,
                                    Timestamp=tick.timestamp,
                                    TradeDirection=tick.tradeDirection,
                                    Price=tick.price,
                                    Volume=tick.volume)

    def insertCandles(self, candles: List[CandleType], quantity: str, exchange: str, ticker: str):
        """Записываем свечи в бд"""
        pairId = self.__findPairId(exchange, ticker)
        quantityId = self.__find(candles_quantity_table, quantity)
        insert = candles_table.insert()
        for candle in candles:
            self.connection.execute(insert, Pair=pairId,
                                    Quantity=quantityId,
                                    BeginTimestamp=candle.beginTimestamp,
                                    Volume=candle.volume,
                                    Open=candle.open,
                                    High=candle.high,
                                    Low=candle.low,
                                    Close=candle.close)

    def getTicks(self, exchange: str, ticker: str, timeRange: TimeRange) -> List[TickType]:
        """Получаем очередь сделок из бд"""
        # находим пару
        pairId = self.__findPairId(exchange, ticker)
        # запрашиваем данные
        # по сделкам
        select = tick_table.select().where((tick_table.c.Pair == pairId) &
                                           (tick_table.c.Timestamp >= timeRange.beginTime) &
                                           (tick_table.c.Timestamp < timeRange.endTime))
        result = self.connection.execute(select)
        queue = list()
        for row in result:
            queue.append(TickType(timestamp=row['Timestamp'],
                                  tradeDirection=row['TradeDirection'],
                                  price=row['Price'],
                                  volume=row['Volume']))
        return queue

    def getCandles(self, exchange: str, ticker: str, timeRange: TimeRange, quantity: str) -> List[CandleType]:
        """Получаем очередь свечей из бд
        :param exchange:
        :param ticker:
        :param timeRange:
        :param quantity:
        :return:
        """
        pairId = self.__findPairId(exchange, ticker)
        foundQuantity = self.__find(candles_quantity_table, quantity)
        quantityId = foundQuantity['Id']
        # запрашиваем свечи
        select = candles_table.select().where((candles_table.c.Pair == pairId) &
                                              (candles_table.c.Quantity == quantityId) &
                                              (candles_table.c.BeginTimestamp >= timeRange.beginTime) &
                                              (candles_table.c.BeginTimestamp < timeRange.endTime))
        result = self.connection.execute(select)
        queue = list()
        for row in result:
            queue.append(CandleType(quantity=foundQuantity['Quantity'],
                                    beginTimestamp=row['BeginTimestamp'],
                                    volume=row['Volume'],
                                    open=row['Open'],
                                    high=row['High'],
                                    low=row['Low'],
                                    close=row['Close'],
                                    ))
        return queue

    def __find(self, table: Table, name: str):
        """Находит одну запись по Name через Select
        :param table:
        :param name:
        :return:
        """
        if name is None:
            raise ValueError("You should provide name")
        select = table.select().where(table.c.Name == name.lower())
        foundName = self.connection.execute(select).fetchone()
        if foundName is None:
            raise ValueError("Wrong name. Does it exist in your database?")
        return foundName

    def __findPairId(self, exchange: str, ticker: str) -> int:
        """Находим Id торговой пары
        :rtype: int
        :param exchange:
        :param ticker:
        :return:
        """
        if exchange is None or ticker is None:
            raise ValueError("You should provide exchange and ticker")

        # ищем запрашиваемую биржу
        selectExchange = exchange_table.select().where(exchange_table.c.Name == exchange.lower())
        foundExchange = self.connection.execute(selectExchange).fetchone()
        if foundExchange is None:
            raise ValueError("Wrong exchange. Does it exists in your database?")
        exchangeId = foundExchange['Id']

        # ищем запрашиваемую торговую пару, которая привязана к этой бирже
        selectPair = pair_table.select().where((pair_table.c.Exchange == exchangeId) &
                                               (pair_table.c.Ticker == ticker.lower()))
        foundPair = self.connection.execute(selectPair).fetchone()
        if foundPair is None:
            raise ValueError("Wrong ticker. Does the exchange have this ticker (pair) in your database?")
        return foundPair['Id']


if __name__ == "__main__":
    # database = Database("sqlite3", "../resources/db/sqlite3/bitbot.db", "", "")
    # database = Database("mssql", "localhost", "BitBot", "user", "password")
    # Название сервера поменять на свой (1-й параметр)

    # tr = TimeRange(datetime(2016, 5, 5, 7, 0, 0), datetime(2016, 5, 5, 7, 30, 0))
    # response = database.getQueue(tr, "BTCUSD")
    # print(response)

    db = Database("sqlite", "", '../resources/db/sqlite3/bitbot_sqlalchemytest2.db')
    result = db.getTicks('bitmex','btcusd',TimeRange(datetime(2016, 1, 1, 0, 0, 0, 0), datetime(2017, 1, 1, 0, 0, 0, 0)),)
    print(result)

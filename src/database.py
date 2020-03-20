import pyodbc
import sqlite3
from datetime import datetime
from type import TimeRange, TickType, CandleType
from typing import List, Tuple
from sqlalchemy import create_engine, Table, Column, MetaData, ForeignKey, \
    Integer, Float, String,  DateTime, Interval
from sqlalchemy.orm import mapper


metadata = MetaData()
currency_table = \
    Table("Currency", metadata,
          Column("Id", Integer, primary_key=True, autoincrement=True),
          Column("Ticker", String(10), nullable=False))
pair_table = \
    Table("Pair", metadata,
          Column("Id", Integer, primary_key=True, autoincrement=True),
          Column("Ticker", String(20), nullable=False),
          Column("BaseCurrency", Integer, ForeignKey("Currency.Id"), nullable=False),
          Column("QuoteCurrency", Integer, ForeignKey("Currency.Id"), nullable=False))
trade_direction_table = \
    Table("TradeDirection", metadata,
          Column("Id", Integer, primary_key=True, autoincrement=True),
          Column("Direction", String(4), nullable=False))
trade_table = \
    Table("Trade", metadata,
          Column("Id", Integer, primary_key=True, autoincrement=True),
          Column("Pair", Integer, ForeignKey("Pair.Id"), nullable=False),
          Column("Timestamp", DateTime, nullable=False),
          Column("TradeDirection", Integer, ForeignKey("TradeDirection.Id"), nullable=False),
          Column("Price", Float, nullable=False),
          Column("Volume", Float, nullable=False))
candles_quantity = \
    Table("CandlesQuantity", metadata,
          Column("Id", Integer, primary_key=True, autoincrement=True),
          Column("Quantity", Interval, nullable=False),
          Column("Name", String(5))
          )
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
          Column("Close", Float, nullable=False),)

# type.py:
# class TickType:
#     price: float
#     volume: float
#     timestamp: datetime

mapper(TickType, trade_table, properties={
    'price': trade_table.c.Price,
    'volume': trade_table.c.Volume,
    'timestamp': trade_table.c.Timestamp
})

# type.py:
# class CandleType:
#     quantity: timedelta
#     beginTimestamp: datetime
#     volume: float
#     open: float
#     close: float
#     high: float
#     low: float

mapper(CandleType, candles_table, properties={
    'quantity': candles_table.c.Quantity,
    'beginTimestamp': candles_table.c.BeginTimestamp,
    'volume': candles_table.c.Volume,
    'open': candles_table.c.Open,
    'close': candles_table.c.Close,
    'high': candles_table.c.High,
    'low': candles_table.c.Low,
})


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
        if self.dbms == "sqlite3":
            # подключаемся к sqlite3
            self.connection = sqlite3.connect(self.server)
            self.cursor = self.connection.cursor()
            self.engine = create_engine('sqlite:///' + database)
        elif self.dbms == "mssql":
            # подключаемся к MS SQL
            self.connection = pyodbc.connect(
                'DRIVER={ODBC Driver 17 for SQL Server};SERVER=' + server + ';DATABASE=' + database +
                ';UID=' + username + ';PWD=' + password)
            self.cursor = self.connection.cursor()
            self.engine = create_engine('mssql+pyodbc://' + username + ':' + password + '@' + server + '/' + database)
        else:
            raise NotImplementedError("This DBMS doesn't support")

    def createDatabase(self):
        """Создаем базу данных"""
        metadata.create_all(bind=self.engine)

    def getQueue(self, timeRange: TimeRange, ticker: str) -> List[Tuple]:
        """Получаем очередь данных из бд

        Args:
            timeRange: временной промежуток, из которого будут возвращаться данные
            ticker: торговая пара, по которой запрашиваем данные
        """
        self.cursor.execute("SELECT Pair.id FROM Pair WHERE Pair.Ticker = ? ", [ticker])
        row = self.cursor.fetchone()
        if not row:
            raise ValueError("Wrong ticker")
        self.cursor.execute("""SELECT * FROM Trade Where 
                               Trade.Pair = ? AND  
                               Trade.Timestamp > ? AND
                               Trade.Timestamp < ?""", (row[0], timeRange.beginTime, timeRange.endTime))
        return self.cursor.fetchall()


if __name__ == "__main__":
    # database = Database("sqlite3", "../resources/db/sqlite3/bitbot.db", "", "")
    # database = Database("mssql", "localhost", "BitBot", "user", "password")
    # Название сервера поменять на свой (1-й параметр)

    # tr = TimeRange(datetime(2016, 5, 5, 7, 0, 0), datetime(2016, 5, 5, 7, 30, 0))
    # response = database.getQueue(tr, "BTCUSD")
    # print(response)

    engine = create_engine('sqlite:///../resources/db/sqlite3/bitbot_sqlalchemytest.db')
    engine.connect()
    metadata.bind = engine



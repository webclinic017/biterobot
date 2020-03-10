import pyodbc
import sqlite3
from datetime import datetime
from type import TimeRange
from typing import List, Tuple


class Database:
    """Класс для работы с базой данных

    В классе реализованы методы для получения данных и записи в бд. Класс не предоставляет методов для исполнения любых
    запросов, а лишь явялется оболочкой для заранее заготовленных SQL запросов
    """

    def __init__(self, dbms: str, server: str, database: str, username: str = "", password: str = ""):
        """Конструктор класса бд

        Args:
            dbms: database managment system - тип субд, к которой подключаемся
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
        elif self.dbms == "mssql":
        #подключаемся к MS SQL
            self.connection = pyodbc.connect(
                'DRIVER={ODBC Driver 17 for SQL Server};SERVER=' + server + ';DATABASE=' + database +
                ';UID=' + username + ';PWD=' + password)
            self.cursor = self.connection.cursor()
        else:
            raise NotImplementedError("This DBMS doesn't support")

# TODO:    def createDatabase(self):

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
    dataBase = Database("sqlite3", "../resources/db/sqlite3/bitbot.db", "", "")
    # dataBase = Database("mssql", "localhost", "BitBot", "user", "password")
    # Название сервера поменять на свой (1-й параметр)
    tr = TimeRange(datetime(2016, 5, 5, 7, 0, 0), datetime(2016, 5, 5, 7, 30, 0))
    response = dataBase.getQueue(tr, "BTCUSD")
    print(response)

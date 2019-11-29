import pyodbc
import string
import datetime
from type import TimeRange

class DataBase():
    """Класс для работы с базой данных

    В классе реализованы методы для получения данных и записи в бд. Класс не предоставляет методов для исполнения любых
    запросов, а лишь явялется оболочкой для заранее заготовленных SQL запросов
    """

    def __init__(self, server: string, database: string, username: string, password:string):
        """Конструктор класса бд

        Args:
            server: адрес сервера
            database: имя базы данных для подключения
            username: имя пользователя
            password: пароль TODO: Хорошая ли это идея хранить пароль в классе? Нужно ли его хранить вообще?
        """

        self.server = server
        self.database = database
        self.username = username
        self.password = password
        self.connection = pyodbc.connect(
            'DRIVER={ODBC Driver 17 for SQL Server};SERVER=' + server + ';DATABASE=' + database +
            ';UID=' + username + ';PWD=' + password)
        self.cursor = self.connection.cursor()
        self.timeRange = TimeRange(datetime.datetime(1970, 1, 1, 00, 0, 0), datetime.datetime(1970, 1, 1, 00, 0, 0))
        self.ticker = ""

    def setQueue(self, timeRange: TimeRange, ticker: string):
        """Определяем очередь данных, которую хотим получить из бд

        Args:
            timeRange: временной промежуток, из которого будут возвращаться данные
        """
        self.timeRange = timeRange
        self.ticker = ticker
        self.cursor.execute("SELECT 1 FROM Pair WHERE Pair.Ticker = '" + self.ticker + "'")
        if not self.cursor.fetchone():
            raise ValueError("Wrong ticker")


dataBase = DataBase("localhost", "BitBot", "user", "password")
a = datetime.datetime(2018, 10, 5, 11, 0, 0)
b = datetime.datetime(2018, 10, 5, 11, 30, 0)
tr = TimeRange
tr.beginTime = a
tr.endTime = b
dataBase.setQueue(tr, "BTCUSD")

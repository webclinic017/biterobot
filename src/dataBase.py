import pyodbc
import string
import datetime
from type import TimeRange


class DataBase():
    """Класс для работы с базой данных

    В классе реализованы методы для получения данных и записи в бд. Класс не предоставляет методов для исполнения любых
    запросов, а лишь явялется оболочкой для заранее заготовленных SQL запросов
    """

    def __init__(self, server: string, database: string, username: string, password: string):
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
        self.timeRange = TimeRange()
        self.ticker = ""

    def setQueue(self, timeRange: TimeRange, ticker: string):
        """Определяем очередь данных, которую хотим получить из бд

        Args:
            timeRange: временной промежуток, из которого будут возвращаться данные
            ticker: торговая пара, по которой запрашиваем данные
        """
        self.timeRange = timeRange
        self.ticker = ticker
        self.cursor.execute("SELECT Pair.id FROM Pair WHERE Pair.Ticker = ?", self.ticker)
        beginTimestamp = self.timeRange.beginTime
        endTimestamp = self.timeRange.endTime
        row = self.cursor.fetchone()
        if not row:
            raise ValueError("Wrong ticker")
        self.cursor.execute("""SELECT * FROM Trade Where 
                               Trade.Pair = ? AND  
                               Trade.Timestamp > ? AND
                               Trade.Timestamp < ?""", row.id, beginTimestamp, endTimestamp)

    def getNextData(self):
        """Возвращает следующую запись из набора запрощенных данных

        Return: следующая запись из очереди данных. Представляет из себя Row, из которой можно получить
                значения используя . или []
                Пример: row.id, row[1]
        """

        return self.cursor.fetchone()


if __name__ == "__main__":
    dataBase = DataBase("UZER\SQLEXPRESS", "BitBot", "user", "password")  # Название сервера поменять на свой (1-й параметр)
    a = datetime.datetime(2016, 5, 5, 7, 0, 0)
    b = datetime.datetime(2016, 5, 5, 7, 30, 0)
    tr = TimeRange()
    tr.beginTime, tr.endTime = a, b
    dataBase.setQueue(tr, "BTCUSD")
    print(dataBase.getNextData())

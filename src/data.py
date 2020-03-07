from type import TimeRange, Need
from type import TickType
import random
import datetime
from dataBase import DataBase


class Data:
    """Класс данных для обработки тиков

    В классе реализованы функции для работы с данными по сделкам - тиками
    """

    def __init__(self, timeRange: TimeRange, dataBase: DataBase):
        """Конструктор класса данных

        Args:
            timeRange: Временной промежуток, на котором работаем с данными
            dataBase: База данных, с которой работаем
            neededByStrategy: Какие данные нужны для старта проверки стратегии
        """
        self.timeRange = timeRange
        self.database = dataBase
        self.database.setQueue(self.timeRange, "BTCUSD")  # Пока работаем только с этой парой, далее передавать параметром

    def getTick(self):
        """Получение тика из БД

        Args:
            dataBase: База данных, с которой работаем

        Returns:
            Текущий тик из БД
        """

        tick = self.database.getNextData()
        return tick

    def fillQueue(self):
        """Создание очереди тиков

        Очередь создается на основе тиков из требуемого промежутка времени (см. __init__ -> Arg: timeRange)

        Returns:
            Требуемую очередь тиков
        """

        self.queue = []
        tickCount = 0
        currentTick = self.getTick()
        while (currentTick != None):  # Когда getTick() вернет None => последний тик в данном диапазоне
            self.queue.append(currentTick)
            tickCount += 1
            currentTick = self.getTick()
        return self.queue

    def clearQueue(self):
        """Очищение очереди тиков

        """

        self.queue.clear()

    def timeCount(self):
        """Расчет времение из промежутка

        Вычисляется разница между двумя точками на временном промежутке

        Returns:
            Дельту временного промежутка

        """

        delta = self.timeRange.endTime - self.timeRange.beginTime
        return delta

    def getTimeRange(self):
        """Получение временного промежутка

        Returns:
            Временной промежуток (см. __init__ -> Arg: timeRange)
        """

        return self.timeRange


# TESTING#
if __name__ == "__main__":
    print("__________DATA_TEST_________ \n")

    a = datetime.datetime(2016, 5, 5, 7, 0, 0)
    b = datetime.datetime(2016, 5, 5, 7, 30, 0)
    tr = TimeRange()
    tr.beginTime = a
    tr.endTime = b

    dataBase = DataBase("UZER\SQLEXPRESS", "BitBot", "user", "password")

    data = Data(tr, dataBase)

    print("randomTick =", data.getTick(), '\n')
    print("generatedQueue =", data.fillQueue(), '\n')
    print("deltaTime =", data.timeCount(), '\n')

# РАБОТАЕТ ГЕНЕРАЦИЯ ТИКА
# РАБОТАЕТ ГЕНЕРАЦИЯ ОЧЕРЕДИ С ЗАДАННЫМ ДИАПАЗОНОМ
# РАБОТАЕТ РАСЧЕТ ДЕЛЬТЫ ЗАДАННОГО ВРЕМЕНИ

from type import TimeRange
from type import TickType
import random
import datetime


class Data():
    """Класс данных для обработки тиков

    В классе реализованы функции для работы с данными по сделкам - тиками
    """

    def __init__(self, timeRange: TimeRange):
        """Конструктор класса данных

        Args:
            timeRange: Временной промежуток, на котором работаем с данными
        """

        self.timeRange = timeRange

    def getTick(self):
        """Получение тика из БД

        Returns:
            Текущий тик из БД
        """

        tick = random.uniform(3000.0, 3300.0)  # Вызов ф-ии, котороя вернет Тик из БД, пока рандомное значение
        return tick

    def fillQueue(self):
        """Создание очереди тиков

        Очередь создается на основе тиков из требуемого промежутка времени (см. __init__ -> Arg: timeRange)

        Returns:
            Требуемую очередь тиков
        """

        # Вызов функции БД с парметром timeRange(в string?), для инициализации работы с БД

        self.queue = []
        tickCount = 0
        while (self.getTick() != None and tickCount < 30):  # Когда getTick() вернет None => последний тик в данном диапазоне. Второрое условие - временно для теста (будто у нас 30 тиков)
            self.queue.append(self.getTick())
            tickCount += 1
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


#TESTING#

print("__________DATA_TEST_________ \n")

a = datetime.datetime(2018, 10, 5, 11, 0, 0)
b = datetime.datetime(2018, 10, 5, 11, 30, 0)
tr = TimeRange()
tr.beginTime = a
tr.endTime = b

data = Data(tr)

print("randomTick =", data.getTick(), '\n')
print("generatedQueue =", data.fillQueue(), '\n')
print("deltaTime =", data.timeCount(), '\n')

#РАБОТАЕТ ГЕНЕРАЦИЯ ТИКА
#РАБОТАЕТ ГЕНЕРАЦИЯ ОЧЕРЕДИ С ЗАДАННЫМ ДИАПАЗОНОМ
#РАБОТАЕТ РАСЧЕТ ДЕЛЬТЫ ЗАДАННОГО ВРЕМЕНИ

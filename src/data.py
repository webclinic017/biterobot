from type import TimeRange
from type import TickType
import random
import datetime


class Data():
    def __init__(self, timeRange: TimeRange): # Подаем объект datetime с требуемым промежутком времени
        self.timeRange = timeRange


    def getTick(self):
        self.tick = random.uniform(3000.0, 3300.0)  # Функция, котороя вернет Тик из БД (Димон), пока рандом
        return self.tick

    def fillQueue(self):

            # Вызов функции Димона с timeRange - преобразуем в строку str

        self.queue = []
        self.tickCount = 0
        while (self.getTick() != None and self.tickCount < 30):  #Когда getTick() вернет None => последний тик в данном диапазоне. Второрое условие - временно для теста (будто у нас 30 тиков)
            self.queue.append(self.getTick())
            self.tickCount += 1
        return self.queue

    def clearQueue(self):
        self.queue.clear()

        # Потом допилить ф-ии отправки очереди в БД, взятие очереди из БД

    def timeCount(self):
        delta = self.timeRange.endTime - self.timeRange.beginTime
        return delta

    def getTimeRange(self):
        return self.timeRange


print("__________DATA_TEST_________ \n")

a = datetime.datetime(2018, 10, 5, 11, 0, 0)
b = datetime.datetime(2018, 10, 5, 11, 30, 0)
tr = TimeRange
tr.beginTime = a
tr.endTime = b

data = Data(tr)

print("randomTick =", data.getTick(), '\n')
print("generatedQueue =", data.fillQueue(), '\n')
print("deltaTime =", data.timeCount(), '\n')

#РАБОТАЕТ ГЕНЕРАЦИЯ ТИКА
#РАБОТАЕТ ГЕНЕРАЦИЯ ОЧЕРЕДИ С ЗАДАННЫМ ДИАПАЗОНОМ
#РАБОТАЕТ РАСЧЕТ ДЕЛЬТЫ ЗАДАННОГО ВРЕМЕНИ

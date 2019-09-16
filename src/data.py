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

        self.queue = [float]
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



print("__________DATA_TEST_________")

a = datetime.datetime(2018, 10, 5, 11, 0, 0)
b = datetime.datetime(2018, 10, 5, 11, 30, 0)
tr = TimeRange
tr.beginTime = a
tr.endTime = b

data = Data(tr)

print("randomTick = ", data.getTick())
print("generatedQueue = ", data.fillQueue())
print("deltaTime = ", data.timeCount())

#РАБОТАЕТ ГЕНЕРАЦИЯ ТИКА
#РАБОТАЕТ ГЕНЕРАЦИЯ ОЧЕРЕДИ С ЗАДАННЫМ ДИАПАЗОНОМ
#РАБОТАЕТ РАСЧЕТ ДЕЛЬТЫ ЗАДАННОГО ВРЕМЕНИ


class TestType():
    def __init__(self, testParam: int, testParam2: float):
        self.testParam = testParam
        self.testParam2 = testParam2

testStorage = [TestType]

testObj = TestType
testObj2 = TestType
testObj.testParam = 1
testObj2.testParam2 = 2
testObj.testParam = 3
testObj2.testParam2 = 4


testStorage.append(testObj)
testStorage.append(testObj2)
print(testStorage[0].testParam, testStorage[0].testParam2, testStorage[1].testParam, testStorage[1].testParam2)

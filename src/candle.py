from type import CandleType
from type import TimeRange
from data import Data
import datetime


class Candle():
    def __init__(self, candleQuantity: int, liveTime: int, timeRange: TimeRange):
        self.candleQuantity = candleQuantity
        self.liveTime = liveTime
        self.timeRange = timeRange # Считаем в формате даты в классе StrategyInit

    def createCandle(self, candleRange: TimeRange):  # Нужно создавать свечу по диапозону времени = жизни свечи, делая отдельные очереди


            # Вызов функции Димона с timeRange

        self.data = Data(candleRange) # Нужно передавать диапозон одной свечи на отрезке
        self.candle = CandleType
        self.tickCount = 0
        self.currentTick = self.data.getTick() # Аннотация под TickType, текущий тик
        self.candle.input = self.currentTick   # Больше не трогаем, тк вход = первому тику в диапозоне
        self.candle.output = self.currentTick
        self.candle.min = self.currentTick
        self.candle.max = self.currentTick
        while (self.currentTick != None and self.tickCount < 30):      #Когда getTick() вернет None => последний тик в данном диапазоне. Второрое условие - временно для теста (будто у нас 30 тиков)
            self.candle.output = self.currentTick                       # Присвоится последний тик (до None)
            self.currentTick = self.data.getTick()
            if (self.currentTick < self.candle.min):
                self.candle.min = self.currentTick
            if (self.currentTick > self.candle.max):
                self.candle.max = self.currentTick
            self.tickCount += 1
        if (self.candle.input < self.candle.output):
            self.candle.color = "GREEN"
        elif (self.candle.input > self.candle.output):
            self.candle.color = "RED"
        else:
            self.candle.color = "EMPTY"
        return self.candle

    def fillCandleStorage(self):
        self.candleStorage = [CandleType]
        self.candleRange = TimeRange                        # Формирование диапозона свечи на отрезке времени (как в type) СВЕЧИ В МИНУТАХ
        self.tempTimeBegin = datetime.datetime(self.candleRange.beginTime.year, self.candleRange.beginTime.month,
                                             self.candleRange.beginTime.day, self.candleRange.beginTime.hour,
                                             self.candleRange.beginTime.minute,
                                             self.candleRange.beginTime.second)
        self.tempTimeEnd = datetime.datetime(self.candleRange.beginTime.year, self.candleRange.beginTime.month,
                                          self.candleRange.beginTime.day, self.candleRange.beginTime.hour,
                                          self.candleRange.beginTime.minute + self.liveTime,
                                          self.candleRange.beginTime.second)
        i = 0
        while (i < self.candleQuantity):
            self.tempTimeBegin = datetime.datetime(self.tempTimeBegin.year, self.tempTimeBegin.month,
                                                   self.tempTimeBegin.day, self.tempTimeBegin.hour,
                                                   self.tempTimeBegin.minute + self.liveTime,
                                                   self.tempTimeBegin.second)
            self.tempTimeEnd = datetime.datetime(self.tempTimeEnd.year, self.tempTimeEnd.month,
                                                 self.tempTimeEnd.day, self.tempTimeEnd.hour,
                                                 self.tempTimeEnd.minute + self.liveTime,
                                                 self.tempTimeEnd.second)
            self.timeRange = TimeRange
            self.timeRange.beginTime = self.tempTimeBegin
            self.timeRange.endTime = self.tempTimeEnd
            self.candleStorage.append(self.createCandle(self.timeRange))
            i += 1
        return self.candleStorage

    def clearCandleStorage(self):
        self.candleStorage.clear() # Очищение списка свечей


print("__________CANDLE_TEST_________")

a = datetime.datetime(2018, 10, 5, 11, 0, 0)                    #Нужно после minute = 55 -> hour + 1, minute = 0, как вариант time.ctime
b = datetime.datetime(2018, 10, 5, 11, 30, 0)
tr = TimeRange
tr.beginTime = a
tr.endTime = b

candle = Candle(5, 5, tr)            #добавить проверку на (временной диапазон заданный = количество свечей*время)
candleStorage = candle.fillCandleStorage()

i = 0
while (i < 5):
    print(candleStorage[i].input, candleStorage[i].output, candleStorage[i].min, candleStorage[i].max, candleStorage[i].color)
    i += 1

print(candleStorage)








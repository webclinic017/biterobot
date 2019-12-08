from type import CandleType
from type import TimeRange
from data import Data
import datetime


class Candle():
    """Класс для работы со свечами

    В классе реализованы функции для работы со свечами
    """

    def __init__(self, candleQuantity: int, liveTime: int, timeRange: TimeRange):
        """Конструктор класса свечей

        Args:
            candleQuantity: Количество свечей
            liveTime: Время жизни свечи
            timeRange: Временной промежуток, на котором работаем со свечами
        """

        self.candleQuantity = candleQuantity
        self.liveTime = liveTime
        self.timeRange = timeRange  # Считаем в формате даты в классе StrategyInit?, проверить, что liveTime < delta(timeRange)

    def createCandle(self, candleRange: TimeRange):
        """Создание свечи

        Args:
            candleRange: Диапозон данных для свечи

        Returns:
            candle: Готовая свеча
        """

        # Вызов функции из класса БД с timeRange (candleRange)

        data = Data(candleRange)  # Нужно передавать диапозон одной свечи на отрезке
        candle = CandleType()
        tickCount = 0
        currentTick = data.getTick()  # Текущий тик
        candle.input = currentTick  # Больше не трогаем, тк вход = первому тику в диапозоне
        candle.output = currentTick
        candle.min = currentTick
        candle.max = currentTick
        while (currentTick != None and tickCount < 30):  # Когда getTick() вернет None => последний тик в данном диапазоне. Второрое условие - временно для теста (будто у нас 30 тиков)
            candle.output = currentTick  # Присвоится последний тик (до None) = выход из свечи
            currentTick = data.getTick()
            if (currentTick < candle.min): # Поиск максимального и минимального значения свечи
                candle.min = currentTick
            if (currentTick > candle.max):
                candle.max = currentTick
            tickCount += 1
        if (candle.input < candle.output):  # Присвоение цвета свечи
            candle.color = "GREEN"
        elif (candle.input > candle.output):
            candle.color = "RED"
        else:
            candle.color = "EMPTY"
        return candle

    def fillCandleStorage(self):
        """Заполнение очереди свечей

        Returns:
            candleStorage: Очередь свечей
        """

        self.candleStorage = []
        candleRange = TimeRange()
        tempTimeBegin = datetime.datetime(candleRange.beginTime.year, candleRange.beginTime.month,  # Формирование диапозона свечи на отрезке времени (как в type) СВЕЧИ В МИНУТАХ
                                             candleRange.beginTime.day, candleRange.beginTime.hour,
                                             candleRange.beginTime.minute,
                                             candleRange.beginTime.second)
        tempTimeEnd = datetime.datetime(candleRange.beginTime.year, candleRange.beginTime.month,
                                          candleRange.beginTime.day, candleRange.beginTime.hour,
                                          candleRange.beginTime.minute + liveTime,
                                          candleRange.beginTime.second)
        i = 0
        while (i < self.candleQuantity):
            tempTimeBegin = datetime.datetime(tempTimeBegin.year, tempTimeBegin.month,
                                                   tempTimeBegin.day, tempTimeBegin.hour,
                                                   tempTimeBegin.minute + liveTime,
                                                   tempTimeBegin.second)
            tempTimeEnd = datetime.datetime(tempTimeEnd.year, tempTimeEnd.month,
                                                 tempTimeEnd.day, tempTimeEnd.hour,
                                                 tempTimeEnd.minute + liveTime,
                                                 tempTimeEnd.second)
            timeRange = TimeRange()
            timeRange.beginTime = tempTimeBegin
            timeRange.endTime = tempTimeEnd
            self.candleStorage.append(self.createCandle(timeRange))  # Добавление свечи в очередь
            i += 1
        return self.candleStorage

    def clearCandleStorage(self):
        """Очищение очереди свечей

        """

        self.candleStorage.clear()


print("__________CANDLE_TEST_________ \n")

a = datetime.datetime(2018, 10, 5, 11, 0, 0)                    #Нужно после minute = 55 -> hour + 1, minute = 0, как вариант time.ctime
b = datetime.datetime(2018, 10, 5, 11, 30, 0)
tr = TimeRange()
tr.beginTime = a
tr.endTime = b
candleQuantity = 5
liveTime = 5

candle = Candle(candleQuantity, liveTime, tr)

randomCandle = candle.createCandle(tr)

print("randomCandle =", randomCandle.input, randomCandle.output, randomCandle.min, randomCandle.max, randomCandle.color, '\n')

candleStorage = candle.fillCandleStorage()

print("candleStorage = \n")
i = 0
while (i < candleQuantity):
    print(candleStorage[i].input, candleStorage[i].output, candleStorage[i].min, candleStorage[i].max, candleStorage[i].color, '\n')
    i += 1

#РАБОТАЕТ ГЕНЕРАЦИЯ СВЕЧИ
#РАБОТАЕТ ГЕНЕРАЦИЯ ОЧЕРЕДИ СВЕЧЕЙ


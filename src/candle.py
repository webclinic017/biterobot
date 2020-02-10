from type import CandleType
from type import TimeRange
from data import Data
import datetime
from database import DataBase


class Candle():
    """Класс для работы со свечами

    В классе реализованы функции для работы со свечами
    """

    def __init__(self, candleQuantity: int, liveTime: int, timeRange: TimeRange, dataBase: DataBase):
        """Конструктор класса свечей

        Args:
            candleQuantity: Количество свечей
            liveTime: Время жизни свечи
            timeRange: Временной промежуток, на котором работаем со свечами
            dataBase: База данных, с которой работаем
        """

        self.candleQuantity = candleQuantity
        self.liveTime = liveTime
        self.timeRange = timeRange  # Считаем в формате даты в классе StrategyInit?, проверить, что liveTime < delta(timeRange)
        #self.dataBase = DataBase
        #dataBase.setQueue(timeRange, "BTCUSD")  # Пока работаем только с этой парой, далее передавать параметром

    def createCandle(self, candleRange: TimeRange):
        """Создание свечи

        Args:
            candleRange: Диапозон данных для свечи

        Returns:
            candle: Готовая свеча
        """

        # Вызов функции из класса БД с timeRange (candleRange)

        data = Data(candleRange, dataBase)  # Нужно передавать диапозон одной свечи на отрезке
        candle = CandleType()
        tickCount = 0
        currentTick = data.getTick(dataBase)  # Текущий тик
        if (currentTick != None):
            candle.input = currentTick[4]  # Больше не трогаем, тк вход = первому тику в диапозоне
            candle.output = currentTick[4]
            candle.min = currentTick[4]
            candle.max = currentTick[4]
            while (currentTick != None):  # Когда getTick() вернет None => последний тик в данном диапазоне. Второрое условие - временно для теста (будто у нас 30 тиков)
                candle.output = currentTick[4]  # Присвоится последний тик (до None) = выход из свечи
                if (currentTick[4] < candle.min):  # Поиск максимального и минимального значения свечи
                    candle.min = currentTick[4]
                if (currentTick[4] > candle.max):
                    candle.max = currentTick[4]
                tickCount += 1
                currentTick = data.getTick(dataBase)
            if (candle.input < candle.output):  # Присвоение цвета свечи
                candle.color = "GREEN"
            elif (candle.input > candle.output):
                candle.color = "RED"
            else:
                candle.color = "EMPTY"
            return candle
        else:
            #print("HAS NO ANY TICKS")  # Если вернет None, значит нет тиков = не из чего строить свечу
            return None

    def fillCandleStorage(self):
        """Заполнение очереди свечей

        Returns:
            candleStorage: Очередь свечей
        """

        self.candleStorage = []
        candleRange = self.timeRange
        tempTimeBegin = datetime.datetime(candleRange.beginTime.year, candleRange.beginTime.month,
                                          # Формирование диапозона свечи на отрезке времени (как в type) СВЕЧИ В МИНУТАХ
                                          candleRange.beginTime.day, candleRange.beginTime.hour,
                                          candleRange.beginTime.minute,
                                          candleRange.beginTime.second)
        tempTimeEnd = datetime.datetime(candleRange.beginTime.year, candleRange.beginTime.month,
                                        candleRange.beginTime.day, candleRange.beginTime.hour,
                                        candleRange.beginTime.minute + liveTime,
                                        candleRange.beginTime.second)
        i = 0
        while (i < self.candleQuantity):  # После начала цикла берет следующий диапозон времени, те пропускат один! Видно в дебаге
            tempTimeBegin = datetime.datetime(tempTimeBegin.year, tempTimeBegin.month,
                                              tempTimeBegin.day, tempTimeBegin.hour,
                                              tempTimeBegin.minute + liveTime,
                                              tempTimeBegin.second)
            tempTimeEnd = datetime.datetime(tempTimeEnd.year, tempTimeEnd.month,
                                            tempTimeEnd.day, tempTimeEnd.hour,
                                            tempTimeEnd.minute + liveTime,
                                            tempTimeEnd.second)
            timeRange = TimeRange()  # Подумать, как сделать лучше
            timeRange.beginTime = tempTimeBegin
            timeRange.endTime = tempTimeEnd
            candleNew = self.createCandle(timeRange)
            # !BAG! При добавлении элемента в список, меняет весь список на него
            if (candleNew != None):  # Если на промежутке не сгенерировалась свеча, то добавляем свечу EMPTY, все параметры = output предыдущей
                self.candleStorage.append(candleNew)  # Добавление свечи в очередь
            else:
                self.candleStorage.append(self.candleStorage[i - 1])
                self.candleStorage[i].input = self.candleStorage[i - 1].output
                self.candleStorage[i].output = self.candleStorage[i - 1].output
                self.candleStorage[i].min = self.candleStorage[i - 1].output
                self.candleStorage[i].max = self.candleStorage[i - 1].output
                self.candleStorage[i].color = "EMPTY"
            i += 1
        return self.candleStorage

    def clearCandleStorage(self):
        """Очищение очереди свечей

        """

        self.candleStorage.clear()


if __name__ == "__main__":
    print("__________CANDLE_TEST_________ \n")

    a = datetime.datetime(2016, 5, 5, 7, 0, 0)
    # Нужно после minute = 55 -> hour + 1, minute = 0, как вариант time.ctime
    b = datetime.datetime(2016, 5, 5, 7, 30, 0)
    tr = TimeRange()
    tr.beginTime = a
    tr.endTime = b
    candleQuantity = 5
    liveTime = 5

    dataBase = DataBase("UZER\SQLEXPRESS", "BitBot", "user", "password")

    candle = Candle(candleQuantity, liveTime, tr, dataBase)

    randomCandle = candle.createCandle(tr)

    print("randomCandle =", randomCandle.input, randomCandle.output, randomCandle.min, randomCandle.max,
          randomCandle.color, '\n')

    candleStorage = candle.fillCandleStorage()

    print("candleStorage = \n")
    i = 0
    while i < candleQuantity:
        print(candleStorage[i].input, candleStorage[i].output, candleStorage[i].min, candleStorage[i].max,
              candleStorage[i].color, '\n')
        i += 1

# РАБОТАЕТ ГЕНЕРАЦИЯ СВЕЧИ
# РАБОТАЕТ ГЕНЕРАЦИЯ ОЧЕРЕДИ СВЕЧЕЙ

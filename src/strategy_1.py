from type import StatusFlag
from type import Need
from type import TickType
from type import Decision
from data import Data
from process import Process

MINUTE = 1
HOUR = 60
DAY = 1440


# ОПИСАНИЕ СТРАТЕГИИ (ЛЕНЯ)


class Strategy_1:
    """Класс Стратегии № 1

    В классе реализована простейшая стратегия с коридором
    """

    def __init__(self, status: StatusFlag):
        """Конструктор класса стратегии


        Args:
            status: Текущий статус торговли (в сделке/ не в сделке)
        """

        self.status = status
        self.process = Process()  # Создание объекта класса для управления кошельком

    def setNeed(self):
        """Заполнение требуемых данных для стратегии

        Returns:
            strategyNeed: Требуемые данные для стратегии
        """

        self.strategyNeed = Need
        self.strategyNeed.candleCount = None
        self.strategyNeed.candleLiveTime = None
        self.strategyNeed.dataTimeRange = 30 * MINUTE
        return self.strategyNeed

    def setPastData(self, data: Data):
        """Получение требемых данных(тиков) для анализа

        Args:
            data: Требуемые данные(тики)
        """

        self.data = data
        self.dataStorage = self.data.fillQueue()

    def analysData(self):
        """Анализ данных

        """

        self.max = self.min = self.dataStorage[0]
        for self.tick in self.dataStorage:
            if (self.tick > self.max):
                self.max = self.tick
            if (self.tick < self.min):
                self.min = self.tick
            self.stopPrice = (self.max + self.min) / 2

    def speculate(self):  # Продумать бесконечнный цикл с вызовом внешних ф-ий покупки/продажи
        """Процесс торговли по стратегии

        """

        if (self.status == StatusFlag.outDeal):
            self.newTick = self.data.getTick()
            if (self.newTick > self.max):
                self.stopPrice = (self.max + self.min) / 2
                self.process.buy(self.newTick)
                self.status = StatusFlag.inDeal
                self.min = self.max
                self.max = self.newTick
            elif (self.newTick < self.min):
                self.stopPrice = (self.max + self.min) / 2
                self.process.sell(self.newTick)
                self.status = StatusFlag.outDeal
                self.max = self.min
                self.min = self.newTick
        elif (self.status == StatusFlag.inDeal):
            if (self.newTick > self.max):
                self.max = self.newTick
            elif (self.newTick < self.min):
                self.min = self.newTick
                if (self.min <= self.stopPrice):
                    self.stopPrice = (self.max + self.min) / 2
                    self.max = self.min
                    self.sell(self.newTick)
                    self.status = StatusFlag.outDeal

    def getDecision(self):  # Вызывается в StartegyInit и выдает решение
        """Выдача решения стратегии

        Returns:
            decision: Решение
        """

        self.analysData()
        while (True):  # Пока не вернет исключения или не будет ручного стопа

            self.speculate()
        return self.decision

# if __name__ == "__main__":


from strategy_1 import Strategy_1
from data import Data
from candle import Candle
from type import TimeRange
import datetime


class StrategiInit():
    """Класс инициализации стратегии

    В классе инициализируется стратегия, собираются данные под требования стратегии,
     создается объект стратегии, стратегия запускается в работу
    """

    def __init__(self, strategy: Strategy_1):
        """Класс для работы со свечами

        В классе реализованы функции для работы со свечами
        """

        self.strategy = strategy

    def getNeed(self):
        """Сбор данных под требования стратеги

        """

        self.strategyNeed = self.strategy.setNeed()
        if (self.strategyNeed.candleCount != None):
            pass                                     # Выбор диапозона, создание и заполнение свечей
        if (self.strategyNeed.dataTimeRange != None):
            print("STRATEGY NEEDS DATA FOR " + str(self.strategyNeed.dataTimeRange) + "MINUTES")
            self.timeRange = TimeRange
            print("Set begin time: \n")
            self.timeRange.beginTime = datetime.datetime(int(input("year: ")), int(input("month: ")), int(input("day: ")),
                                                         int(input("hour: ")), int(input("minute: "), 0))
            print("Set end time: \n")
            self.timeRange.endTime = datetime.datetime(int(input("year: ")), int(input("month: ")),
                                                         int(input("day: ")),
                                                         int(input("hour: ")), int(input("minute: "), 0))
            self.data = Data(self.timeRange)
            self.strategy.setPastData(self.data)

    def start(self):
        """Запуск работы стратегии

        """

        self.strategy.getDecision()

        # Далее либо бесконечный цикл, либо что-то еще

strat = Strategy_1
A = StrategiInit(strat)
A.getNeed()
A.start()




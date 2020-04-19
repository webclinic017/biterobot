import random
from typing import Union
from type import Need, Strategy, TickType, CandleType
from datetime import timedelta


class ExampleStrategy(Strategy):
    def __init__(self):
        # Параметры риска стратегии
        self.eventPercent = 1.0  # На сколько процентов от депозита можно максимально совершить сделку.
        # 1.0 - на 100 процентов т.е. на весь депозит, 0.5 - на 50% от депозита
        self.lossPercent = 0.01  # Какой максимальный процент от всего депозита можно потерять на неудачной сделке
        # Определим данные для подготовки к работе перед тестом
        self.needForStart = Need(worksWith="ticks", timedeltaBeforeStart=timedelta(minutes=10))
        self.averagePrice = 0
        self.countOfTicks = 0

    def prepareForBacktest(self, currentTick: Union[TickType, CandleType]):
        # считаем среднюю цену за период
        self.averagePrice = ((self.averagePrice * self.countOfTicks) + currentTick.price) / (self.countOfTicks + 1)
        self.countOfTicks += 1
        return 0  # тик обработан, готов принять следующий

    def getDecision(self, currentTick):
        if currentTick.price < self.averagePrice:
            return "BUY", currentTick.price * 0.99
        elif currentTick.price > self.averagePrice:
            return "SELL", currentTick.price * 1.01
        return None

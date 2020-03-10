import random
from type import Need
from datetime import timedelta


class ExampleStrategy:
    def __init__(self):
        # Параметры риска стратегии
        self.eventPercent = 1.0  # На сколько процентов от депозита можно максимально совершить сделку.
        # 1.0 - на 100 процентов т.е. на весь депозит, 0.5 - на 50% от депозита
        self.lossPercent = 0.01  # Какой максимальный процент от всего депозита можно потерять на неудачной сделке
        # Определим данные для подготовки к работе перед тестом
        self.needForStart = Need(worksWith="ticks", timedeltaBeforeStart=timedelta(minutes=10))
        self.averagePrice = 0
        self.countOfTicks = 0

    def prepareForBacktest(self, currentTick):
        # считаем среднюю цену за период
        self.averagePrice = ((self.averagePrice * self.countOfTicks) + currentTick.Price) / (self.averagePrice + 1)
        return 0  # конец подготовки

    def getDecision(self, currentTick):
        if currentTick.Price < self.averagePrice:
            return "BUY"
        elif currentTick.Price > self.averagePrice:
            return "SELL"
        return None

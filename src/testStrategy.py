import random
from typing import Union

from type import Strategy, TickType, CandleType


class OnlySellStrategy(Strategy):
    def prepareForBacktest(self, currentTick: Union[TickType, CandleType]) -> int:
        pass

    def __init__(self):
        self.eventPercent = 1
        self.lossPercent = 1

    def getDecision(self, currentData) -> (str, float):
        return "SELL", currentData.price * 1.01


class BrokenStrategy(Strategy):
    def prepareForBacktest(self, currentTick: Union[TickType, CandleType]) -> int:
        pass

    def __init__(self):
        self.eventPercent = 1
        self.lossPercent = 1

    def getDecision(self, currentData) -> (str, float):
        return "i am broken", currentData.price * 1.01

from strategy import Strategy
import random

class OnlySellStrategy(Strategy):
    def __init__(self):
        self.eventPercent = 1
        self.lossPercent = 1

    def getDecision(self, currentData):
        return "SELL"


class BrokenStrategy(Strategy):
    def __init__(self):
        self.eventPercent = 1
        self.lossPercent = 1

    def getDecision(self, currentData):
        return "i am broken"

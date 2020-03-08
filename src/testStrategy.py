import random

class OnlySellStrategy:
    def __init__(self):
        self.eventPercent = 1
        self.lossPercent = 1

    def getDecision(self, currentData):
        return "SELL"


class BrokenStrategy:
    def __init__(self):
        self.eventPercent = 1
        self.lossPercent = 1

    def getDecision(self, currentData):
        return "i am broken"

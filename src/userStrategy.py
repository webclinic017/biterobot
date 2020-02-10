from strategy import Strategy
import random


class UserStrategy(Strategy):

    def __init__(self):
        self.eventPercent = 1
        self.lossPercent = 0.01

    def getDecision(self, currentData):
        decision = random.randint(0, 2)
        if decision == 1:
            return "BUY"
        elif decision == 2:
            return "SELL"
        return None

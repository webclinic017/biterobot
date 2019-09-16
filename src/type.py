import datetime
from enum import Enum


class TickType():
    def __init__(self, value: float, timeStamp: datetime.datetime):
        self.value = value
        self.timeStamp = timeStamp

class CandleType():
    def __init__(self, liveTime: int, input: float, output: float, min: float, max: float, color: str):
        self.liveTime = liveTime
        self.input = input
        self.output = output
        self.min = min
        self.max = max
        self.color = color


class TimeRange():
    def __init__(self, beginTime: datetime.datetime, endTime: datetime.datetime):
        self.beginTime = beginTime
        self.endTime = endTime

class StatusFlag(Enum):
    outDeal = 0
    inDeal = 1

class Need():
    def __init__(self, candleCount: int, candleLiveTime: int, dataTimeRange: int):
        self.candleCount = candleCount
        self.candleLiveTime = candleLiveTime
        self.dataTimeRange = dataTimeRange

class Decision(Enum):
    SELL = 0
    BUY = 1
    STAY = 2

def buy():
    wallet =- 5;
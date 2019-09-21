import datetime
from enum import Enum


class TickType():
    value: float
    timeStamp: datetime.datetime

class CandleType():
    liveTime: int
    input: float
    output: float
    min: float
    max: float
    color: str

class TimeRange():
    beginTime: datetime.datetime
    endTime: datetime.datetime

class StatusFlag(Enum):
    outDeal = 0
    inDeal = 1

class Need():
    candleCount: int
    candleLiveTime: int
    dataTimeRange: int

class Decision(Enum):
    SELL = 0
    BUY = 1
    STAY = 2

def buy():
    wallet =- 5
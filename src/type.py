from datetime import datetime, timedelta
from enum import Enum


class TickType:
    value: float
    timeStamp: datetime


class CandleType:
    quantity: timedelta  # при таком определении можно будет проводить алгебр. операции
    open: float
    close: float
    min: float
    max: float


class TimeRange:
    def __init__(self, beginTime: datetime,  # = datetime.datetime(2016, 5, 5, 7, 0, 0),
                 endTime: datetime):  # = datetime.datetime(2016, 5, 5, 7, 30, 0)):
        self.beginTime = beginTime
        self.endTime = endTime


class StatusFlag(Enum):
    outDeal = 0
    inDeal = 1


class Need:
    """Класс, содержащий информацию о том, какие дополнительные данные нужны стратегии для работы

    Args:
        candleCount - сколько свеч нужно
        quantity - какого размера
        timedelta - какой временной интервал

       """

    def __init__(self, numOfCandles: int = None, quantity: timedelta = None, deltatime: timedelta = None):
        # if (deltatime is None) and (numOfCandles is None or quantity is None):
        #    raise ValueError() # нужно ввести либо число свечей и их размер, либо временной интервал
        # if
        self.numOfCandles: int = numOfCandles
        self.quantity: timedelta = quantity
        self.deltatime: timedelta = deltatime  #стандартный тип представления разницы
        # времени с описанными алгебр. операциями

    def getDeltatime(self):
        if self.deltatime is not None:
            return self.deltatime
        else:
            return self.numOfCandles * self.quantity

    def getCandles(self):
        if self.quantity is not None and self.numOfCandles is not None:
            return self.quantity, self.numOfCandles
        else:
            raise RuntimeError("Candles wasn't set yet. Try to get deltatime")


class Decision(Enum):
    SELL = 0
    BUY = 1
    STAY = 2


def buy():
    wallet = - 5

# if __name__ == "__main__":

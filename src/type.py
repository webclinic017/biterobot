from datetime import datetime, timedelta
from enum import Enum


class TickType:
    def __init__(self, timestamp: datetime, tradeDirection: int, price: float, volume: float):
        self.timestamp = timestamp
        self.tradeDirection = tradeDirection
        self.price = price
        self.volume = volume


class CandleType:
    def __init__(self, quantity: timedelta, beginTimestamp: datetime, volume: float,
                 open: float, high: float, low: float, close: float):
        self.quantity = quantity
        self.beginTimestamp = beginTimestamp
        self.volume = volume
        self.open = open
        self.high = high
        self.low = low
        self.close = close


class TimeRange:
    def __init__(self, beginTime: datetime,  # = datetime.datetime(2016, 5, 5, 7, 0, 0),
                 endTime: datetime):  # = datetime.datetime(2016, 5, 5, 7, 30, 0)):
        self.beginTime = beginTime
        self.endTime = endTime


class CandleQuantity:
    YEAR = 'y'
    MONTH = 'M'
    WEEK = 'w'
    DAY = 'd'
    HOUR = 'h'
    MINUTE = 'm'
    SECOND = 's'

    @staticmethod
    def parseQuantity(quantity: str) -> timedelta:
        amount = int(quantity[0:-1])
        unit = quantity[-1]
        # TODO: каждого года и месяца разная продолжительность. И что с этим делать?
        if 'y' == unit:
            raise NotImplementedError()
            # result = timedelta() # 60 * 60 * 24 * 365
        elif 'M' == unit:
            raise NotImplementedError()
            # result = # 60 * 60 * 24 * 30
        elif 'w' == unit:
            result = timedelta(weeks=amount)
        elif 'd' == unit:
            result = timedelta(days=amount)
        elif 'h' == unit:
            result = timedelta(hours=amount)
        elif 'm' == unit:
            result = timedelta(minutes=amount)
        elif 's' == unit:
            result = timedelta(seconds=amount)
        else:
            raise NotImplementedError('timeframe unit {} is not supported'.format(unit))
        return result


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
    TICKS_WITH_AMOUNT: int = 0
    TICKS_WITH_TIMEDELTA: int = 1
    CANDLES: int = 2

    def __init__(self, worksWith: str = None, preparedAmount: int = None, quantity: timedelta = None,
                 timedeltaBeforeStart: timedelta = None):
        worksWith = worksWith.lower()
        if worksWith == "candles":
            raise NotImplementedError()
        # self.prepareType = Need.CANDLES
        elif worksWith == "ticks":
            if preparedAmount is not None:
                raise NotImplementedError()
            # self.prepareType = Need.TICKS_WITH_AMOUNT
            elif timedeltaBeforeStart is not None:
                self.prepareType = Need.TICKS_WITH_TIMEDELTA
                self.timedeltaBeforeStart = timedeltaBeforeStart
            else:
                raise ValueError("You should provide number of ticks or timedelta also")
        else:
            raise ValueError("You should say if strategy works with candles or ticks. Set parameter worksWith")

    def getNeededData(self):
        if self.prepareType == Need.TICKS_WITH_TIMEDELTA:
            return Need.TICKS_WITH_TIMEDELTA, self.timedeltaBeforeStart
        else:
            NotImplementedError()


class Decision(Enum):
    SELL = 0
    BUY = 1
    STAY = 2


def buy():
    wallet = - 5


if __name__ == "__main__":
    need = Need(worksWith="ticks", timedeltaBeforeStart=timedelta(days=1)).getNeededData()
    print(need[0] == Need.TICKS_WITH_TIMEDELTA)

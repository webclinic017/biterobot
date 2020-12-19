import importlib.util

from .backtest import manager
from dataManager.models import DataIntervalModel, CandleModel


def testInit(taskId, strategyPath, dateBegin, dateEnd, ticker, candleLength):
    # Получение класса стратегии
    spec = importlib.util.spec_from_file_location("TestStrategy",
                                                  strategyPath)
    foo = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(foo)

    # Получение данных Candle и перевод в DF
    createDF(dateBegin=dateBegin, dateEnd=dateEnd, ticker=ticker, candleLength=candleLength)

    print("STRATEGY CLASS - ", foo.TestStrategy)  # Печать класса для теста работы
    print("TASK ID - ", taskId)

    backtest = manager.BacktestManager()

    backtest.createTask(taskId, foo.TestStrategy)

def createDF(dateBegin, dateEnd, ticker, candleLength):
    dataIntervalId = DataIntervalModel.objects.get(dateBegin=dateBegin, dateEnd=dateEnd, ticker=ticker, candleLength=candleLength)
    #print(dataIntervalId)



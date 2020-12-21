import importlib.util
from time import sleep
from datetime import datetime
from django.conf import settings
import pandas as pd

from .backtest import manager
from dataManager.models import DataIntervalModel, CandleModel

from .backtest.tools import checkStrategy


def testInit(taskId, strategyPath, dateBegin, dateEnd, ticker, candleLength):
    # Получение класса стратегии
    spec = importlib.util.spec_from_file_location("Strategy",
                                                  strategyPath)
    foo = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(foo)

    # Получение данных Candle и перевод в DF
    candleDF = createDF(dateBegin=dateBegin, dateEnd=dateEnd, ticker=ticker, candleLength=candleLength)

    print("STRATEGY CLASS - ", foo.Strategy)  # Печать класса для теста работы
    print("TASK ID - ", taskId)
    print("CANDLE_DF - ", candleDF)

    backtest = manager.BacktestManager()

    backtest.createTask(taskId=taskId, strategyFilePath=strategyPath, data=candleDF, plotFilePath=f'{settings.BASE_DIR}\\testManager\\resultGraphs\graph.html')

    print("TEST STRATEGY - ", checkStrategy(foo.Strategy))

    print("STATUS 1 - ", backtest.getStatus(taskId=taskId))
    backtest.run(taskId=taskId)
    print("STATUS 2 - ", backtest.getStatus(taskId=taskId))
    sleep(15)
    print("STATUS 3 - ", backtest.getStatus(taskId=taskId))
    print("RESULT - ", backtest.getResult(taskId=taskId))

def createDF(dateBegin, dateEnd, ticker, candleLength):
    dataInterval = DataIntervalModel.objects.filter(dateBegin=dateBegin, dateEnd=dateEnd, ticker=ticker, candleLength=candleLength)
    dataIntervalId = dataInterval.values_list('id', flat=True)[0]
    candlesQuerySet = CandleModel.objects.filter(dataInterval_id=dataIntervalId)

    rowData = pd.DataFrame(columns=['datetime', 'open', 'high', 'low', 'close', 'volume', 'openinterest'])
    for candle in candlesQuerySet:
        rowData = rowData.append({
            'datetime': datetime.strptime(str(pd.datetime.date(candle.candleTime)), '%Y-%m-%d'),
            'open': candle.o,
            'high': candle.h,
            'low': candle.l,
            'close': candle.c,
            'volume': candle.v,
            'openinterest': candle.v,
        }, ignore_index=True)

    rowData.set_index('datetime', inplace=True)

    return rowData

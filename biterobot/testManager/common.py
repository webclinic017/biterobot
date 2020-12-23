from time import sleep
from datetime import datetime
from django.conf import settings
import pandas as pd

from .backtest import manager
from dataManager.models import DataIntervalModel, CandleModel
from testManager.models import TestModel


def testInit(taskId, strategyId, strategyPath, strategyName, version, dateBegin, dateEnd, ticker, candleLength):
    # Получение данных Candle и перевод в DF
    candleDF = createDF(dateBegin=dateBegin, dateEnd=dateEnd, ticker=ticker, candleLength=candleLength)

    # Генерация пути к графику из имени стратегии + Graph.html
    graphPath = f'{settings.BASE_DIR}/testManager/resultGraphs/{strategyName}Graph.html'

    # Создание модели Теста
    testModel = TestModel(strategyId =strategyId, name=strategyName, uuid=taskId, dateBegin=dateBegin, dateEnd=dateEnd,
                            dateTest=datetime.today().strftime('%Y-%m-%d'), ticker=ticker, version=version)
    testModel.save()

    # Работа с Backtest
    backtest = manager.BacktestManager()

    backtest.createTask(taskId=taskId, strategyFilePath=strategyPath, data=candleDF, plotFilePath=graphPath)

    testModel = TestModel.objects.get(uuid=taskId)
    testModel.tstStatus = backtest.getStatus(taskId=taskId)
    testModel.save()

    backtest.run(taskId=taskId)

    testModel = TestModel.objects.get(uuid=taskId)
    testModel.tstStatus = backtest.getStatus(taskId=taskId)
    testModel.save()

    while backtest.getStatus(taskId=taskId) in ["CREATED", "RUNNING"]:
        sleep(2)

    testModel = TestModel.objects.get(uuid=taskId)
    testModel.tstStatus = backtest.getStatus(taskId=taskId)
    testModel.save()

    if backtest.getStatus(taskId=taskId) == "DONE":
        testModel = TestModel.objects.get(uuid=taskId)
        result = backtest.getResult(taskId=taskId)
        testModel.resultData = result
        testModel.startCash = result[0]
        testModel.endCash = result[1]
        testModel.file = f'/testManager/resultGraphs/{strategyName}Graph.html'
        testModel.save()


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

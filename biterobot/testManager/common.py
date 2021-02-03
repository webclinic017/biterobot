from datetime import datetime
from django.conf import settings
import pandas as pd
import os

from dataManager.models import DataIntervalModel, CandleModel
from testManager.models import TestModel


def testInit(taskId: str, strategyId: int, strategyPath: str, strategyName: str, version: int,
             dateBegin: datetime, dateEnd: datetime, ticker: str, candleLength: str):
    '''
    Initialize Test, add necessary data in Test and start Test
    :param taskId: Unique identifier string for the Test, that uses in async functions in Backtest
    :param strategyId: Strategy's id in database
    :param strategyPath: Strategy's path on server's directory
    :param strategyName: Strategy's name
    :param version: Strategy's version
    :param dateBegin: Date of beginning a Data interval for Test
    :param dateEnd: Date of ending a Data interval for Test
    :param ticker: Instrument's ticker for the Test
    :param candleLength: Length of candle
    :return: -
    '''
    # Create model of the Test with data that hoes from request
    testModel = TestModel(strategyId=strategyId, name=strategyName, uuid=taskId, dateBegin=dateBegin, dateEnd=dateEnd,
                            dateTest=datetime.today().strftime('%Y-%m-%d'), ticker=ticker, version=version)
    testModel.save()

    # Transform financial data from database. A long process!
    candleDF = createDF(dateBegin=dateBegin, dateEnd=dateEnd, ticker=ticker, candleLength=candleLength)

    # Generating the graph path = 'the strategy name + Graph.html'
    graphPath = os.path.join(os.path.abspath(os.path.dirname(__file__)),
                             f'{settings.BASE_DIR}/testManager/resultGraphs/{strategyName}_{taskId}Graph.html')

    # Create task in Backtest module
    testModel.backtest.createTask(taskId=taskId, strategyFilePath=strategyPath, data=candleDF, plotFilePath=graphPath)

    # Updating the Test in database, add status
    testModel = TestModel.objects.get(uuid=taskId)
    testModel.tstStatus = testModel.backtest.getStatus(taskId=taskId)
    testModel.save()

    # Start task in Backtest module
    testModel.backtest.run(taskId=taskId)

    # Updating the Test in database, add status
    testModel = TestModel.objects.get(uuid=taskId)
    testModel.tstStatus = testModel.backtest.getStatus(taskId=taskId)
    testModel.save()

    # Waiting for process of the Test, update status in database, save results, end testing
    while True:
        if testModel.backtest.getStatus(taskId=taskId) == "DONE":
            testModel = TestModel.objects.get(uuid=taskId)
            testModel.tstStatus = testModel.backtest.getStatus(taskId=taskId)
            result = testModel.backtest.getResult(taskId=taskId)
            testModel.resultData = result[2]
            testModel.startCash = result[0]
            testModel.endCash = result[1]
            testModel.file = f'/testManager/resultGraphs/{strategyName}_{taskId}Graph.html'
            testModel.save()
            break
        if testModel.backtest.getStatus(taskId=taskId) == "ERROR":
            testModel = TestModel.objects.get(uuid=taskId)
            testModel.tstStatus = testModel.backtest.getStatus(taskId=taskId)
            testModel.save()
            break
        if testModel.backtest.getStatus(taskId=taskId) == "PAUSED":
            testModel = TestModel.objects.get(uuid=taskId)
            testModel.tstStatus = testModel.backtest.getStatus(taskId=taskId)
            testModel.save()

def createDF(dateBegin: datetime, dateEnd: datetime, ticker: str, candleLength: str) -> pd.DataFrame:
    '''
    Preparing financial data for Backtest module. Create pandas.Dataframe from Data in database
    :param dateBegin: Date of beginning a Data interval for Test
    :param dateEnd: Date of ending a Data interval for Test
    :param ticker: Instrument's ticker
    :param candleLength: Length of candle
    :return: Prepared data in the required format for Backtest
    '''
    # Get data from database
    dataInterval = DataIntervalModel.objects.filter(dateBegin=dateBegin, dateEnd=dateEnd, ticker=ticker, candleLength=candleLength)
    dataIntervalId = dataInterval.values_list('id', flat=True)[0]
    candlesQuerySet = CandleModel.objects.filter(dataInterval_id=dataIntervalId)

    # Process of preparing data
    rowData = pd.DataFrame(columns=['datetime', 'open', 'high', 'low', 'close', 'volume', 'openinterest'])
    for candle in candlesQuerySet:
        rowData = rowData.append({
            'datetime': candle.candleTime,
            'open': candle.o,
            'high': candle.h,
            'low': candle.l,
            'close': candle.c,
            'volume': candle.v,
            'openinterest': candle.v,
        }, ignore_index=True)

    rowData.set_index('datetime', inplace=True)

    return rowData

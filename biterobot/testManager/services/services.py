from datetime import datetime
from django.conf import settings
import pandas as pd
import os

from dataManager.models import DataIntervalModel, CandleModel
from testManager.models import TestModel
from testManager.services import dbServices


def testInit(taskId: str, strategyId: int, dataId: int):
    '''
    Initialize Test, add necessary data in Test and start Test
    :param taskId: Unique identifier string for the Test, that uses in async functions in Backtest
    :param strategyId: Strategy's id in database
    :param dataId: DataInterval's id in database
    :return: -
    '''
    testInfo = dbServices.initTestInfo(taskId=taskId, strategyId=strategyId, dataId=dataId)  # return [0]strategyName, [1]]version, [2]]ticker, [3]candleLength,
                                                                                                                        # [4]dateBegin, [5]dateEnd, testModel[6]

    # Transform financial data from database. A long process!
    candleDF = createDF(dateBegin=testInfo[4], dateEnd=testInfo[5], ticker=testInfo[2], candleLength=testInfo[3])

    # Generating the graph path = 'the strategy name + Graph.html'
    graphPath = os.path.join(os.path.abspath(os.path.dirname(__file__)),
                             f'{settings.BASE_DIR}/testManager/resultGraphs/{testInfo[0]}_{taskId}Graph.html')

    # Create task in Backtest module
    testInfo[6].backtest.createTask(taskId=taskId, strategyFilePath=f'{settings.BASE_DIR}/strategyManager/strategies/{testInfo[0]}.py',
                                    data=candleDF, plotFilePath=graphPath)

    dbServices.saveStatusInfo(taskId=taskId)

    # Start task in Backtest module
    testInfo[6].backtest.run(taskId=taskId)

    dbServices.saveStatusInfo(taskId=taskId)

    # Waiting for process of the Test, update status in database, save results, end testing
    while True:
        if testInfo[6].backtest.getStatus(taskId=taskId) == "DONE":
            testModel = TestModel.objects.get(uuid=taskId)
            testModel.tstStatus = testModel.backtest.getStatus(taskId=taskId)
            result = testModel.backtest.getResult(taskId=taskId)
            testModel.resultData = result[2]
            testModel.startCash = result[0]
            testModel.endCash = result[1]
            testModel.file = f'/testManager/resultGraphs/{testInfo[0]}_{taskId}Graph.html'
            testModel.save()
            break
        if testInfo[6].backtest.getStatus(taskId=taskId) == "ERROR":
            dbServices.saveStatusInfo(taskId=taskId)
            break
        if testInfo[6].backtest.getStatus(taskId=taskId) == "PAUSED":
            dbServices.saveStatusInfo(taskId=taskId)

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

def getArchiveTests(strategyId: int) -> (dict, None):
    '''
    Get results for one Strategy tests with a special structure of JSON, that needs for frontend tables
    :param strategyId: Strategy' id in database
    :return: Dict of tests results with a special struct
    '''
    tests = TestModel.objects.filter(strategyId=strategyId)

    if len(tests) != 0:
        testIdList = []
        nameList = []
        versionList = []
        dateTestList = []
        dateBeginList = []
        dateEndList = []
        fileIdList = []

        webPathList = []
        resultList = []
        startCashList = []
        endCashList = []

        dataList = []
        fileList = []

        i = 0
        for test in tests:
            testIdList.append(test.id)
            nameList.append(test.name + '_' + str(test.id))
            versionList.append(test.version)
            dateTestList.append(test.dateTest)
            dateBeginList.append(test.dateBegin)
            dateEndList.append(test.dateEnd)
            fileIdList.append(i)

            dataList.append(
                {
                    "id": testIdList[i],
                    "name": nameList[i],
                    "version": versionList[i],
                    "dateTest": dateTestList[i],
                    "dateBegin": dateBeginList[i],
                    "dateEnd": dateEndList[i],
                    "files": [
                        {"id": fileIdList[i]}
                    ]
                }
            )

            webPathList.append(test.file)
            resultList.append(test.resultData)
            startCashList.append(test.startCash)
            endCashList.append(test.endCash)

            fileList.append(
                {
                    "web_path": webPathList[i],
                    "startCash": startCashList[i],
                    "endCash": endCashList[i],
                    "resultData": resultList[i]
                }
            )

            i += 1

        strategyTests = {
            "data":
                dataList,
            "files": {
                "files": fileList
            }
        }

        return strategyTests
    else:
        return None

def getGraphPath(graphName: str) -> str:
    '''
    Get result's of Test Graph path
    :param graphName: Name of Graph
    :return: Path to Graph in directory
    '''
    return  os.path.join(os.path.abspath(os.path.dirname(__file__)), f'{settings.BASE_DIR}/testManager/resultGraphs/{graphName}')

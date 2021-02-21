from datetime import datetime

from testManager.models import TestModel
from strategyManager.models import StrategyModel
from dataManager.models import DataIntervalModel


def saveStatusInfo(taskId: str):
    '''
    Save backtest status info in db
    :param taskId: Unique identifier string for the Test, that uses in async functions in Backtest
    :return: -
    '''
    # Updating the Test in database, add status
    testModel = TestModel.objects.get(uuid=taskId)
    testModel.tstStatus = testModel.backtest.getStatus(taskId=taskId)
    testModel.save()

def getStatusInfo(taskId: str) -> str:
    '''
    Get backtest status info for Test with uuid
    :param taskId: Unique identifier string for the Test, that uses in async functions in Backtest
    :return: Status of the Test
    '''
    try:
        testModel = TestModel.objects.get(uuid=taskId)
        testStatus = testModel.backtest.getStatus(taskId=taskId)

        return testStatus
    except:
        return 'STARTED'

def initTestInfo(taskId: str, strategyId: int, dataId: int) -> tuple:
    '''
    Init Test info, save start Test's info in db
    :param taskId:
    :param strategyId:
    :param dataId:
    :return: Tuple of Test's info parameters
    '''
    # Get data from Strategy
    strategy = StrategyModel.objects.get(id=strategyId)
    strategyName = strategy.name
    version = strategy.version

    # Get data from DataInterval
    data = DataIntervalModel.objects.get(id=dataId)
    ticker = data.ticker
    candleLength = data.candleLength
    dateBegin = data.dateBegin
    dateEnd = data.dateEnd

    # Create model of the Test with data that hoes from request
    testModel = TestModel(strategyId=strategyId, name=strategyName, uuid=taskId, dateBegin=dateBegin, dateEnd=dateEnd,
                          dateTest=datetime.today().strftime('%Y-%m-%d'), ticker=ticker, version=version)
    testModel.save()

    return strategyName, version, ticker, candleLength, dateBegin, dateEnd, testModel

from typing import Any, Dict, Tuple, Type

from backtrader import Strategy
from pandas import DataFrame

from .backtraderWrapper import Wrapper
from .const import taskStatus


class BacktestManager:
    """Class to manage all backtest tasks"""

    def __init__(self):
        # dictionary to store every backtrader wrapper that will do all the backtest job
        self.tasks: Dict[Any, Wrapper] = dict()

    def createTask(self, taskId: Any, strategyFilePath: str, data: DataFrame, plotFilePath: str) -> None:
        """Create task for backtest
        :param plotFilePath: path to file where to store plot. will be created, if doesn't exist.
            will be overwritten otherwise
        :param data: data for backtest
        :param strategyFilePath: filepath to strategy to test
        :parameter taskId: id of the new task
        :raise ValueError: in case of wrong taskId or any other parameter
        """
        # check if task is already exists
        if taskId in self.tasks:
            raise ValueError('task is already created')

        # create new task
        newTask = Wrapper(strategyFilePath=strategyFilePath, data=data, plotFilePath=plotFilePath)
        # store it
        self.tasks[taskId] = newTask

    def run(self, taskId: Any) -> None:
        """Run task
        :param taskId: id of the task"""

        # check if task is created
        if taskId not in self.tasks:
            raise ValueError('there is no tasks with such id')
        # run
        self.tasks[taskId].run()

    def pause(self, taskId: Any) -> None:
        """Pause task
        :param taskId: id of the task"""
        raise NotImplementedError('It is for future features. Not implemented.')

    def stop(self, taskId: Any) -> None:
        """Stop task
        :param taskId: id of the task"""
        raise NotImplementedError('It is for future features. Not implemented.')

    def getStatus(self, taskId: Any) -> [taskStatus.STOPPED,
                                         taskStatus.RUNNING,
                                         taskStatus.PAUSED,
                                         taskStatus.CREATED,
                                         taskStatus.DONE,
                                         taskStatus.ERROR]:
        """Get task status
        :param taskId: id of the task
        :return: status of the task"""

        # check if task is created
        if taskId not in self.tasks:
            raise ValueError('there is no tasks with such id')
        # get status
        return self.tasks[taskId].getStatus()

    def getResult(self, taskId: Any) -> Tuple[float, float, str, str]:
        """Get results
        :param taskId: id of the task
        :return: tuple of results - (start cash, end cash, output, plot filepath)"""

        # check if task is created
        if taskId not in self.tasks:
            raise ValueError('there is no tasks with such id')
        # get status
        return self.tasks[taskId].getResult()

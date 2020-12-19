from typing import Any, Dict, Tuple
from .backtraderWrapper import Wrapper

from testManager.backtest.const import taskStatus


class BacktestManager:
    """Class to manage all backtest tasks"""

    def __init__(self):
        # dictionary to store every backtrader wrapper that will do all the backtest job
        self.tasks: Dict[Any, Wrapper] = dict()

    def createTask(self, taskId: Any, *args, **kwargs) -> None:
        """Create task for backtest
        :parameter taskId: id of the new task
        :parameter *args, **kwargs: all the other parameters that will be passed to backtrader wrapper
        :raise ValueError: in case of wrong taskId or any other parameter
        """
        # check if task is already exists
        if taskId not in self.tasks:
            # raise exception
            raise ValueError("backtest task with this id is already exists")

        # create new task
        newTask = Wrapper(*args, **kwargs)
        # store it
        self.tasks[taskId] = newTask

    def run(self, taskId: Any) -> None:
        """Run task
        :param taskId: id of the task"""
        pass

    def pause(self, taskId: Any) -> None:
        """Pause task
        :param taskId: id of the task"""
        pass

    def stop(self, taskId: Any) -> None:
        """Stop task
        :param taskId: id of the task"""
        pass

    def getStatus(self, taskId: Any) -> [taskStatus.STOPPED,
                                         taskStatus.RUNNING,
                                         taskStatus.PAUSED,
                                         taskStatus.CREATED,
                                         taskStatus.DONE,
                                         taskStatus.ERROR]:
        """Get task status
        :param taskId: id of the task
        :return: status of the task"""
        pass

    def getResult(self, taskId: Any) -> Tuple[Any, Any]:
        """Get results
        :param taskId: id of the task
        :return: tuple of results - (output string, plot)"""
        pass


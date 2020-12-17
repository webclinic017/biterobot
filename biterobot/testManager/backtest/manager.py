from typing import Any, Dict
from backtraderWrapper import Wrapper

from testManager.backtest.const.taskStatus import STOPPED, RUNNING, PAUSED


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
        pass

    def pause(self, taskId: Any) -> None:
        pass

    def stop(self, taskId: Any) -> None:
        pass

    def getStatus(self, taskId: Any) -> [STOPPED, RUNNING, PAUSED]:
        pass

    def getResult(self, taskId: Any) -> Any:
        pass


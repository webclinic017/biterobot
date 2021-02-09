import os

from pandas import read_csv

from testManager.backtest.manager import BacktestManager
from testManager.backtest.const import taskStatus

import unittest

CURRENT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEST_STRATEGY_PATH = os.path.join(CURRENT_DIR, "tests/folder/TestStrategy.py")
PLOT_PATH = os.path.join(CURRENT_DIR, "tests/folder/plot.html")


class TestTestManager(unittest.TestCase):
    datapath = './orcl-1995-2014.txt'
    dataframe = read_csv(datapath,
                         parse_dates=True,
                         index_col=0)

    def test_createTask(self):
        manager = BacktestManager()
        taskId = 1
        manager.createTask(taskId, TEST_STRATEGY_PATH, self.dataframe, PLOT_PATH)

    def test_run(self):
        manager = BacktestManager()
        taskId = 1
        manager.createTask(taskId, TEST_STRATEGY_PATH, self.dataframe, PLOT_PATH)
        manager.run(1)
        manager.tasks[1].process.join()
        print('Status has to be Done. Current status: {}'.format(manager.getStatus(1)))
        assert manager.getStatus(1) == taskStatus.DONE
        print('Result has to be filled. Current result: {}'.format(manager.getResult(1)))
        assert manager.getResult(1) is not None


import sys

from pandas import read_csv

from testManager.backtest.manager import BacktestManager

import unittest


class TestTestManager(unittest.TestCase):
    datapath = './orcl-1995-2014.txt'
    dataframe = read_csv(datapath,
                         parse_dates=True,
                         index_col=0)

    def test_createTask(self):
        manager = BacktestManager()
        taskId = 1
        manager.createTask(taskId, "./folder/TestStrategy.py", self.dataframe, './plot.html')

    def test_run(self):
        manager = BacktestManager()
        taskId = 1
        manager.createTask(taskId, "C:/Kethavel/Projects/BiteRobot/biterobot/testManager/backtest/tests/folder"
                                   "/TestStrategy.py", self.dataframe, "C:/Kethavel/Projects/BiteRobot/biterobot/testManager/backtest/tests/folder"
                                   "/plot.html")
        manager.run(1)

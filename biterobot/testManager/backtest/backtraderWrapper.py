import contextlib
import importlib.util
import io
import sys
from multiprocessing import Process, Manager
# Import the backtrader platform
from typing import Union, Callable, Type

import backtrader as bt
from backtrader_plotting import Bokeh
from pandas import DataFrame

from testManager.backtest.const import taskStatus


def runBacktestParallel(cerebro: bt.Cerebro, strategyFilePath: str, result: dict, plotFilePath: str):
    spec = importlib.util.spec_from_file_location("strategy_module", strategyFilePath)
    foo = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(foo)
    sys.modules["strategy_module"] = foo
    cerebro.addstrategy(foo.Strategy)
    output = io.StringIO()
#    result['startCash'] = cerebro.broker.getvalue()
    with contextlib.redirect_stdout(output):
        cerebro.run()
        # b = Bokeh(style='bar', output_mode='save', filename=plotFilePath)
        # cerebro.plot(b)
    output.seek(0)
    # result['endCash'] = cerebro.broker.getvalue()
    # result['output'] = output.getvalue()
    output.close()


class Wrapper:
    def __init__(self, strategyFilePath: str, data: DataFrame, plotFilePath: str,
                 startCash: int = 1000, commission: float = 0):
        # attributes for backtrader
        # spec = importlib.util.spec_from_file_location("strategy_module", strategyFilePath)
        # foo = importlib.util.module_from_spec(spec)
        # spec.loader.exec_module(foo)
        self.strategyFilePath: str = strategyFilePath
        self.data: bt.feeds.PandasData = bt.feeds.PandasDirectData(dataname=data)
        self.startCash: int = startCash
        self.comission: float = commission
        self.plotFilePath: str = plotFilePath

        # attributes for manage process
        self.process: Union[Process, None] = None
        self.manager: Manager = Manager()
        self.result: dict = self.manager.dict()
        self.targetToRun: Callable
        self.status = taskStatus.CREATED

        # init cerebro
        self.cerebro: bt.Cerebro = bt.Cerebro()
        # add strategy
        # self.cerebro.addstrategy(self.strategy)
        # add data
        self.cerebro.adddata(self.data)
        # define start cash
        self.cerebro.broker.setcash(self.startCash)
        # Set the commission
        self.cerebro.broker.setcommission(commission=self.comission)

    def run(self):
        """Run backtest"""

        # check if thread is already exists
        if self.process is None:
            # create if so
            self.process = Process(target=runBacktestParallel, args=(self.cerebro, self.strategyFilePath,
                                                                     self.result, self.plotFilePath))
        # run
        self.process.start()
        # change status
        self.status = taskStatus.RUNNING

    def getStatus(self):
        """
        Get status of backtest
        :return: one of the taskStatus
        """
        # if task was started
        if self.status == taskStatus.RUNNING:
            # but process is not alive
            if not self.process.is_alive():
                # means it is finished
                # if exitcode is 0
                if self.process.exitcode == 0:
                    # it is done correctly
                    self.status = taskStatus.DONE
                else:
                    # else - some error occurred
                    self.status = taskStatus.ERROR

        # now we have proper status and can return it
        return self.status

    def getResult(self):
        """
        Get output from backtest testing
        :return: result of backtesting
        """
        if self.getStatus() == taskStatus.DONE:
            return self.result['startCash'], self.result['endCash'], self.result['output'], self.plotFilePath
        else:
            return None

    def pause(self):
        pass

    def stop(self):
        pass

if __name__ == '__main__':
    runBacktestParallel(None, "C:/Kethavel/Projects/BiteRobot/biterobot/testManager/backtest/tests/folder"
                                   "/TestStrategy.py", None, None)

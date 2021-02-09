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

from .const import taskStatus


def runBacktestParallel(init: dict, result: dict) -> None:
    """
    Function to run backtest. Using with multiprocessing
    :param init: dict with initial parameters
    :param result: dict with results to return
    :return: None
    """
    # load strategy type
    spec = importlib.util.spec_from_file_location("strategy_module", init['strategyFilePath'])
    strategy_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(strategy_module)
    sys.modules["strategy_module"] = strategy_module

    # create backtrader.cerebro
    # init cerebro
    cerebro = bt.Cerebro()
    # add strategy
    cerebro.addstrategy(strategy_module.Strategy)
    # add data
    cerebro.adddata(init['data'])
    # define start cash
    cerebro.broker.setcash(init['startCash'])
    # Set the commission
    cerebro.broker.setcommission(commission=init['comission'])

    # define output to redirect stdout and return it
    output = io.StringIO()
    # start portfolio value
    result['startCash'] = cerebro.broker.getvalue()
    # redirect stdout
    with contextlib.redirect_stdout(output):
        # run backtest
        cerebro.run()
        # create plot
        b = Bokeh(style='bar', output_mode='save', filename=init['plotFilePath'])
        cerebro.plot(b)
    # end portfolio value
    result['endCash'] = cerebro.broker.getvalue()
    # go to beginning of the output
    output.seek(0)
    # save output
    result['output'] = output.getvalue()
    output.close()


class Wrapper:
    def __init__(self, strategyFilePath: str, data: DataFrame, plotFilePath: str,
                 startCash: int = 1000, commission: float = 0):
        # attributes for backtrader
        self.init = dict()
        self.init['strategyFilePath']: str = strategyFilePath
        self.init['data']: bt.feeds.PandasData = bt.feeds.PandasDirectData(dataname=data)
        self.init['startCash']: int = startCash
        self.init['comission']: float = commission
        self.init['plotFilePath']: str = plotFilePath

        # attributes for manage process
        self.process: Union[Process, None] = None
        self.manager: Manager = Manager()
        self.result: dict = self.manager.dict()
        self.targetToRun: Callable
        self.status = taskStatus.CREATED

    def run(self):
        """Run backtest"""

        # check if thread is already exists
        if self.process is None:
            # create if so
            self.process = Process(target=runBacktestParallel, args=(self.init, self.result))
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
            return self.result['startCash'], self.result['endCash'], self.result['output'], self.init['plotFilePath']
        else:
            return None

    def pause(self):
        pass

    def stop(self):
        pass

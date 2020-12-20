import datetime
import backtrader as bt

from testManager.backtest.manager import BacktestManager
from testManager.backtest.tools import checkStrategy


class TestStrategy1(bt.Strategy):

    def log(self, txt, dt=None):
        ''' Logging function for this strategy'''
        dt = dt or self.datas[0].datetime.date(0)
        print('%s, %s' % (dt.isoformat(), txt))

    def __init__(self):
        # Keep a reference to the "close" line in the data[0] dataseries
        self.dataclose = self.datas[0].close

    def nextdfvnb(self):
        # Simply log the closing price of the series from the reference
        self.log('Close, %.2f' % self.dataclose[0])


# Create a Stratey
class TestStrategy2(bt.Strategy):
    params = (
        ('maperiod', 15),
    )

    def log(self, txt, dt=None):
        ''' Logging function fot this strategy'''
        dt = dt or self.datas[0].datetime.date(0)
        print('%s, %s' % (dt.isoformat(), txt))

    def __init__(self):
        # Keep a reference to the "close" line in the data[0] dataseries
        self.dataclose = self.datas[0].close

        # To keep track of pending orders and buy price/commission
        self.order = None
        self.buyprice = None
        self.buycomm = None

        # Add a MovingAverageSimple indicator
        self.sma = bt.indicators.SimpleMovingAverage(
            self.datas[0], period=self.params.maperiod)

        # Indicators for the plotting show
        bt.indicators.ExponentialMovingAverage(self.datas[0], period=25)
        bt.indicators.WeightedMovingAverage(self.datas[0], period=25,
                                            subplot=True)
        bt.indicators.StochasticSlow(self.datas[0])
        bt.indicators.MACDHisto(self.datas[0])
        rsi = bt.indicators.RSI(self.datas[0])
        bt.indicators.SmoothedMovingAverage(rsi, period=10)
        bt.indicators.ATR(self.datas[0], plot=False)

    def notify_order(self, order):
        if order.status in [order.Submitted, order.Accepted]:
            # Buy/Sell order submitted/accepted to/by broker - Nothing to do
            return

        # Check if an order has been completed
        # Attention: b  roker could reject order if not enough cash
        if order.status in [order.Completed]:
            if order.isbuy():
                self.log(
                    'BUY EXECUTED, Price: %.2f, Cost: %.2f, Comm %.2f' %
                    (order.executed.price,
                     order.executed.value,
                     order.executed.comm))

                self.buyprice = order.executed.price
                self.buycomm = order.executed.comm
            else:  # Sell
                self.log('SELL EXECUTED, Price: %.2f, Cost: %.2f, Comm %.2f' %
                         (order.executed.price,
                          order.executed.value,
                          order.executed.comm))

            self.bar_executed = len(self)

        elif order.status in [order.Canceled, order.Margin, order.Rejected]:
            self.log('Order Canceled/Margin/Rejected')

        # Write down: no pending order
        self.order = None

    def notify_trade(self, trade):
        if not trade.isclosed:
            return

        self.log('OPERATION PROFIT, GROSS %.2f, NET %.2f' %
                 (trade.pnl, trade.pnlcomm))

    def next(self):
        # Simply log the closing price of the series from the reference
        self.log('Close, %.2f' % self.dataclose[0])

        # Check if an order is pending ... if yes, we cannot send a 2nd one
        if self.order:
            return

        # Check if we are in the market
        if not self.position:

            # Not yet ... we MIGHT BUY if ...
            if self.dataclose[0] > self.sma[0]:
                # BUY, BUY, BUY!!! (with all possible default parameters)
                self.log('BUY CREATE, %.2f' % self.dataclose[0])

                # Keep track of the created order to avoid a 2nd order
                self.order = self.buy()

        else:

            if self.dataclose[0] < self.sma[0]:
                # SELL, SELL, SELL!!! (with all possible default parameters)
                self.log('SELL CREATE, %.2f' % self.dataclose[0])

                # Keep track of the created order to avoid a 2nd order
                self.order = self.sell()


if __name__ == '__main__':
    from pandas import DataFrame
    import time
    import pandas

    rawData = DataFrame({'datetime:': [datetime.datetime(year=1995, month=1, day=1)],
                         'open': [2.179012],
                         'high': [2.191358],
                         'low': [2.117284],
                         'close': [1.883304],
                         'volume': [36301200],
                         'openinterest': [36301200]})

    # rawData.append(1995-01-03,2.179012,2.191358,2.117284,2.117284,1.883304,36301200)

    # data = bt.feeds.PandasDirectData(dataname=rawData)

    datapath = './2006-day-001.txt'

    dataframe = pandas.read_csv(datapath,
                                parse_dates=True,
                                index_col=0)

    # data = bt.feeds.PandasDirectData(dataname=dataframe)
    data = bt.feeds.PandasData(dataname=rawData, datetime=0)

    # Plot the result
    # cerebro.plot()
    print(checkStrategy(TestStrategy2))
    print(checkStrategy(TestStrategy1))
    print('ok, now it is a manager time')
    manager = BacktestManager()
    manager.createTask(1, TestStrategy2, dataframe,
                       plotFilePath='F:/Kethavel/Documents/Projects/Python/BiteRobot/biterobot/testManager/backtest'
                                    '/savefig.html')
    manager.run(1)
    print(manager.getStatus(1))
    print(manager.getResult(1))
    time.sleep(5)
    print(manager.getStatus(1))
    print(manager.getResult(1))
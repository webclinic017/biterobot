from .backtest import wrapper


def testInit():
    strategyClass = 0
    wrapper.strategyHandler(strategyClass)

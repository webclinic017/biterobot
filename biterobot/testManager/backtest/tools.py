from typing import Any

from backtrader import Strategy


def checkStrategy(strategy: Any) -> bool:
    """
    Checks if strategy is created properly
    :param strategy: class of strategy to check
    :return: True if it is ok
    :raise ValueError: if it is not
    """
    if not issubclass(strategy, Strategy):
        raise ValueError('Strategy has to be a subclass of backtrader.Strategy')
    return True

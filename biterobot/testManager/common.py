import importlib.util

from .backtest import manager


def testInit(strategyPath, taskId):
    spec = importlib.util.spec_from_file_location("TestStrategy",
                                                  strategyPath)
    foo = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(foo)

    print("STRATEGY CLASS - ", foo.TestStrategy)  # Печать класса для теста работы
    print("TASK ID - ", taskId)

    backtest = manager.BacktestManager()

    backtest.createTask(taskId, foo.TestStrategy)

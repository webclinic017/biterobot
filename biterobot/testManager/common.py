from .backtest import wrapper
import importlib.util

def testInit(strategyClass):
    spec = importlib.util.spec_from_file_location("TestStrategy",
                                                  "C:\\Users\\uzer\Desktop\BitBot-Технологии разработки\TestStrategy.py")
    foo = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(foo)

    wrapper.strategyHandler(foo.TestStrategy)

import importlib.util

def testInit(strategyClass):
    spec = importlib.util.spec_from_file_location("TestStrategy",
                                                  "path")
    foo = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(foo)

    #wrapper.strategyHandler(foo.TestStrategy)

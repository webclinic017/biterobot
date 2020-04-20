from database import Database
from backtest import Backtest
from testStrategy import OnlySellStrategy
from userStrategy import ExampleStrategy
from type import TimeRange
from datetime import datetime, timedelta

if __name__ == '__main__':
    print('BitBot starts')
    # db = Database("mssql", "localhost", "BitBot", "user", "password")
    db = Database("sqlite", "", "../resources/db/sqlite3/bitbot_sqlalchemytest2.db")
    tester = Backtest(ExampleStrategy(),
                      TimeRange(datetime(2016, 1, 1, 0, 0, 0, 0) + timedelta(minutes=10) - timedelta(hours=3),
                                datetime(2016, 1, 1, 2, 0, 0, 0) - timedelta(hours=3)),
                      'bitmex', 'BTC/USD', 1000.0, 0.0, 3, db)
    result = tester.startTest()
    for item in result:
        print(item + ':  ' + str(result[item]))
        #  except Exception as exc:
        # print("Something went wrong")
    #    print(exc)
    #    exit()

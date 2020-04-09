from database import Database
from backtest import Backtest
from testStrategy import OnlySellStrategy
from userStrategy import ExampleStrategy
from type import TimeRange
from datetime import datetime


if __name__ == '__main__':
    print('BitBot starts')
    try:
        # db = Database("mssql", "localhost", "BitBot", "user", "password")
        db = Database("sqlite", "", "../resources/db/sqlite3/bitbot_sqlalchemytest2.db")
        tester = Backtest(OnlySellStrategy(), TimeRange(datetime(2016, 5, 5, 0, 0, 0), datetime(2016, 5, 5, 7, 30, 0)),
                          1000.0, 0.0, db)
        result = tester.startTest()
        for item in result:
            print(item + ':  ' + str(result[item]))
    except Exception as exc:
        print("Something went wrong")
        print(exc)
        exit()

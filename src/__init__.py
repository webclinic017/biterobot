from database import Database
from backtest import Backtest
from testStrategy import OnlySellStrategy
from userStrategy import ExampleStrategy
from type import TimeRange
from datetime import datetime


def main():
    print('BitBot starts')
    try:
        db = Database("mssql", "localhost", "BitBot", "user", "password")
        # db = Database("sqlite3", "../resources/db/sqlite3/bitbot.db", "", "")
    except Exception as exc:
        print("Something went wrong with your database")
        print(exc)
        return
    tester = Backtest(ExampleStrategy(), TimeRange(datetime(2016, 5, 5, 7, 10, 0), datetime(2016, 5, 5, 7, 30, 0)),
                      1000.0, 0.0, db)
    result = tester.startTest()
    for item in result:
        print(item + ':  ' + str(result[item]))


if __name__ == '__main__':
    main()

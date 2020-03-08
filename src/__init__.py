from database import Database
from backtest import Backtest
from userStrategy import ExampleStrategy
from type import TimeRange


def main():
    print('BitBot starts')
    try:
        database = Database("mssql", "localhost", "BitBot", "user", "password")
        #database = Database("sqlite3", "../resources/db/sqlite3/bitbot.db", "", "")
    except Exception as exc:
        print("Something went wrong with your database")
        print(exc)
        return
    tester = ArchiveDataTest(testStrategy.OnlySellStrategy(),
                             TimeRange(datetime(2016, 5, 5, 7, 0, 0), datetime(2016, 5, 5, 7, 30, 0)),
                             1000.0, 0.0, database)
    result = tester.startTest()
    for item in result:
        print(item + ':  ' + str(result[item]))


if __name__ == '__main__':
    main()

from dataBase import DataBase
from datetime import datetime
from archiveDataTest import ArchiveDataTest
from exampleStrategy import ExampleStrategy
import testStrategy
from type import TimeRange


def main():
    print('BitBot starts')
    try:
        database = DataBase("localhost", "BitBot", "user", "password")
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

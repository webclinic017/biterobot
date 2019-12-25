from dataBase import DataBase
from archiveDataTest import ArchiveDataTest
import testStrategy
import userStrategy
from type import TimeRange
from src.exampleStrategy import ExampleStrategy


def main():
    print('BitBot starts')
    try:
        database = DataBase("UZER\SQLEXPRESS", "BitBot", "user", "password")
    except Exception as exc:
        print("Something went wrong with your database\n")
        print(exc)
        return
    tester = ArchiveDataTest(ExampleStrategy(), TimeRange(), 1000.0, 0.0, database)
    result = tester.startTest()
    for item in result:
        print(item + ':  ' + str(result[item]))


if __name__ == '__main__':
    main()

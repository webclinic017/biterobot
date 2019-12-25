import unittest
from type import TimeRange
from type import TickType
import random
import datetime
from dataBase import DataBase

from src import testStrategy
from src.archiveDataTest import ArchiveDataTest
from src.data import Data


class MyTestCase(unittest.TestCase):

    def test_DataClass(self):
        a = datetime.datetime(2016, 5, 5, 7, 0, 0)
        b = datetime.datetime(2016, 5, 5, 7, 30, 0)
        tr = TimeRange()
        tr.beginTime = a
        tr.endTime = b

        dataBase = DataBase("UZER\SQLEXPRESS", "BitBot", "user", "password")

        data = Data(tr, dataBase)

        currentTick = data.getTick()
        tickQueue = data.fillQueue()

        # Тестирование основных функций класса Data

        self.assertEqual(currentTick.Id, 25)
        self.assertEqual(currentTick.Price,446.1)  # Текущий курс
        self.assertEqual(currentTick.Amount, 716.0)  # Купленное количество
        self.assertEqual(tickQueue[0].Id, 26)  # Первый id тика из очереди
        self.assertEqual(tickQueue[1].Price, 447.47)  # Вторая Ызапись в очереди - текущий курс
        self.assertEqual(tickQueue[1].Amount, 902.0)  # Вторая запись из очереди - купленное количество
        self.assertEqual(data.timeCount(), datetime.timedelta(seconds=1800))  # Диапазон времени на котором работаем

    def test_Strategy(self):
        dataBase = DataBase("UZER\SQLEXPRESS", "BitBot", "user", "password")

        tester = ArchiveDataTest(testStrategy.OnlySellStrategy(), TimeRange(), 1000.0, 1000.0, dataBase)
        result = tester.startTest()

        # Тестирование стратегии

        self.assertEqual(result, {'amountOfBadTrades': 0,  # Стратегия на продажу
                                  'amountOfBuys': 0,
                                  'amountOfGoodTrades': 0,
                                  'amountOfSells': 0,
                                  'amountOfTrades': 0,
                                  'endBTCwallet': 1000.0,
                                  'endUSDwallet': 1000.0,
                                  'endWalletValue': 447100.0,
                                  'maxWalletValue': 447100.0,
                                  'minWalletValue': 447100.0,
                                  'result': 0.0,
                                  'startBTCwallet': 1000.0,
                                  'startUSDwallet': 1000.0,
                                  'startWalletValue': 447100.0,
                                  'verdict': 'Unprofitable.'})

        tester = ArchiveDataTest(testStrategy.BrokenStrategy(), TimeRange(), 1000.0, 0.0, dataBase)
        result = tester.startTest()

        self.assertEqual(result, {'amountOfBadTrades': 0,  # Сломанная стратегия, которая ничего не делает
                                  'amountOfBuys': 0,
                                  'amountOfGoodTrades': 0,
                                  'amountOfSells': 0,
                                  'amountOfTrades': 0,
                                  'endBTCwallet': 0.0,
                                  'endUSDwallet': 1000.0,
                                  'endWalletValue': 1000.0,
                                  'maxWalletValue': 1000.0,
                                  'minWalletValue': 1000.0,
                                  'result': 0.0,
                                  'startBTCwallet': 0.0,
                                  'startUSDwallet': 1000.0,
                                  'startWalletValue': 1000.0,
                                  'verdict': 'Unprofitable.'})

if __name__ == '__main__':
    unittest.main()

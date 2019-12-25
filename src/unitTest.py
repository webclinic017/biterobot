import unittest
from type import TimeRange
from type import TickType
import random
import datetime
from dataBase import DataBase

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

        self.assertEqual(currentTick[0], 25)
        self.assertEqual(currentTick[4],446.1)  # Текущий курс
        self.assertEqual(currentTick[5], 716.0)  # Купленное количество
        self.assertEqual(tickQueue[0][0], 26)  # Первый id тика из очереди
        self.assertEqual(tickQueue[1][4], 447.47)  # Вторая Ызапись в очереди - текущий курс
        self.assertEqual(tickQueue[1][5], 902.0)  # Вторая запись из очереди - купленное количество
        self.assertEqual(data.timeCount(), datetime.timedelta(seconds=1800))  # Диапазон времени на котором работаем



if __name__ == '__main__':
    unittest.main()

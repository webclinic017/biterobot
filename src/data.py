from type import TimeRange, Need, TickType
from datetime import datetime
from database import Database


# TODO: мб сделать это класс iterable?
class Data:
    """Класс данных для обработки тиков

    В классе реализованы функции для работы с данными по сделкам - тиками
    """

    def __init__(self, timeRange: TimeRange, exchange: str, ticker: str, dataBase: Database):
        """Конструктор класса данных

        Args:
            timeRange: Временной промежуток, на котором работаем с данными
            dataBase: База данных, с которой работаем
            neededByStrategy: Какие данные нужны для старта проверки стратегии
        """

        self.timeRange = timeRange
        self.database = dataBase
        self.queue = self.database.getTicks(exchange, ticker, self.timeRange)
        if len(self.queue) == 0:
            raise ValueError("Database doesn't have any data in this timerange. "
                             "Download it or try again with another timerange.")
        self.queueIterator = iter(self.queue)

    def getTick(self) -> TickType:
        """Получение тика из БД

        Args:
            dataBase: База данных, с которой работаем

        Returns:
            Текущий тик из БД
        """
        try:
            tick = next(self.queueIterator)
        except StopIteration as e:
            tick = None
        return tick

    def fillQueue(self) -> list[TickType]:
        """Создание очереди тиков

        Очередь создается на основе тиков из требуемого промежутка времени (см. __init__ -> Arg: timeRange)

        Returns:
            Требуемую очередь тиков
        """

        self.queue = []
        tickCount = 0
        currentTick = self.getTick()
        while (currentTick != None):  # Когда getTick() вернет None => последний тик в данном диапазоне
            self.queue.append(currentTick)
            tickCount += 1
            currentTick = self.getTick()
        return self.queue

    def clearQueue(self):
        """Очищение очереди тиков

        """

        self.queue.clear()

    def timeCount(self) -> TimeRange:
        """Расчет времение из промежутка

        Вычисляется разница между двумя точками на временном промежутке

        Returns:
            Дельту временного промежутка

        """

        delta = self.timeRange.endTime - self.timeRange.beginTime
        return delta

    def getTimeRange(self) -> TimeRange:
        """Получение временного промежутка

        Returns:
            Временной промежуток (см. __init__ -> Arg: timeRange)
        """

        return self.timeRange


# TESTING#
if __name__ == "__main__":
    print("__________DATA_TEST_________")

    tr = TimeRange(datetime(2016, 5, 5, 7, 1, 0), datetime(2016, 5, 5, 7, 20, 0))

    dataBase = Database("sqlite", "", "../resources/db/sqlite3/bitbot_sqlalchemytest2.db")

    data = Data(tr, dataBase)

    print("randomTick =", data.getTick())
    print("generatedQueue =", data.fillQueue())
    print("deltaTime =", data.timeCount())

# РАБОТАЕТ ГЕНЕРАЦИЯ ТИКА
# РАБОТАЕТ ГЕНЕРАЦИЯ ОЧЕРЕДИ С ЗАДАННЫМ ДИАПАЗОНОМ
# РАБОТАЕТ РАСЧЕТ ДЕЛЬТЫ ЗАДАННОГО ВРЕМЕНИ

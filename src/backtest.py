from data import Data
from database import Database
from process import Process
from type import Need, TimeRange, Strategy


class Statistics:
    """Статистика по сделкам

    """

    # TODO: переписать эту херню. она больше не работает т.к. добавилась маржиналка
    def __init__(self, startQuoteAmount: float, startBaseAmount: float, leverage: float):
        self.startWalletValue = 0
        self.startQuoteAmount = startQuoteAmount
        self.startBaseAmount = startBaseAmount
        self.leverage = leverage
        self.endWalletValue = 0
        self.endQuoteAmount = startQuoteAmount
        self.endBaseAmount = startBaseAmount
        self.amountOfSells = 0
        self.amountOfBuys = 0
        self.maxWalletValue = 0
        self.minWalletValue = 0
        self.amountOfGoodTrades = 0
        self.amountOfBadTrades = 0
        self.lastBuyPrice = 0

    def setFirstPrice(self, price: float):
        if self.leverage > 0:
            self.maxWalletValue = self.minWalletValue = self.startWalletValue = self.endWalletValue = \
                self.startQuoteAmount + self.startBaseAmount * price / self.leverage
        else:
            self.maxWalletValue = self.minWalletValue = self.startWalletValue = self.endWalletValue = \
                self.startQuoteAmount + self.startBaseAmount * price

    def addTrade(self, tradeDirection: str, price: float, BaseAmount: float,
                 baseCurrencyBalance: float, quoteCurrencyBalance: float):
        # print(tradeDirection + ' ' + str(BaseAmount) + ' at ' + str(price) + '. Now base:' +
        #      str(baseCurrencyBalance) + ' , quote:' + str(quoteCurrencyBalance))
        if tradeDirection == 'BUY':
            self.amountOfBuys += 1
        elif tradeDirection == 'SELL':
            self.amountOfSells += 1
        self.endBaseAmount = baseCurrencyBalance
        self.endQuoteAmount = quoteCurrencyBalance

    def getStatistics(self):
        if self.endQuoteAmount - self.startWalletValue > 0:
            verdict = "Profitable!"
        else:
            verdict = "Unprofitable."
        return {'start quote wallet': self.startQuoteAmount,
                'start base wallet': self.startBaseAmount,
                # 'start wallet value': self.startWalletValue,
                'end quote wallet': self.endQuoteAmount,
                'end base wallet': self.endBaseAmount,
                # 'end wallet value': self.endWalletValue,
                'sells': self.amountOfSells,
                'buys': self.amountOfBuys,
                # 'max wallet value': self.maxWalletValue,
                # 'min wallet value': self.minWalletValue,
                # 'amount Of good trades': self.amountOfGoodTrades,
                # 'amount Of bad trades':  self.amountOfBadTrades,
                'amount Of trades': self.amountOfBadTrades + self.amountOfGoodTrades,
                'result': self.endQuoteAmount - self.startWalletValue,
                'verdict': verdict}


class Backtest:
    """Тестирование на архивных данных

    """

    def __init__(self, strategy: Strategy, timerange: TimeRange, exchange: str, ticker: str,
                 quoteCurrencyAmount: float, baseCurrencyAmount: float, leverage: float,
                 db: Database):
        self.strategy = strategy
        self.timerange = timerange
        self.startQuoteCurrency = quoteCurrencyAmount
        self.startBaseCurrency = baseCurrencyAmount
        self.process = Process(self.startQuoteCurrency, self.startBaseCurrency,
                               self.strategy.eventPercent, self.strategy.lossPercent, leverage)
        self.data = Data(self.timerange, exchange, ticker, db)
        if hasattr(self.strategy, "needForStart"):
            self.prepareForStrategy = self.strategy.needForStart.getNeededData()
            if self.prepareForStrategy[0] == Need.TICKS_WITH_TIMEDELTA:
                self.prepareData = Data(TimeRange(self.timerange.beginTime - self.prepareForStrategy[1],
                                                  self.timerange.beginTime),
                                        exchange, ticker, db)
            else:
                raise NotImplementedError()
        else:
            self.prepareForStrategy = None
        self.statistics = Statistics(self.startQuoteCurrency, self.startBaseCurrency, leverage)

    def startTest(self):
        # передаем данные для подготовки в стратегию
        if self.prepareForStrategy is not None:
            if self.prepareForStrategy[0] == Need.TICKS_WITH_TIMEDELTA:
                currentTick = self.prepareData.getTick()
                while currentTick:
                    if self.strategy.prepareForBacktest(currentTick) == 1:
                        break
                    currentTick = self.prepareData.getTick()
            else:
                # TODO: добавить поддержку подготовки стратегии со свечами
                raise NotImplementedError()
        # после чего начинаем тест
        currentTick = self.data.getTick()
        lastPrice = currentTick.price
        self.statistics.setFirstPrice(currentTick.price)
        while currentTick:
            # TODO: добавить проверку stop-loss и ликвидации баланса
            decision, stopPrice = self.strategy.getDecision(currentTick)
            if decision is None:
                currentTick = self.data.getTick()
                continue

            if decision == "BUY":
                # покупаем
                buyAmount = self.process.buy(currentTick.price, stopPrice)
                # заполняем статистику
                self.statistics.addTrade("BUY", currentTick.price, buyAmount,
                                         self.process.getBaseAmount(), self.process.getQuoteAmount())
            elif decision == "SELL":
                # продаем
                sellAmount = self.process.sell(currentTick.price, stopPrice)
                # заполняем статистику
                self.statistics.addTrade("SELL", currentTick.price, sellAmount,
                                         self.process.getBaseAmount(), self.process.getQuoteAmount())
            elif decision == "CANCEL":
                # закрываем сделку
                cancelAmount = self.process.cancelPosition(currentTick.price)
                # заполняем статистику
                self.statistics.addTrade("CANCEL", currentTick.price, cancelAmount,
                                         self.process.getBaseAmount(), self.process.getQuoteAmount())
            lastPrice = currentTick.price
            currentTick = self.data.getTick()
        # закрываем все позиции перед выходом
        cancelAmount = self.process.cancelPosition(lastPrice)
        self.statistics.addTrade("CANCEL", lastPrice, cancelAmount,
                                 self.process.getBaseAmount(), self.process.getQuoteAmount())
        return self.statistics.getStatistics()


if __name__ == "__main__":
    from userStrategy import ExampleStrategy
    from datetime import datetime, timedelta

    strategy = ExampleStrategy()
    db = Database("sqlite", "", '../resources/db/sqlite3/bitbot_sqlalchemytest2.db')
    bt = Backtest(strategy,
                  TimeRange(datetime(2016, 1, 1, 0, 0, 0, 0) + timedelta(minutes=10) - timedelta(hours=3),
                            datetime(2016, 1, 1, 2, 0, 0, 0) - timedelta(hours=3)),
                  'bitmex', 'BTC/USD', 1000, 0, 3, db)
    print(bt.startTest())
    print("Done!")

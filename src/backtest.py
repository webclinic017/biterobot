from data import Data
from database import Database
from process import Process
from type import Need, TimeRange


class Statistics:
    """Статистика по сделкам

    """
    def __init__(self, startUSDwallet, startBTCwallet):
        self.startWalletValue = 0
        self.startUSDwallet = startUSDwallet
        self.startBTCwallet = startBTCwallet
        self.endWalletValue = 0
        self.endUSDwallet = startUSDwallet
        self.endBTCwallet = startBTCwallet
        self.amountOfSells = 0
        self.amountOfBuys = 0
        self.maxWalletValue = 0
        self.minWalletValue = 0
        self.amountOfGoodTrades = 0
        self.amountOfBadTrades = 0
        self.lastBuyPrice = 0

    def setFirstPrice(self, price: float):
        self.maxWalletValue = self.minWalletValue = self.startWalletValue = self.endWalletValue = \
            self.startUSDwallet + self.startBTCwallet * price

    def addTrade(self, tradeDirection: str, price: float, BTCamount: float, BTCwallet: float, USDwallet: float):
        if tradeDirection == "BUY" and BTCamount > 0:
            wallet = USDwallet + price * BTCwallet
            self.maxWalletValue = max(self.maxWalletValue, wallet)
            self.minWalletValue = min(self.minWalletValue, wallet)
            self.lastBuyPrice = price
            self.amountOfBuys += 1
            self.endWalletValue = wallet
            self.endBTCwallet = BTCwallet
            self.endUSDwallet = USDwallet
        elif tradeDirection == "SELL" and BTCamount > 0:
            wallet = USDwallet + price * BTCwallet
            self.maxWalletValue = max(self.maxWalletValue, wallet)
            self.minWalletValue = min(self.minWalletValue, wallet)
            if price > self.lastBuyPrice:
                self.amountOfGoodTrades += 1
            else:
                self.amountOfBadTrades += 1
            self.amountOfSells += 1
            self.endWalletValue = wallet
            self.endBTCwallet = BTCwallet
            self.endUSDwallet = USDwallet

    def getStatistics(self):
        if self.endWalletValue > self.startWalletValue:
            verdict = "Profitable!"
        else:
            verdict = "Unprofitable."
        return {'startUSDwallet': self.startUSDwallet,
                'startBTCwallet': self.startBTCwallet,
                'startWalletValue': self.startWalletValue,
                'endUSDwallet':   self.endUSDwallet,
                'endBTCwallet':   self.endBTCwallet,
                'endWalletValue': self.endWalletValue,
                'amountOfSells':  self.amountOfSells,
                'amountOfBuys':   self.amountOfBuys,
                'maxWalletValue': self.maxWalletValue,
                'minWalletValue': self.minWalletValue,
                'amountOfGoodTrades': self.amountOfGoodTrades,
                'amountOfBadTrades':  self.amountOfBadTrades,
                'amountOfTrades': self.amountOfBadTrades + self.amountOfGoodTrades,
                'result': self.endWalletValue - self.startWalletValue,
                'verdict': verdict}


class Backtest:
    """Тестирование на архивных данных

    """
    def __init__(self, strategy, timerange: TimeRange, USDwallet: float, BTCwallet: float, db: Database):
        self.strategy = strategy
        self.timerange = timerange
        self.startUSDwallet = USDwallet
        self.startBTCwallet = BTCwallet
        self.process = Process(USDwallet, BTCwallet, strategy.eventPercent, strategy.lossPercent)
        self.data = Data(self.timerange, db)
        if hasattr(self.strategy, "needForStart"):
            self.prepareForStrategy = self.strategy.needForStart.getNeededData()
            if self.prepareForStrategy[0] == Need.TICKS_WITH_TIMEDELTA:
                self.prepareData = Data(TimeRange(self.timerange.beginTime - self.prepareForStrategy[1],
                                                  self.timerange.beginTime), db)
            else:
                raise NotImplementedError()
        self.statistics = Statistics(self.startUSDwallet, self.startBTCwallet)

    def startTest(self):
        # передаем данные для подготовки в стратегию
        if hasattr(self.strategy, "needForStart"):
            if self.prepareForStrategy[0] == Need.TICKS_WITH_TIMEDELTA:
                currentTick = self.prepareData.getTick()
                while currentTick:
                    if self.strategy.prepareForBacktest(currentTick) == 1:
                        break
                    currentTick = self.prepareData.getTick()
            else:
                raise NotImplementedError()
        # после чего начинаем тест
        currentTick = self.data.getTick()
        self.statistics.setFirstPrice(currentTick.price)
        while currentTick:
            decision = self.strategy.getDecision(currentTick)
            if decision is None:
                currentTick = self.data.getTick()
                continue

            if decision == "BUY":
                buyBTCamount = self.process.buy(currentTick.price)
                self.statistics.addTrade("BUY", currentTick.price, buyBTCamount,
                                         self.process.checkWallet("BTC"), self.process.checkWallet("USD"))
            elif decision == "SELL":
                sellBTCamount = self.process.sell(currentTick.price)
                self.statistics.addTrade("SELL", currentTick.price, sellBTCamount,
                                         self.process.checkWallet("BTC"), self.process.checkWallet("USD"))
            currentTick = self.data.getTick()
        return self.statistics.getStatistics()


# if __name__ == "__main__":

import type
from data import Data
from dataBase import DataBase
from process import Process
from strategy import Strategy

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


class ArchiveDataTest:
    """Тестирование на архивных данных

    """
    def __init__(self, strategy: Strategy, timerange: type.TimeRange, USDwallet: float, BTCwallet: float, db: DataBase):
        self.strategy = strategy
        self.timerange = timerange
        self.startUSDwallet = USDwallet
        self.startBTCwallet = BTCwallet
        self.process = Process(USDwallet, BTCwallet, strategy.eventPercent, strategy.lossPercent)
        self.data = Data(self.timerange, db)
        # TODO: довести до ума
        # self.prepareData = Data(type.TimeRange(self.timerange.beginTime - self.strategy.getNeed.getDeltatime(),
        #                                  self.timerange.beginTime), db)
        # далее передаем данные для подготовки в стратегию, после чего начинаем тест
        self.statistics = Statistics(self.startUSDwallet, self.startBTCwallet)

    def startTest(self):
        currentTick = self.data.getTick()
        self.statistics.setFirstPrice(currentTick.Price)
        while currentTick:
            decision = self.strategy.getDecision(currentTick)
            if decision is None:
                currentTick = self.data.getTick()
                continue

            if decision == "BUY":
                self.statistics.addTrade("BUY", currentTick.Price, self.process.buy(currentTick.Price),
                                         self.process.checkWallet("BTC"), self.process.checkWallet("USD"))
            elif decision == "SELL":
                self.process.sell(currentTick.Price)
                self.statistics.addTrade("SELL", currentTick.Price, self.process.sell(currentTick.Price),
                                         self.process.checkWallet("BTC"), self.process.checkWallet("USD"))
            currentTick = self.data.getTick()
        return self.statistics.getStatistics()






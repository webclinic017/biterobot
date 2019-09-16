import type

class Process:
    def __init__(self, wallet: float, BTC_Wallet: float, eventPercent: float, lossPercent: float):
        self.wallet = wallet
        self.USD_Wallet = self.wallet
        self.BTC_Wallet = BTC_Wallet
        self.eventPercent = eventPercent
        self.lossPercent = lossPercent

    def buy(self, price: float):
        self.price = price
        self.transactionAmount: float
        if (self.USD_Wallet < (self.wallet * (1 - self.lossPercent))):
            print("YOU ARE IN OUT OF LIMIT \n")
            return
        elif ((self.eventPercent * self.USD_Wallet) > (self.lossPercent * self.USD_Wallet)):
            print("NOW EVENT_PERCENT IS BIGGER THAN LOSS_PERCENT \n")
        else:
            self.transactionAmount = (self.eventPercent * self.USD_Wallet)
            self.USD_Wallet -= self.transactionAmount
            self.BTC_Wallet += self.transactionAmount / self.price
            print("YOU BOUGHT " + self.transactionAmount / self.price + "BTC \n")

    def sell(self, price: float):
        self.price = price
        self.transactionAmount: float
        self.USD_Wallet += self.BTC_Wallet * self.price
        print("YOU SOLD " + self.BTC_Wallet + "BTC \n")
        self.BTC_Wallet = 0

    def checkWallet(self, currency: str):
        self.currency = currency
        if (self.currency == "BTC"):
            print("YOU HAVE " + self.BTC_Wallet + "BTC \n")
        elif (self.currency == "USD"):
            print("YOU HAVE " + self.USD_Wallet + "USD \n")
        else:
            print("!CHECK CURRENCY CORRECT!")
            return


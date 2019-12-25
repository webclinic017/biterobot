class Process:
    """Класс действий при торговле

    В классе реализованы функции для управления кошелком
    """

    def __init__(self, USD_wallet: float = 1000.0, BTC_Wallet: float = 0, eventPercent: float = 1, lossPercent: float = 0.01):
        """Конструктор класса свечей

        Args:
            BTC_Wallet: баланс криптокошелька
            eventPercent: допустимый процент от кошелька, для сделки
            lossPercent: максимальный процент потерь
        """

        self.USD_Wallet = USD_wallet
        self.BTC_Wallet = BTC_Wallet
        self.eventPercent = eventPercent
        self.lossPercent = lossPercent

    def buy(self, price: float, stopPrice: float = 0):
        """Совершение покупки
        Args:
            price: Цена покупки

        """

        self.price = price
        self.transactionAmount: float
        if stopPrice >= price:
            raise RuntimeError("Stop price must be higher than buy price!")
        if self.USD_Wallet <= 0:
            print("Empty USD wallet, didn't buy anything")
            return 0
        # считаем баланс кошелька
        walletBalance = self.USD_Wallet + self.price * self.BTC_Wallet
        # считаем сколько можно купить с учетом риска неудачной сделки
        buyBTCAmount = (self.lossPercent * walletBalance) / (price - stopPrice)
        # покупаем не больше, чем на допустимый процент от кошелька
        if self.eventPercent * walletBalance < buyBTCAmount * price:
            buyBTCAmount = self.eventPercent * walletBalance

        self.USD_Wallet -= buyBTCAmount * price
        self.BTC_Wallet += buyBTCAmount
        print("YOU BOUGHT " + str(buyBTCAmount) + " BTC at price " + str(price))
        return buyBTCAmount

    def sell(self, price: float):
        """Совершение продажи
        Args:
            price: Цена продажи

        """

        if self.BTC_Wallet <= 0:
            print("Empty BTC wallet, didn't sell anything")
            return 0.0
        sellBTCamount = self.BTC_Wallet
        self.USD_Wallet += self.BTC_Wallet * price
        print("YOU SOLD " + str(self.BTC_Wallet) + " BTC at price " + str(price))
        self.BTC_Wallet = 0.0
        return sellBTCamount

    def checkWallet(self, currency: str):
        """Провекра состояния кошелька
        Args:
            currency: валюта, по которой хотим проверить счет

        """

        self.currency = currency
        if (self.currency == "BTC"):
            return self.BTC_Wallet
        elif (self.currency == "USD"):
            return self.USD_Wallet
        else:
            raise ValueError("Currency incorrect")

# if __name__ == "__main__":

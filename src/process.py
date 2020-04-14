class Process:
    """Класс действий при торговле

    В классе реализованы функции для управления кошелком
    """

    def __init__(self, quoteCurrencyAmount: float = 1000.0, baseCurrencyAmount: float = 0,
                 eventPercent: float = 1, lossPercent: float = 0.01):
        """Конструктор класса действий при торговле

        Args:
            BTC_Wallet: баланс криптокошелька
            eventPercent: допустимый процент от кошелька, для сделки
            lossPercent: максимальный процент потерь
        """

        self.quoteCurrencyAmount = quoteCurrencyAmount
        self.baseCurrencyAmount = baseCurrencyAmount
        self.eventPercent = eventPercent
        self.lossPercent = lossPercent

    def buy(self, price: float, stopPrice: float = 0):
        """Совершение покупки
        Args:
            :param price: Цена покупки
            :param stopPrice:
        """

        if stopPrice >= price:
            raise ValueError("Stop price must be higher than buy price!")
        if self.quoteCurrencyAmount <= 0:
            print("Empty quote currency wallet, didn't buy anything")
            return 0
        # считаем баланс кошелька
        walletBalance = self.quoteCurrencyAmount + price * self.baseCurrencyAmount
        # считаем сколько можно купить с учетом риска неудачной сделки
        buyBaseCurrAmount = (self.lossPercent * walletBalance) / (price - stopPrice)
        # покупаем не больше, чем на допустимый процент от кошелька
        if self.eventPercent * walletBalance < buyBaseCurrAmount * price:
            buyBaseCurrAmount = self.eventPercent * walletBalance

        self.quoteCurrencyAmount -= buyBaseCurrAmount * price
        self.baseCurrencyAmount += buyBaseCurrAmount
        print("You bought " + str(buyBaseCurrAmount) + " at price " + str(price))
        return buyBaseCurrAmount

    def sell(self, price: float):
        """Совершение продажи
        Args:
            price: Цена продажи

        """

        if self.baseCurrencyAmount <= 0:
            print("Empty BTC wallet, didn't sell anything")
            return 0.0
        sellBaseCurrAmount = self.baseCurrencyAmount
        self.quoteCurrencyAmount += self.baseCurrencyAmount * price
        print("You sold " + str(self.baseCurrencyAmount) + "  at price " + str(price))
        self.baseCurrencyAmount = 0.0
        return sellBaseCurrAmount

    def checkWallet(self, currency: str):
        """Провекра состояния кошелька
        Args:
            currency: валюта, по которой хотим проверить счет

        """

        if currency == "base":
            return self.baseCurrencyAmount
        elif currency == "quote":
            return self.quoteCurrencyAmount
        else:
            raise ValueError("Currency incorrect")

# if __name__ == "__main__":

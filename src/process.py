import type


class Process:
    """Класс действий при торговле

    В классе реализованы функции для управления кошелком
    """

    def __init__(self, wallet: float, BTC_Wallet: float, eventPercent: float, lossPercent: float):
        """Конструктор класса свечей

        Args:
            wallet: баланс кошелька
            BTC_Wallet: баланс криптокошелька
            eventPercent: допустимый процент от кошелька, для сделки
            lossPercent: максимальный процент потерь
        """

        self.wallet = wallet
        self.USD_Wallet = self.wallet
        self.BTC_Wallet = BTC_Wallet
        self.eventPercent = eventPercent
        self.lossPercent = lossPercent

    def buy(self, price: float):
        """Совершение покупки
        Args:
            price: Цена покупки

        """

        self.price = price
        self.transactionAmount: float
        if (self.USD_Wallet < (self.wallet * (1 - self.lossPercent))):
            print("YOU ARE IN OUT OF A LIMIT \n")
            return
        elif ((self.eventPercent * self.USD_Wallet) > (self.lossPercent * self.USD_Wallet)):
            print("NOW, A EVENT_PERCENT IS BIGGER THAN A LOSS_PERCENT \n")
        else:
            self.transactionAmount = (self.eventPercent * self.USD_Wallet)
            self.USD_Wallet -= self.transactionAmount
            self.BTC_Wallet += self.transactionAmount / self.price
            print("YOU BOUGHT " + self.transactionAmount / self.price + "BTC \n")

    def sell(self, price: float):
        """Совершение продажи
        Args:
            price: Цена продажи

        """

        self.price = price
        self.transactionAmount: float
        self.USD_Wallet += self.BTC_Wallet * self.price
        print("YOU SOLD " + self.BTC_Wallet + "BTC \n")
        self.BTC_Wallet = 0

    def checkWallet(self, currency: str):
        """Провекра состояния кошелька
        Args:
            currency: Текущий курс

        """

        self.currency = currency
        if (self.currency == "BTC"):
            print("YOU HAVE " + self.BTC_Wallet + "BTC \n")
        elif (self.currency == "USD"):
            print("YOU HAVE " + self.USD_Wallet + "USD \n")
        else:
            print("!CHECK CURRENCY CORRECT!")
            return

# if __name__ == "__main__":

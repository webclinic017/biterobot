class Process:
    """Класс действий при торговле

    В классе реализованы функции для управления кошелком
    """

    def __init__(self, quoteCurrencyAmount: float, baseCurrencyAmount: float,
                 eventPercent: float, lossPercent: float, leverage: float = 0):
        """Конструктор класса действий при торговле

        Args:
            :param quoteCurrencyAmount: начальный баланс по котируемой валюте
            :param baseCurrencyAmount: начальный баланс по базовой валюте
            :param eventPercent: допустимый процент от кошелька, который допустимо использовать в рамках одной сделки
            :param lossPercent: максимальный процент от суммы сделки, на который допустим убыток
            :param leverage: маржинальное плечо. для спотовой торговли равно 0, для маржинальной > 1
        """
        if (leverage < 1) and (leverage > 0):
            raise ValueError("leverage can not be in between 0 and 1. "
                             "It is equal to 0 for spot trading and more or equal than 1 for margin")
        self.leverage = leverage

        if (quoteCurrencyAmount is None) or (baseCurrencyAmount is None):
            raise ValueError("You should provide amount of currency to trade with")
        if quoteCurrencyAmount < 0:
            raise ValueError("You should provide only positive numbers of quote currency amount.")
        if (leverage == 0) and (baseCurrencyAmount < 0):
            raise ValueError("You can't short without leverage. Change leverage or base currency amount")
        self.quoteCurrencyAmount = quoteCurrencyAmount
        self.baseCurrencyAmount = baseCurrencyAmount

        if (eventPercent is None) or (lossPercent is None):
            raise ValueError("You should provide eventPercent and lossPercent")
        if (eventPercent < 0) or (lossPercent < 0):
            raise ValueError("eventPercent and lossPercent should be 0 or more")
        # я сознательно осталяю возможность eventPercent и lossPercent быть больше 1. Возможны ситуации,
        #  когда в рамках одной сделки понадобится купить валюты на весь кошелек и больше, взяв в залог у биржи или
        #  брокера. подробнее о маржинальной торговле расскажет гугл и википедия
        self.eventPercent = eventPercent
        self.lossPercent = lossPercent

    def buy(self, price: float, stopPrice: float) -> float:
        """Совершение покупки
        Args:
            :param price: цена покупки
            :param stopPrice: цена стоп-лосс
        :return: количество купленной base currency с учетом отмененной позиции
        :raises ValueError - если неправильная цена стоп-лосс или нет достаточно денег для проведения сделки
        """
        if stopPrice >= price:
            raise ValueError("Stop price must be lower than buy price!")

        canceledPosition = 0
        if self.baseCurrencyAmount < 0:
            # если мы в короткой позиции и мы получили сигнал на покупку - нужно сначала выйти из продаж
            canceledPosition = - self.cancelPosition(price)

        # считаем баланс кошелька
        maxQuoteAmount = self.quoteCurrencyAmount + price * self.baseCurrencyAmount
        # считаем сколько можно купить с учетом риска неудачной сделки
        buyBaseCurrAmount = (self.lossPercent * maxQuoteAmount) / (price - stopPrice)
        # покупаем не больше, чем на допустимый процент от кошелька
        if self.eventPercent * maxQuoteAmount < buyBaseCurrAmount * price:
            buyBaseCurrAmount = self.eventPercent * maxQuoteAmount

        try:
            self.__changePosition(buyBaseCurrAmount, price)

        except ValueError as e:
            return 0
        # возвращаем количество купленной валюты с учетом отмененной позиции
        return buyBaseCurrAmount + canceledPosition

    def sell(self, price: float, stopPrice: float) -> float:
        """Совершение продажи
        Args:
            :param price: Цена продажи
            :param stopPrice: цена стоп-лосс
        :return: количество проданной base currency с учетом отмененной позиции
        :raises ValueError - если неправильная цена стоп-лосс или нет достаточно денег для проведения сделки
        """
        if stopPrice <= price:
            raise ValueError("Stop price must be higher than buy price!")

        canceledPosition = 0
        if self.baseCurrencyAmount > 0:
            # если мы в длинной позиции и мы получили сигнал на продажу - нужно сначала выйти из покупок
            canceledPosition = self.cancelPosition(price)

        # считаем баланс кошелька
        maxQuoteAmount = self.quoteCurrencyAmount + price * abs(self.baseCurrencyAmount)
        # считаем сколько можно купить с учетом риска неудачной сделки
        sellBaseCurrAmount = (self.lossPercent * maxQuoteAmount) / (stopPrice - price)
        # покупаем не больше, чем на допустимый процент от кошелька
        if self.eventPercent * maxQuoteAmount < sellBaseCurrAmount * price:
            sellBaseCurrAmount = self.eventPercent * maxQuoteAmount

        try:
            self.__changePosition(- sellBaseCurrAmount, price)
        except ValueError as e:
            return 0
        return sellBaseCurrAmount + canceledPosition

    def cancelPosition(self, price):
        canceledAmount = self.baseCurrencyAmount
        self.quoteCurrencyAmount = abs(canceledAmount) * price
        self.baseCurrencyAmount = 0.0
        return canceledAmount

    def getBaseAmount(self):
        return self.baseCurrencyAmount

    def getQuoteAmount(self):
        return self.quoteCurrencyAmount

    def __changePosition(self, deltaBaseCurrency: float, price: float) -> None:
        """Изменение позиции (сделки) на некоторую величину
        :param price:
        :param deltaBaseCurrency:
        """
        if self.leverage > 0:
            # для маржинальной торговли:
            # рассчитаем стоимость всех денег на счету в quote currency
            # (например для пары BTCUSD - расчет стоимости в USD)
            maxQuoteAmount = self.quoteCurrencyAmount + abs(self.baseCurrencyAmount * price / self.leverage)
            # рассчитаем конечное количество quote currency на балансе после сделки
            finalQuoteAmount = maxQuoteAmount - abs(self.baseCurrencyAmount + deltaBaseCurrency) * price / self.leverage
        else:
            # для спотовой торговли:
            # рассчитаем стоимость всех денег на счету в quote currency
            # (например для пары BTCUSD - расчет стоимости в USD)
            maxQuoteAmount = self.quoteCurrencyAmount + self.baseCurrencyAmount * price
            # рассчитаем конечное количество quote currency на балансе после сделки
            finalQuoteAmount = maxQuoteAmount - (self.baseCurrencyAmount + deltaBaseCurrency) * price
        # если после рассчета оказывается, что конечное количество quote currency будет больше максимально возможного
        # или меньше нуля (а это недопустимо - мы можем уйти в минус только по base currency и только
        # если будем открывать шорт), то
        if (finalQuoteAmount > maxQuoteAmount) or (finalQuoteAmount < 0):
            # значит у нас нет достаточно средств для этой сделки
            raise ValueError("No enough money to do this")
        else:
            self.quoteCurrencyAmount = finalQuoteAmount
            self.baseCurrencyAmount += deltaBaseCurrency

# if __name__ == "__main__":

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
        if (quoteCurrencyAmount < 0) or (baseCurrencyAmount < 0):
            raise ValueError("You should provide only positive numbers of quote and base currency amount.")
        if (leverage == 0) and (baseCurrencyAmount < 0):
            raise ValueError("You can't short without leverage. Change leverage or base currency amount")
        self.quoteCurrencyAmount = quoteCurrencyAmount
        self.baseCurrencyAmount = baseCurrencyAmount

        if (eventPercent is None) or (lossPercent is None):
            raise ValueError("You should provide eventPercent and lossPercent")
        if (eventPercent < 0) or (eventPercent > 1) or (lossPercent < 0) or (lossPercent > 1):
            raise ValueError("eventPercent and lossPercent should be in between 0 and 1")
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

        canceledPosition = 0.0
        if self.baseCurrencyAmount < 0.0:
            # если мы в короткой позиции и мы получили сигнал на покупку - нужно сначала выйти из продаж
            canceledPosition = - self.cancelPosition(price)
            # я сознательно разделяю отмену позиции и постановку новой. предполагается, что этот же код будет
            # использован для трейдинга в реальном времени. в реальном времени может быть ситуация перегрузки сервера.
            # в таком случае отмена будет выполнена - она выполняется без постановки в очередь например на bitmex,
            # а новая позиция не будет создана из-за перегрузки и переполнения очереди на сервере

        # рассчитаем величину покупки с учетом всех ограничений
        buyBaseCurrAmount = self.__getTrade(price, stopPrice)

        # покупаем
        try:
            self.__changePosition(buyBaseCurrAmount, price)
        except ValueError:
            return canceledPosition
        # возвращаем количество купленной валюты с учетом отмененной позиции
        # TODO: нужно возвращать еще и цену ликвидации баланса
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

        canceledPosition = 0.0
        if self.baseCurrencyAmount > 0.0:
            # если мы в длинной позиции и мы получили сигнал на продажу - нужно сначала выйти из покупок
            canceledPosition = self.cancelPosition(price)
            # я сознательно разделяю отмену позиции и постановку новой. предполагается, что этот же код будет
            # использован для трейдинга в реальном времени. в реальном времени может быть ситуация перегрузки сервера.
            # в таком случае отмена будет выполнена - она выполняется без постановки в очередь например на bitmex,
            # а новая позиция не будет создана из-за перегрузки и переполнения очереди на сервере

        # рассчитаем величину продажи с учетом всех ограничений
        sellBaseCurrAmount = self.__getTrade(price, stopPrice)
        # продаем
        try:
            self.__changePosition(-sellBaseCurrAmount, price)
        except ValueError:
            return canceledPosition
        # возвращаем количество купленной валюты с учетом отмененной позиции
        # TODO: нужно возвращать еще и цену ликвидации баланса
        return sellBaseCurrAmount + canceledPosition

    def cancelPosition(self, price: float) -> float:
        # TODO: в таком виде __changePosition может кинуть exception, если в результате ошибки округления или других
        #  арифметических операций он посчитает, что на отмену позмции недостаточно денег. Такого быть не должно
        canceledAmount = self.baseCurrencyAmount
        self.__changePosition(- canceledAmount, price)
        return canceledAmount

    def getBaseAmount(self) -> float:
        return self.baseCurrencyAmount

    def getQuoteAmount(self) -> float:
        return self.quoteCurrencyAmount

    def __getMaxBaseQuoteAmount(self, price: float) -> (float, float):
        quoteCurrencyInPosition = price * abs(self.baseCurrencyAmount)
        if self.leverage > 0.0:
            quoteCurrencyInPosition /= self.leverage
        # считаем баланс кошелька
        maxQuoteAmount = self.quoteCurrencyAmount + quoteCurrencyInPosition
        # считаем максимально возможный баланс base currency (для BTCUSD - BTC)
        maxBaseAmount = maxQuoteAmount / price
        # учитывая плечо
        if self.leverage > 0.0:
            maxBaseAmount *= self.leverage
        return maxBaseAmount, maxQuoteAmount

    def __getTrade(self, price: float, stopPrice: float) -> float:
        # считаем баланс кошелька в base currency и quote currency
        maxBaseAmount, maxQuoteAmount = self.__getMaxBaseQuoteAmount(price)
        # считаем сколько можно купить/продать с учетом риска неудачной сделки
        tradeBaseCurrAmount = (self.lossPercent * maxQuoteAmount) / abs(stopPrice - price)
        # учитывая плечо, если речь о маржинальной торговле
        if self.leverage > 0.0:
            tradeBaseCurrAmount /= self.leverage
        # покупаем/продаем не больше, чем на допустимый процент от кошелька
        if tradeBaseCurrAmount > maxBaseAmount * self.eventPercent:
            tradeBaseCurrAmount = maxBaseAmount * self.eventPercent
        # и не больше, чем есть свободных денег на счету
        if tradeBaseCurrAmount > maxBaseAmount - abs(self.baseCurrencyAmount):
            tradeBaseCurrAmount = maxBaseAmount - abs(self.baseCurrencyAmount)
        return tradeBaseCurrAmount

    def __changePosition(self, deltaBaseCurrency: float, price: float) -> None:
        """Изменение позиции (сделки) на некоторую величину
        :param price:
        :param deltaBaseCurrency:
        """
        if self.leverage > 0.0:
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
        if (finalQuoteAmount > maxQuoteAmount) or (finalQuoteAmount < 0.0):
            # значит у нас нет достаточно средств для этой сделки
            raise ValueError("No enough money to do this")
        else:
            self.quoteCurrencyAmount = finalQuoteAmount
            self.baseCurrencyAmount += deltaBaseCurrency

# if __name__ == "__main__":

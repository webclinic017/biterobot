from django.db import models

# TODO: Дописать типы
# Stock, Currency, Bond, Etf

TYPE_BOND = "BOND"

TYPE_CHOICES = (
    ("Bond", TYPE_BOND),
)


# TODO: дописать типы и валюты
# RUB, USD, EUR, GBP, HKD, CHF, JPY, CNY, TRY

class InstrumentModel(models.Model):
    name = models.CharField(max_length=200)
    ticker = models.CharField(max_length=100)  # Сокращенное название инструмента
    figi = models.CharField(max_length=150)  # Идентификатор торгового инструмента
    instrumentType = models.CharField(max_length=20, choices=TYPE_CHOICES, default=TYPE_BOND)
    isin = models.CharField(max_length=150)  # Международный идентификационный код ценной бумаги
    minPriceIncrement = models.FloatField()  # Минимальная цена
    lot = models.IntegerField()  # Минимальный лот
    minQuantity = models.IntegerField()  # Минимальное количество
    currency = models.CharField(max_length=50)  # Валюта

    def __str__(self):
        return self.name


class TinkoffAPI(models.Model):
    """
    Model for TinkoffAPI class. It is used for storing token and Tinkoff wrapper class
    """

    class Meta:
        managed = False

    token = str
    tinkoffWrapper = None  # класс TinkoffAPI


class DataIntervalModel(models.Model):
    """

    """
    instrument = models.ForeignKey(InstrumentModel, on_delete=models.CASCADE)
    beginDate = models.DateTimeField()
    endDate = models.DateTimeField()
    timeFrame = models.DateTimeField()  # интервал свечи (5 минут, 15 минут, день и т.д.)


class CandleModel(models.Model):
    # TODO: а здесь нужен FK на инструмент?
    instrument = models.ForeignKey(InstrumentModel, on_delete=models.CASCADE)
    dataInteraval = models.ForeignKey(DataIntervalModel, on_delete=models.CASCADE)
    # TODO: в timeframe должен быть стринг с выборами из переменных TinkoffAPI
    timeFrame = models.DateTimeField()  # интервал свечи (5 минут, 15 минут, день и т.д.)
    o = models.FloatField()  # Открытие свечи
    c = models.FloatField()  # Закрытие свечи
    h = models.FloatField()  # Высший уровень свечи - хвост
    l = models.FloatField()  # Низший уровень свечи - хвост
    v = models.IntegerField()  # Объем торгов
    candleTime = models.DateTimeField()  # время начала свечи в формате datetime

from django.db import models


TYPE_BOND = "BOND"
TYPE_STOCK = "STOCK"
TYPE_CURRENCY = "CURRENCY"
TYPE_ETF = "ETF"

TYPE_CHOICES = (
    ("Bond", TYPE_BOND),
    ("Stock", TYPE_STOCK),
    ("Currency", TYPE_CURRENCY),
    ("ETF", TYPE_ETF),
)

CURRENCY_RUB = "RUB"
CURRENCY_USD = "USD"
CURRENCY_EUR = "EUR"
CURRENCY_GBP = "GBP"
CURRENCY_HKD = "HKD"
CURRENCY_CHF = "CHF"
CURRENCY_JPY = "JPY"
CURRENCY_CNY = "CNY"
CURRENCY_TRY = "TRY"

CURRENCY_CHOICES = (
    ("RUB", CURRENCY_RUB),
    ("USD", CURRENCY_USD),
    ("EUR", CURRENCY_EUR),
    ("GBP", CURRENCY_GBP),
    ("HKD", CURRENCY_HKD),
    ("CHF", CURRENCY_CHF),
    ("JPY", CURRENCY_JPY),
    ("CNY", CURRENCY_CNY),
    ("TRY", CURRENCY_TRY),
)


class InstrumentModel(models.Model):
    name = models.CharField(max_length=200)  # Название инструмента (Apple, Tesla и т.д.)
    ticker = models.CharField(max_length=100)  # Сокращенное название инструмента
    figi = models.CharField(max_length=150)  # Идентификатор торгового инструмента
    instrumentType = models.CharField(max_length=20, choices=TYPE_CHOICES, default=TYPE_BOND)
    isin = models.CharField(max_length=150)  # Международный идентификационный код ценной бумаги
    minPriceIncrement = models.FloatField()  # Минимальная цена
    lot = models.IntegerField()  # Минимальный лот
    minQuantity = models.IntegerField()  # Минимальное количество
    currency = models.CharField(max_length=20, choices=CURRENCY_CHOICES, default=CURRENCY_USD)  # Валюта

    def __str__(self):
        return self.name

class TinkoffAPI(models.Model):
    """
    Model for TinkoffAPI class. It is used for storing token and Tinkoff wrapper class
    """

    class Meta:
        managed = False

    token = str
    tinkoffWrapper = None  # Класс TinkoffAPI

class DataIntervalModel(models.Model):
    instrument = models.ForeignKey(InstrumentModel, on_delete=models.CASCADE)
    dateBegin = models.DateField()
    dateEnd = models.DateField()
    candleLength = models.CharField(max_length=15)  # Интервал свечи (5 минут, 15 минут, день и т.д.)
    ticker = models.CharField(max_length=100)  # ВРЕМЕННО

class CandleModel(models.Model):
    instrument = models.ForeignKey(InstrumentModel, on_delete=models.CASCADE)
    dataInterval = models.ForeignKey(DataIntervalModel, on_delete=models.CASCADE)
    candleLength = models.CharField(max_length=15)  # Интервал свечи (5 минут, 15 минут, день и т.д.)
    o = models.FloatField()  # Открытие свечи
    c = models.FloatField()  # Закрытие свечи
    h = models.FloatField()  # Высший уровень свечи - хвост
    l = models.FloatField()  # Низший уровень свечи - хвост
    v = models.IntegerField()  # Объем торгов
    candleTime = models.DateTimeField()  # Время начала свечи в формате datetime

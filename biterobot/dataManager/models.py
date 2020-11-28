from django.db import models


TYPE_CHOICES = (
    ("BOND", "BOND"),
    ("SHARE", "SHARE"),
)


class InstrumentModel(models.Model):
    name = models.CharField(max_length=200)
    ticker = models.CharField(max_length=100)  # Сокращенное название инструмента
    figi = models.CharField(max_length=150)  # Идентификатор торгового инструмента
    instrumentType = models.CharField(max_length=20, choices=TYPE_CHOICES, default="BOND")
    isin = models.CharField(max_length=150)  # Международный идентификационный код ценной бумаги
    minPriceIncrement = models.FloatField()  # Минимальная цена
    lot = models.IntegerField()  # Минимальный лот
    minQuantity = models.IntegerField()  # Минимальное количество
    currency = models.CharField(max_length=50)  # Валюта

    def __str__(self):
        return self.name

class CandleModel(models.Model):
    instrument = models.ForeignKey(InstrumentModel, on_delete=models.CASCADE)
    interval = models.DateTimeField()
    o = models.FloatField()  # Открытие свечи
    c = models.FloatField()  # Закрытие свечи
    h = models.FloatField()  # Высший уровень свечи - хвост
    l = models.FloatField()  # Низший уровень свечи - хвост
    v = models.IntegerField()  # Объем торгов
    candleTime = models.DateTimeField()

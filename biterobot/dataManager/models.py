from django.db import models


TYPE_CHOICES = (
    ("BOND", "BOND"),
    ("SHARE", "SHARE"),
)


class InstrumentModel(models.Model):
    name = models.CharField(max_length=200)
    ticker = models.CharField(max_length=100)
    figi = models.CharField(max_length=150)
    instrumentType = models.CharField(max_length=20, choices=TYPE_CHOICES, default="BOND")
    isin = models.CharField(max_length=150)
    minPriceIncrement = models.FloatField()
    lot = models.IntegerField()
    minQuantity = models.IntegerField()
    currency = models.CharField(max_length=50)

    def __str__(self):
        return self.name

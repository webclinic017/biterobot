from django.db import models


# Instrument's types Enumerate
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

# Instrument's currency Enumerate
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
    '''
    Django model for Instrument
    '''
    name = models.CharField(max_length=200)  # Instrument's name
    ticker = models.CharField(max_length=100)  # Short name in the exchange information of instruments
    figi = models.CharField(max_length=150)  # Financial instrument global identifier
    instrumentType = models.CharField(max_length=20, choices=TYPE_CHOICES, default=TYPE_BOND)  # Type of instrument
    isin = models.CharField(max_length=150)  # International security identification number
    minPriceIncrement = models.FloatField()  # Minimum price increment of instrument
    lot = models.IntegerField()  # Minimum lot of instrument
    minQuantity = models.IntegerField()  # Minimum quantity to buy of instrument
    currency = models.CharField(max_length=20, choices=CURRENCY_CHOICES, default=CURRENCY_USD)  # Currency of instrument

    # Method for displaying name, when call model
    def __str__(self):
        return self.name

class DataIntervalModel(models.Model):
    '''
    Django model for Data interval
    '''
    instrument = models.ForeignKey(InstrumentModel, on_delete=models.CASCADE)  # Instrument's id in database
    dateBegin = models.DateField()  # Date of beginning the Interval
    dateEnd = models.DateField()  # Date of ending the Interval
    candleLength = models.CharField(max_length=15)  # Length of candle
    ticker = models.CharField(max_length=100)  # Instrument's ticker

class CandleModel(models.Model):
    instrument = models.ForeignKey(InstrumentModel, on_delete=models.CASCADE)  # Instrument's id in database
    dataInterval = models.ForeignKey(DataIntervalModel, on_delete=models.CASCADE)  # DataInterval's id in database
    candleLength = models.CharField(max_length=15)  # Length of candle
    o = models.FloatField()  # Open level of candle
    c = models.FloatField()  # Close level of candle
    h = models.FloatField()  # High level of candle
    l = models.FloatField()  # Low level of candle
    v = models.IntegerField()  # Volume of trading
    candleTime = models.DateTimeField()  # Time of candle's start

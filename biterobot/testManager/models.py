from django.db import models
from django.conf import settings

from .services.backtest import manager


class TestModel(models.Model):
    '''
    Django model for Test
    '''
    tstStatus = models.CharField(max_length=50, null=True)  # Test status for task in Backtest module
    backtest = manager.BacktestManager()  # Backtest object for async Tests (not stored in the database)
    strategyId = models.IntegerField()  # Strategy' id in database
    name = models.CharField(max_length=200)  # Test name = 'Strategy's name + Test'
    uuid = models.CharField(max_length=1000)  # Unique identifier string for the Test, that uses in async functions in Backtest
    dateBegin = models.DateField()  # Date of beginning a Data interval for Test
    dateEnd = models.DateField()  # Date of ending a Data interval for Test
    dateTest = models.DateField()  # Date of testing
    ticker = models.CharField(max_length=100)  # Instrument's ticker for the Test
    version = models.IntegerField()  # Strategy's version
    startCash = models.FloatField(null=True)  # Wallet before testing with conditional cash (default in Backtest module = 1000)
    endCash = models.FloatField(null=True)  # Wallet after testing with conditional cash
    resultData = models.TextField(null=True)  # Results of testing (long string), get from Backtest module
    file = models.FilePathField(path=f'{settings.BASE_DIR}/testManager/resultGraphs', null=True)  # Path to Graph file on servers's directory

    # Method for displaying name, when call model
    def __str__(self):
        return self.name

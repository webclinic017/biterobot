from django.db import models
from django.conf import settings

from dataManager.models import InstrumentModel
from .backtest import manager


class TestModel(models.Model):
    tstStatus = models.CharField(max_length=50)
    name = models.CharField(max_length=200)  # Название стратегии + Test
    uuid = models.CharField(max_length=1000)  # Уникальный id тестирования
    dateBegin = models.DateField()  # Дата начала периода тестирования
    dateEnd = models.DateField()  # Дата конца периода тестирования
    dateTest = models.DateField()  # Дата проведения тестирования
    ticker = models.CharField(max_length=100)  # Тикер на котором проводили тестирование
    version = models.IntegerField()  # Версия стратегии
    startCash = models.FloatField(null=True)  # Начальный кошелек
    endCash = models.FloatField(null=True)  # Конечный кошелек
    resultData = models.TextField(null=True)  # Данныые результата тестировани
    file = models.FilePathField(path=f'{settings.BASE_DIR}/testManager/resultGraphs', null=True)  # Путь до графика тестирования

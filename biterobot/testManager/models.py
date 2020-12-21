from django.db import models

from dataManager.models import InstrumentModel


class TestModel(models.Model):
    name = models.CharField(max_length=200)  # Название стратегии + Test
    uuid = models.CharField(max_length=1000)  # Уникальный id тестирования
    dateBegin = models.DateField()  # Дата начала периода тестирования
    dateEnd = models.DateField()  # Дата конца периода тестирования
    dateTest = models.DateField()  # Дата проведения тестирования
    ticker = models.CharField(max_length=100)  # Тикер на котором проводили тестирование
    version = models.IntegerField()  # Версия стратегии
    startCash = models.FloatField()  # Начальный кошелек
    endCash = models.FloatField()  # Конечный кошелек
    resultData = models.TextField()  # Данныые результата тестировани
    plotPath = models.FilePathField(path="C:\\Users\\uzer\PycharmProjects\\biterobot\\biterobot\\testManager\\resultGraphs")  # Пусть до графика тестирования

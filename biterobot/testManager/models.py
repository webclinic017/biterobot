from django.db import models

from dataManager.models import InstrumentModel


class TestModel(models.Model):
    name = models.CharField(max_length=200)
    dateBegin = models.DateField()
    dateEnd = models.DateField()
    instrument = models.ForeignKey(InstrumentModel, on_delete=models.DO_NOTHING)
    strategyVersion = models.IntegerField()
    trades = models.CharField(max_length=10000)
    plotPath = models.FilePathField(path="C:\\Users\\uzer\PycharmProjects\\biterobot\\biterobot\\testManager\\resultImages")

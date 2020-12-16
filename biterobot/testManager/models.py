from django.db import models

from ..dataManager import models as dataModel


class TestModel(models.Model):
    name = models.CharField(max_length=200)
    dateBegin = models.DateField()
    dateEnd = models.DateField()
    instrument = models.ForeignKey(dataModel.InstrumentModel, on_delete=models.DO_NOTHING)
    strategyVersion = models.IntegerField()
    trades = models.CharField(max=10000)
    plotPath = models.FilePathField(path="C:\\Users\\uzer\PycharmProjects\\biterobot\\biterobot\\testManager\\resultImages")

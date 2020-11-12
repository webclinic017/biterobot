from django.db import models


STATUS_CHOICES = (
    ("RUNNING", "RUNNING"),
    ("PAUSED", "PAUSED"),
    ("STOPPED", "STOPPED"),
)


class StrategyModel(models.Model):
    name = models.CharField(max_length=200)
    version = models.IntegerField(default=1)
    description = models.CharField(max_length=1000)
    filePath = models.FilePathField(path="C:\\Users\\uzer\PycharmProjects\\biterobot\\biterobot\strategyManager\strategies")
    #strategyTest = models.ForeignKey()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="STOPPED")

    def __str__(self):
        return self.name

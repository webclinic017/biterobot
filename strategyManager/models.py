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
    filePath = models.FilePathField()
    #strategyTest = models.ForeignKey()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="STOPPED")


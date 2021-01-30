from django.db import models
from django.conf import settings


class StrategyModel(models.Model):
    '''
    Django model for Strategy
    '''
    name = models.CharField(max_length=200)  # Strategy name
    version = models.IntegerField(default=1)  # Version of the Strategy
    description = models.CharField(max_length=4000)  # Some description about Strategy
    filePath = models.FilePathField(path=f'{settings.BASE_DIR}/strategyManager/strategy')  # Path to Strategy file

    # Method for displaying name, when call model
    def __str__(self):
        return self.name

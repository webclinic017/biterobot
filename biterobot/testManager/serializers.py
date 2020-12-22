from rest_framework import serializers

from .common import testInit
from strategyManager.models import StrategyModel
from dataManager.models import DataIntervalModel
from django.conf import settings


class TestSerializerGET(serializers.Serializer):
    uuid = serializers.CharField(max_length=1000)  # Уникальный id тестирования
    name = serializers.CharField(max_length=200)  # Название стратегии + Test
    version = serializers.IntegerField()  # Версия стратегии
    dateTest = serializers.DateField()  # Дата проведения тестирования
    dateBegin = serializers.DateField()  # Дата начала периода тестирования
    dateEnd = serializers.DateField()  # Дата конца периода тестирования
    file = serializers.FilePathField(path=f'{settings.BASE_DIR}/testManager/resultGraphs')  # Путь до графика тестирования

class FilesIdSerializer(serializers.Serializer):
    id = serializers.IntegerField()

class AdditionalSerializer(serializers.Serializer):
    web_path = serializers.CharField(max_length=1000)
    startCash = serializers.FloatField()
    endCash = serializers.FloatField()
    resultData = serializers.CharField()

class TestInfoSerializer(serializers.Serializer):
    id = serializers.IntegerField()  # id записи в БД
    name = serializers.CharField(max_length=200)  # Название стратегии + Test
    version = serializers.IntegerField()  # Версия стратегии
    dateTest = serializers.DateField()  # Дата проведения тестирования
    dateBegin = serializers.DateField()  # Дата начала периода тестирования
    dateEnd = serializers.DateField()  # Дата конца периода тестирования
    files = serializers.ListField()

class FileSerializer(serializers.Serializer):
    files = serializers.ListField()

class TestSerializerArchiveGET(serializers.Serializer):
    pass

class FilePathSerializer(serializers.Serializer):
    web_path = serializers.CharField(max_length=1000)

class TestSerializerPOST(serializers.Serializer):
    id = serializers.CharField(max_length=1500)
    id_data = serializers.IntegerField()
    id_strat = serializers.IntegerField()

    def create(self, validated_data):
        taskId = validated_data.pop('id')
        dataId = validated_data.pop('id_data')
        strategyId = validated_data.pop('id_strat')

        # Получение данных из базы Strategy
        strategy = StrategyModel.objects.filter(id=strategyId)
        strategyName = strategy[0].name
        version = strategy[0].version

        # Получение данных из базы DataInterval
        data = DataIntervalModel.objects.filter(id=dataId)
        ticker = data[0].ticker
        candleLength = data[0].candleLength
        dateBegin = data[0].dateBegin
        dateEnd = data[0].dateEnd

        testInit(taskId=taskId, strategyPath=f'{settings.BASE_DIR}/strategyManager/strategies/{strategyName}.py', strategyName=strategyName,
                    version=version, dateBegin=dateBegin, dateEnd=dateEnd,
                        ticker=ticker, candleLength=candleLength)  # Передаем путь стратегии для старта тестирования

        return 0  # т.к. все данные в базу были уже записаны в common

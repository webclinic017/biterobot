from rest_framework import serializers

from .common import testInit
from django.conf import settings


class TestSerializerGET(serializers.Serializer):
    uuid = serializers.CharField(max_length=1000)  # Уникальный id тестирования
    name = serializers.CharField(max_length=200)  # Название стратегии + Test
    version = serializers.IntegerField()  # Версия стратегии
    dateTest = serializers.DateField()  # Дата проведения тестирования
    dateBegin = serializers.DateField()  # Дата начала периода тестирования
    dateEnd = serializers.DateField()  # Дата конца периода тестирования
    file = serializers.FilePathField(path="C:\\Users\\uzer\PycharmProjects\\biterobot\\biterobot\\testManager\\resultGraphs")  # Пусть до графика тестирования

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
    files = serializers.ListField(child=FilesIdSerializer)

class FileSerializer(serializers.Serializer):
    files = serializers.ListField(child=AdditionalSerializer)

class TestSerializerArchiveGET(serializers.Serializer):
    pass

class FilePathSerializer(serializers.Serializer):
    web_path = serializers.CharField(max_length=1000)

class TestSerializerPOST(serializers.Serializer):
    code = serializers.IntegerField()
    id = serializers.CharField(max_length=1500)
    frDate = serializers.DateField()
    toDate = serializers.DateField()
    name = serializers.CharField(max_length=200)
    isNew = serializers.BooleanField()
    #   ticker = serializers.CharField(max_length=100)
    #candleLength= serializers.CharField(max_length=15)

    def create(self, validated_data):
        validated_data.pop('code')  # Пока не нужен, поэтому попаем в никуда

        strategyName = validated_data.pop('name')
        taskId = validated_data.pop('id')

        testInit(taskId=taskId, strategyPath=f'{settings.BASE_DIR}\strategyManager\strategies\{strategyName}.py', strategyName=strategyName, dateBegin=validated_data.pop('frDate'),
                 dateEnd=validated_data.pop('toDate'), ticker='MOEX', candleLength='MIN_30')  # Передаем путь стратегии для старта тестирования

        return 0  # т.к. все данные в базу были уже записаны в common

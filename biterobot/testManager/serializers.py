from rest_framework import serializers

from .common import testInit
from django.conf import settings


class FileSerializer(serializers.Serializer):
    id = serializers.IntegerField()

class TestSerializerGET(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    dateTest = serializers.DateField()
    dateBegin = serializers.DateField()
    dateEnd = serializers.DateField()
    instrument = serializers.IntegerField()  # Ссылка на id инструмента, потом поменять на name инструмента по ForeignKey
    files = FileSerializer()
    checked = serializers.CharField(max_length=1, default="")  # Это нужно для решения проблем на ФРОНТЕ

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

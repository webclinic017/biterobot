from rest_framework import serializers

from .common import dataHandler
from .models import DataIntervalModel


class InstrumentSerializerGET(serializers.Serializer):
    ticker = serializers.CharField(max_length=100)  # Сокращенное название инструмента
    dateBegin = serializers.DateTimeField()
    dateEnd = serializers.DateTimeField()
    timeFrame = serializers.DateTimeField()  # Интервал свечи (5 минут, 15 минут, день и т.д.)

class InstrumentSerializerPOST(serializers.Serializer):
    code = serializers.IntegerField()
    frDate = serializers.DateTimeField()
    toDate = serializers.DateTimeField()
    ticker = serializers.CharField(max_length=100)
    candleLength = serializers.CharField(max_length=15)

    def create(self, validated_data):
        validated_data.pop('code')  # Пока не нужен, поэтому попаем в никуда

        dataHandler(token='', ticker=validated_data.pop('ticker'), dateBegin=validated_data.pop('frDate'), dateEnd=validated_data.pop('toDate'), candleLength=validated_data.pop('candleLength'))

        return DataIntervalModel.objects.create(**validated_data)

from rest_framework import serializers

from .common import dataHandler
from .models import DataIntervalModel


class InstrumentSerializerGET(serializers.Serializer):
    id = serializers.IntegerField()
    ticker = serializers.CharField(max_length=100)  # Сокращенное название инструмента
    dateBegin = serializers.DateField()
    dateEnd = serializers.DateField()
    candleLength = serializers.CharField(max_length=15)  # Интервал свечи (5 минут, 15 минут, день и т.д.)
    checked = serializers.CharField(max_length=1, default="")  # Это нужно для решения проблем на ФРОНТЕ

class InstrumentSerializerPOST(serializers.Serializer):
    code = serializers.IntegerField()
    frDate = serializers.DateField()
    toDate = serializers.DateField()
    ticker = serializers.CharField(max_length=100)
    candleLength = serializers.CharField(max_length=15)
    token = serializers.CharField(max_length=200)

    def create(self, validated_data):
        validated_data.pop('code')  # Пока не нужен, поэтому попаем в никуда

        dataHandler(token=validated_data.pop('token'), ticker=validated_data.pop('ticker'), dateBegin=validated_data.pop('frDate'), dateEnd=validated_data.pop('toDate'), candleLength=validated_data.pop('candleLength'))

        return 0  # т.к. все данные в базу были уже записаны в dataHandler

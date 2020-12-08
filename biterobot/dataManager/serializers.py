from rest_framework import serializers


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

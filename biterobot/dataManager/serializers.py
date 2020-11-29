from rest_framework import serializers


class InstrumentSerializerGET(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    ticker = serializers.CharField(max_length=100)  # Сокращенное название инструмента
    dateBegin = serializers.DateTimeField()
    dateEnd = serializers.DateTimeField()

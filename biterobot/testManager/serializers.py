from rest_framework import serializers

from .common import testInit


class TestSerializerGET(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    dateBegin = serializers.DateField()
    dateEnd = serializers.DateField()
    instrument = serializers.IntegerField()  # Ссылка на id инструмента, потом поменять на name инструмента по ForeignKey
    checked = serializers.CharField(max_length=1, default="")  # Это нужно для решения проблем на ФРОНТЕ

class TestSerializerPOST(serializers.Serializer):
    code = serializers.IntegerField()
    id = serializers.CharField(max_length=1500)
    frDate = serializers.DateField()
    toDate = serializers.DateField()
    name = serializers.CharField(max_length=200)
    isNew = serializers.BooleanField()

    def create(self, validated_data):
        validated_data.pop('code')  # Пока не нужен, поэтому попаем в никуда

        strategyName = validated_data.pop('name')

        testInit(f'../strategyManager/strategies/{strategyName}.py')

        return 0  # т.к. все данные в базу были уже записаны в testInit

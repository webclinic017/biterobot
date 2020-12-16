from rest_framework import serializers


class TestSerializerGET(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    dateBegin = serializers.DateField()
    dateEnd = serializers.DateField()
    instrument = serializers.IntegerField()  # Ссылка на id инструмента, потом поменять на name инструмента по ForeignKey

class TestSerializerPOST(serializers.Serializer):
    code = serializers.IntegerField()
    id = serializers.CharField(max_length=1500)
    frDate = serializers.DateField()
    toDate = serializers.DateField()
    name = serializers.CharField(max_length=200)
    isNew = serializers.BooleanField()

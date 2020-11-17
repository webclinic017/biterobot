from rest_framework import serializers

from .models import StrategyModel
from .common import blobToFile, saveFile


# class StrategySerializer(serializers.ModelSerializer):
#     code = serializers.IntegerField()
#     body = serializers.CharField(max_length=1000)
#     class Meta:
#         model = StrategyModel
#         fields = ('name', 'description', 'version', 'code', 'body')
#
#         def create(self, validated_data):
#             print(validated_data.pop('code'), validated_data.pop('body'))
#             validated_data.update({'filePath': 'testPath'})
#             return StrategyModel.objects.create(**validated_data)

class FileSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    body = serializers.CharField(max_length=4000)

class StrategySerializerGET(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    version = serializers.IntegerField()
    description = serializers.CharField(max_length=1000)

class StrategySerializerPOST(serializers.Serializer):
    code = serializers.IntegerField()
    name = serializers.CharField(max_length=200)
    description = serializers.CharField(max_length=1000)
    file = FileSerializer()

    def create(self, validated_data):
        validated_data.pop('code')  # Пока не нужен, поэтому попаем в никуда
        blobFile = validated_data.pop('file')['body']

        saveFile(blobToFile(blobFile))  # Сохраняем файл в '/strategies/text.txt', название чуть позже прикручу

        validated_data.update({'filePath': '/strategies/text.txt'})

        return StrategyModel.objects.create(**validated_data)



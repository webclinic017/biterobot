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
        fileInfo = validated_data.pop('file')

        saveFile(data=blobToFile(fileInfo['body']), filePath=f'strategyManager/strategies/{fileInfo["name"]}')

        validated_data.update({'filePath': f'/strategies/{fileInfo["name"]}'})

        return StrategyModel.objects.create(**validated_data)

    def update(self, instance, validated_data):
        validated_data.pop('code')  # Пока не нужен, поэтому попаем в никуда
        fileInfo = validated_data.pop('file')

        saveFile(blobToFile(fileInfo['body']))

        validated_data.update({'filePath': f'/strategies/{fileInfo["name"]}'})

        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.filePath = validated_data.get('filePath', instance.filePath)

        instance.save()

        return instance

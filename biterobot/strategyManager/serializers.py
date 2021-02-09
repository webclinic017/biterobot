from rest_framework import serializers
from django.contrib.auth.models import User

from .models import StrategyModel
from .services.services import decodeBase64, saveFile, check, deleteFile


class FileSerializer(serializers.Serializer):
    '''
    DRF serializer for serialize File block in JSON
    '''
    name = serializers.CharField(max_length=200)  # File name
    body = serializers.CharField()  # Base64 string of file

class StrategySerializerGET(serializers.Serializer):
    '''
    DRF serializer for GET-request. Get Strategy info from database
    '''
    id = serializers.IntegerField()  # Strategy id in database (primary key)
    name = serializers.CharField(max_length=200)  # Strategy name
    version = serializers.IntegerField()  # Version of the Strategy
    description = serializers.CharField(max_length=4000)  # Some description about Strategy

class StrategySerializerPOST(serializers.Serializer):
    '''
    DRF serializer for POST-request and PUT-request. Add new Strategy info and file
    '''
    name = serializers.CharField(max_length=200)  # Strategy name
    description = serializers.CharField(max_length=1000)  # Some description about Strategy
    file = FileSerializer()  # Strategy file block

    # Create new Strategy in database, save Strategy file, check Strategy
    def create(self, validated_data):
        fileInfo = validated_data.pop('file')

        # Save Strategy file.py in strategies directory
        saveFile(data=decodeBase64(fileInfo['body']), filePath=f'strategyManager/strategies/{validated_data["name"]}.py')

        # Check Strategy file.py for Backtrader requirements.
        # If it not correct - raise exception, delete Strategy file from directory and break (don't save in database)
        try:
            check(strategyPath=f'strategyManager/strategies/{validated_data["name"]}.py')
        except:
            deleteFile(f'strategies/{validated_data["name"]}.py')
            raise

        validated_data.update({'filePath': f'/strategies/{validated_data["name"]}.py'})

        try:
            return StrategyModel.objects.create(**validated_data)
        except:
            deleteFile(f'strategies/{validated_data["name"]}.py')
            raise

    # Update Strategy in database, update Strategy file
    def update(self, instance, validated_data):
        #TODO: Проверка стратегии, как при POST
        fileInfo = validated_data.pop('file')

        # Save Strategy file.py in strategies directory
        saveFile(decodeBase64(fileInfo['body']), filePath=f'strategyManager/strategies/{instance.name}.py')

        validated_data.update({'filePath': f'/strategies/{instance.name}.py'})

        instance.description = validated_data.get('description', instance.description)
        instance.filePath = validated_data.get('filePath', instance.filePath)

        # Strategy version increment
        instance.version = instance.version + 1

        instance.save()

        return instance

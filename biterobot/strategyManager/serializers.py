from rest_framework import serializers

from .services import services


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
        return services.saveStrategy(strategyData=validated_data)

    # Update Strategy in database, update Strategy file
    def update(self, instance, validated_data):
        return services.saveStrategy(strategyData=instance, strategyDataNew=validated_data)

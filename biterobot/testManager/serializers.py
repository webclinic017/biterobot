from rest_framework import serializers
from django.conf import settings

from testManager.services.services import testInit
from strategyManager.models import StrategyModel
from dataManager.models import DataIntervalModel


class TestSerializerGET(serializers.Serializer):
    '''
    DRF serializer for GET-request. Get one Test info from database
    '''
    uuid = serializers.CharField(max_length=1000)  # Unique identifier string for the Test, that uses in async functions in Backtest
    name = serializers.CharField(max_length=200)  # Test name = 'Strategy's name + Test'
    version = serializers.IntegerField()  # Strategy's version
    dateTest = serializers.DateField()  # Date of testing
    dateBegin = serializers.DateField()  # Date of beginning a Data interval for Test
    dateEnd = serializers.DateField()  # Date of ending a Data interval for Test
    resultData = serializers.CharField()  # Results of testing (long string), get from Backtest module
    startCash = serializers.FloatField()  # Wallet before testing with conditional cash (default in Backtest module = 1000)
    endCash = serializers.FloatField()  # Wallet after testing with conditional cash
    file = serializers.FilePathField(path=f'{settings.BASE_DIR}/testManager/resultGraphs')  # Path to Graph file on servers's directory

class CheckSerializerGET(serializers.Serializer):
    '''
    DRF serializer for GET-request. Get status of Test by uuid(taskId) and return them
    '''
    tstStatus = serializers.CharField(max_length=50)  # Test status for task in Backtest module
    message = serializers.CharField(max_length=500, default="")  # Additional message, default = ''

class TestSerializerArchiveGET(serializers.Serializer):
    '''
    DRF serializer for GET-request. Get Tests info from database
    '''
    id = serializers.IntegerField()  # Test id in database (primary key)
    name = serializers.CharField(max_length=200)  # Test name = 'Strategy's name + Test'
    version = serializers.IntegerField()  # Strategy's version
    dateTest = serializers.DateField()  # Date of testing
    dateBegin = serializers.DateField()  # Date of beginning a Data interval for Test
    dateEnd = serializers.DateField()  # Date of ending a Data interval for Test

class TestSerializerPOST(serializers.Serializer):
    '''
    DRF serializer for POST-request. Add new Test info in database, start testing
    '''
    id = serializers.CharField(max_length=1500)  # Test id in database (primary key)
    id_data = serializers.IntegerField()  # Data id in database (primary key)
    id_strat = serializers.IntegerField()  # Strategy id in database (primary key)

    # Create new Test info in database, start testing
    def create(self, validated_data):
        taskId = validated_data.pop('id')
        dataId = validated_data.pop('id_data')
        strategyId = validated_data.pop('id_strat')

        # Get data from Strategy
        strategy = StrategyModel.objects.filter(id=strategyId)
        strategyName = strategy[0].name
        version = strategy[0].version

        # Get data from DataInterval
        data = DataIntervalModel.objects.filter(id=dataId)
        ticker = data[0].ticker
        candleLength = data[0].candleLength
        dateBegin = data[0].dateBegin
        dateEnd = data[0].dateEnd

        # Call test initialization function
        testInit(taskId=taskId, strategyId=strategyId, strategyPath=f'{settings.BASE_DIR}/strategyManager/strategies/{strategyName}.py', strategyName=strategyName,
                    version=version, dateBegin=dateBegin, dateEnd=dateEnd,
                        ticker=ticker, candleLength=candleLength)

        return 0  # All Test info save in testInit(...)

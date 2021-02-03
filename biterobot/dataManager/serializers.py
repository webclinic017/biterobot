from rest_framework import serializers

from .common import dataHandler


class InstrumentSerializerGET(serializers.Serializer):
    '''
    DRF serializer for GET-request. Get Data info from database
    '''
    id = serializers.IntegerField()  # DataInterval id in database
    ticker = serializers.CharField(max_length=100)  # Instrument's ticker
    dateBegin = serializers.DateField()  # Date of beginning the Interval
    dateEnd = serializers.DateField()  # Date of ending the Interval
    candleLength = serializers.CharField(max_length=15)  # Length of candle
    checked = serializers.CharField(max_length=1, default="")  # Needs to deal with problem on a JS table in frontend

class InstrumentSerializerPOST(serializers.Serializer):
    '''
    DRF serializer for POST-request. Add new Data info, candles in database
    '''
    frDate = serializers.DateField()  # Date of beginning the Interval
    toDate = serializers.DateField()  # Date of ending the Interval
    ticker = serializers.CharField(max_length=100)  # Instrument's ticker
    candleLength = serializers.CharField(max_length=15)  # Length of candle
    token = serializers.CharField(max_length=200)  # Tinkoff_Invest token for Tinkoff OpenAPI

    # Create new Data info, candles, instruments in database, download it from Tinkoff API
    def create(self, validated_data):
        dataHandler(token=validated_data.pop('token'), ticker=validated_data.pop('ticker'), dateBegin=validated_data.pop('frDate'), dateEnd=validated_data.pop('toDate'), candleLength=validated_data.pop('candleLength'))

        return 0  # All Data save in dataHandler(...)

class TickersSerializerGET(serializers.Serializer):
    '''
    DRF serializer for GET-request. Get Tickers from database
    '''
    ticker = serializers.CharField(max_length=100)

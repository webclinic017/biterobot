from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import DataIntervalModel, InstrumentModel
from .serializers import InstrumentSerializerGET, InstrumentSerializerPOST, TickersSerializerGET
from dataManager.services import dbServices


# Return render template of Data page
def startPage(request):
    return render(request, 'DataEditor.html')

class InstrumentView(APIView):
    '''
    DRF view for Data requests. CR.D
    '''
    # Handle GET-request for read Data from database and return them
    def get(self, request):
        instruments = DataIntervalModel.objects.all()

        serializer = InstrumentSerializerGET(instruments, many=True)

        return Response({'data': serializer.data})

    # Handle POST-request for create new Data
    def post(self, request):
        instrument = request.data

        serializer = InstrumentSerializerPOST(data=instrument)

        if serializer.is_valid(raise_exception=False):
            serializer.save()

        return Response({"success": f"Instrument '{serializer}' created successfully"})

    # Handle DELETE-request for delete Data
    def delete(self, request, pk):
        dbServices.deleteDataIntervalInfo(id=pk)

        return Response({"message": "Data with id `{}` has been deleted.".format(pk)}, status=204)

class TickersView(APIView):
    '''
    DRF view for Tickers requests. .R..
    '''
    # Handle GET-request for read Tickers from database
    def get(self, request):
        tickers = InstrumentModel.objects.all()

        serializer = TickersSerializerGET(tickers, many=True)

        return Response(serializer.data)

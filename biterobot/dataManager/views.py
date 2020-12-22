from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.generics import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
import pandas as pd

from .models import DataIntervalModel, InstrumentModel
from .serializers import InstrumentSerializerGET, InstrumentSerializerPOST, TickersSerializerGET


@csrf_exempt
def startPage(request):
    return render(request, 'DataEditor.html')

class InstrumentView(APIView):
    def get(self, request):
        instruments = DataIntervalModel.objects.all()

        serializer = InstrumentSerializerGET(instruments, many=True)

        return Response({'data': serializer.data})

    def post(self, request):
        instrument = request.data
        serializer = InstrumentSerializerPOST(data=instrument)
        if serializer.is_valid(raise_exception=False):
            instrument_saved = serializer.save()

        return Response({"success": f"Instrument '{serializer}' created successfully"})

    def delete(self, request, pk):
        instrument = get_object_or_404(DataIntervalModel.objects.all(), id=pk)
        instrument.delete()

        return Response({"message": "Data with id `{}` has been deleted.".format(pk)}, status=204)

class TickersView(APIView):
    def get(self, request):
        tickers = InstrumentModel.objects.all()

        serializer = TickersSerializerGET(tickers, many=True)

        return Response(serializer.data)

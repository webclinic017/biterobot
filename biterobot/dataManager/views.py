from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.generics import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import DataIntervalModel
from .serializers import InstrumentSerializerGET, InstrumentSerializerPOST
from .common import checkInstrumentExists


@csrf_exempt
def startPage(request):
    return render(request, 'DataEditor.html')

@csrf_exempt
def iframeDataEditor(request):
    return render(request, 'iframe_data.html')

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

        return Response({"success": "Instrument '{}' created successfully"})

    def delete(self, request, pk):
        print(pk)
        instrument = get_object_or_404(DataIntervalModel.objects.all(), id=pk)
        instrument.delete()

        return Response({"message": "Data with id `{}` has been deleted.".format(pk)}, status=204)

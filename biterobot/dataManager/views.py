from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import InstrumentModel
from .serializers import InstrumentSerializerGET, InstrumentSerializerPOST
from .common import checkInstrumentExists


@csrf_exempt
def startPage(request):
    return render(request, 'DataEditor.html')

@csrf_exempt
def iframeDataEditor(request):
    return render(request, 'biterobot/data.html')

class InstrumentView(APIView):
    def get(self, request):
        instruments = InstrumentModel.objects.all()
        serializer = InstrumentSerializerGET(instruments, many=True)

        return Response(serializer.data)

    def post(self, request):
        instrument = request.data
        serializer = InstrumentSerializerPOST(data=instrument)
        if serializer.is_valid(raise_exception=True):
            instrument_saved = serializer.save()

        return Response({"success": "Instrument '{}' created successfully".format(instrument_saved.name)})

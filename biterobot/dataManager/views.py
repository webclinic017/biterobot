from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import InstrumentModel
from .serializers import InstrumentSerializerGET


@csrf_exempt
def startPage(request):
    return render(request, 'data.html')

class InstrumentView(APIView):
    def get(self, request):
        instruments = InstrumentModel.objects.all()
        serializer = InstrumentSerializerGET(instruments, many=True)

        return Response(serializer.data)

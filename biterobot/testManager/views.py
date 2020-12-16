from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import TestModel
from .serializers import TestSerializerGET


@csrf_exempt
def startPage(request):
    return render(request, 'strategyEditor.html')

class TestView(APIView):
    def get(self, request):
        tests = TestModel.objects.all()
        serializer = TestSerializerGET(tests, many=True)

        return Response(serializer.data)

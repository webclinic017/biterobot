from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import TestModel
from .serializers import TestSerializerGET, TestSerializerPOST, FilePathSerializer


@csrf_exempt
def startPage(request):
    return render(request, 'strategyEditor.html')

class CheckView(APIView):
    def get(self, request):
        pass


class TestArchiveView(APIView):
    def get(self, request):
        tests = TestModel.objects.all()
        serializer = TestSerializerGET(tests, many=True)
        serializerFilePath = FilePathSerializer(many=True)

        return Response([{'data': serializer.data}, {'files': serializerFilePath.data}])

    def post(self, request):
        test = request.data
        serializer = TestSerializerPOST(data=test)
        if serializer.is_valid(raise_exception=False):
            test_saved = serializer.save()

        return Response({"success": "Test '{}' created successfully"})

from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_datatables_editor.viewsets import EditorModelMixin
import json
from django.http import JsonResponse, HttpResponseNotFound

from .models import TestModel
from .serializers import TestSerializerGET, TestSerializerPOST, FilePathSerializer, CheckSerializerGET, TestSerializerArchiveGET
from django.conf import settings


@csrf_exempt
def startPage(request):
    return render(request, 'strategyEditor.html')

# Вьюшка для Check status
class CheckView(APIView):
    def get(self, request, uuid):
        testModel = TestModel.objects.get(uuid=uuid)
        serializer = CheckSerializerGET(testModel)

        return Response(serializer.data)

# Вьюшка для результатов текущего теста
class TestView(APIView):
    def get(self, request, uuid):
        testModel = TestModel.objects.get(uuid=uuid)
        serializer = TestSerializerGET(testModel)

        return Response(serializer.data)

class TestArchiveView(APIView):
    def get(self, request, id):
        tests = TestModel.objects.filter(strategyId=id)
        serializer = TestSerializerArchiveGET(tests, many=True)
        serializerFilePath = FilePathSerializer(many=True)

        return Response(serializer.data)

    def post(self, request):
        test = request.data
        serializer = TestSerializerPOST(data=test)
        if serializer.is_valid(raise_exception=False):
            test_saved = serializer.save()

        return Response({"success": "Test '{}' created successfully"})

@csrf_exempt
def testView(request, id):
    testIdList = []
    nameList = []
    versionList = []
    dateTestList = []
    dateBeginList = []
    dateEndList = []
    fileIdList = []

    webPathList = []
    resultList = []
    startCashList = []
    endCashList = []

    tests = TestModel.objects.filter(strategyId=id)

    if len(tests) != 0:
        i = 0
        dataList = []
        fileList = []
        for test in tests:
            testIdList.append(test.id)
            nameList.append(test.name + '_' + str(test.id))
            versionList.append(test.version)
            dateTestList.append(test.dateTest)
            dateBeginList.append(test.dateBegin)
            dateEndList.append(test.dateEnd)
            fileIdList.append(i)

            dataList.append(
                {
                    "id": testIdList[i],
                    "name": nameList[i],
                    "version": versionList[i],
                    "dateTest": dateTestList[i],
                    "dateBegin": dateBeginList[i],
                    "dateEnd": dateEndList[i],
                    "files": [
                        {"id": fileIdList[i]}
                    ]
                }
            )

            webPathList.append(test.file)
            resultList.append(test.resultData)
            startCashList.append(test.startCash)
            endCashList.append(test.endCash)

            fileList.append(
                {
                    "web_path": webPathList[i],
                    "startCash": startCashList[i],
                    "endCash": endCashList[i],
                    "resultData": resultList[i]
                }
            )

            i += 1

        response = {
            "data":
                dataList,
            "files": {
                "files": fileList
            }
        }

        print(response)

        return JsonResponse(response)
    else:
        return HttpResponseNotFound()

@csrf_exempt
def graphView(request, graphName):
    return render(request, f'{settings.BASE_DIR}/testManager/resultGraphs/{graphName}')

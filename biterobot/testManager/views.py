from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse, HttpResponseNotFound

from .models import TestModel
from .serializers import TestSerializerGET, TestSerializerPOST, TestSerializerArchiveGET
from testManager.services import services
from testManager.services import dbServices


class CheckView(APIView):
    '''
    DRF view for one status of Test request. .R..
    '''
    # Handle GET-request for read status of Test by uuid(taskId) and return them
    def get(self, request, uuid):
        data = {
            "tstStatus": dbServices.getStatusInfo(taskId=uuid),
            "msg": ''
        }

        return Response(data)

class TestView(APIView):
    '''
    DRF view for one Test request. .R..
    '''
    # Handle GET-request for read one Test info from database and return them
    def get(self, request, uuid):
        testModel = TestModel.objects.get(uuid=uuid)

        serializer = TestSerializerGET(testModel)

        return Response(serializer.data)

class TestArchiveView(APIView):
    '''
    DRF view for Tests requests. CR..
    '''
    # Handle GET-request for read Tests info from database and return them
    def get(self, request, id):
        tests = TestModel.objects.filter(strategyId=id)

        serializer = TestSerializerArchiveGET(tests, many=True)

        return Response(serializer.data)

    # Handle POST-request for create new Test
    def post(self, request):
        test = request.data

        serializer = TestSerializerPOST(data=test)
        if serializer.is_valid(raise_exception=False):
            serializer.save()

        return Response({"success": "Test '{}' created successfully"})

# View that need to return results for one Strategy tests with a special structure of JSON, that needs for frontend tables
def testView(request, strategyId):
    strategyTests = services.getArchiveTests(strategyId=strategyId)

    if strategyTests != None:
        return JsonResponse(strategyTests)
    else:
        return HttpResponseNotFound()

# Return render template of Graph.html (file with testing results in Graph)
def graphView(request, graphName):
    return render(request, services.getGraphPath(graphName=graphName))

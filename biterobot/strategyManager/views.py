from django.shortcuts import render
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import StrategyModel
from .serializers import StrategySerializerGET, StrategySerializerPOST
from strategyManager.services import services


# Return render template of Strategies and Tests page
def startPage(request):
    return render(request, 'strategyEditor.html')

class StrategyView(APIView):
    '''
    DRF view for Strategies requests. CRUD
    '''
    # Handle GET-request for read Strategies from database and return them
    def get(self, request):
        strategies = StrategyModel.objects.all()

        serializer = StrategySerializerGET(strategies, many=True)

        return Response({'data': serializer.data})

    # Handle POST-request for create new Strategy
    def post(self, request):
        strategy = request.data

        serializer = StrategySerializerPOST(data=strategy)

        if serializer.is_valid(raise_exception=True):
            serializer.save()

        return Response({"success": "true"})

    # Handle PUT-request for update Strategy
    def put(self, request, pk):
        strategy = request.data
        
        saved_strategy = get_object_or_404(StrategyModel.objects.all(), id=pk)

        serializer = StrategySerializerPOST(instance=saved_strategy, data=strategy, partial=True)

        if serializer.is_valid(raise_exception=True):
            serializer.save()

        return Response({"success": "true"})

    # Handle DELETE-request for delete Strategy
    def delete(self, request, pk):
        services.deleteStrategy(id=pk)

        return Response({"message": "Strategy with name `{}` has been deleted.".format(pk)}, status=204)

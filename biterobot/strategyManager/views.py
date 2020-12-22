from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import F

from .models import StrategyModel
from .serializers import StrategySerializerGET, StrategySerializerPOST
from .common import deleteFile


# class StrategyViewSet(viewsets.ModelViewSet):
#     serializer_class = StrategySerializer
#     queryset = StrategyModel.objects.all()

@csrf_exempt
def startPage(request):
    return render(request, 'strategyEditor.html')

class StrategyView(APIView):
    def get(self, request):
        strategies = StrategyModel.objects.all()
        serializer = StrategySerializerGET(strategies, many=True)

        return Response({'data': serializer.data})

    def post(self, request):
        strategy = request.data
        serializer = StrategySerializerPOST(data=strategy)
        if serializer.is_valid(raise_exception=True):
            strategy_saved = serializer.save()

        return Response({"success": "true"})

    def put(self, request, pk):
        saved_strategy = get_object_or_404(StrategyModel.objects.all(), id=pk)
        data = request.data

        StrategyModel.objects.filter(id=data.pop('id')).update(version=F('version') + 1).save()

        serializer = StrategySerializerPOST(instance=saved_strategy, data=data, partial=True)
        if serializer.is_valid(raise_exception=True):
            strategy_saved = serializer.save()

        return Response({"success": "true"})


    def delete(self, request, pk):
        strategy = get_object_or_404(StrategyModel.objects.all(), id=pk)
        strategy.delete()

        deleteFile(filePath=f'strategies\\{strategy.name}.py')

        return Response({"message": "Strategy with name `{}` has been deleted.".format(pk)}, status=204)

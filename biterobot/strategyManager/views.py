from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

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

        return Response(serializer.data)

    def post(self, request):
        strategy = request.data
        serializer = StrategySerializerPOST(data=strategy)
        if serializer.is_valid(raise_exception=True):
            strategy_saved = serializer.save()

        return Response({"success": "Strategy '{}' created successfully".format(strategy_saved.name)})

    def put(self, request, pk):
        saved_strategy = get_object_or_404(StrategyModel.objects.all(), name=pk)
        data = request.data
        data.update({'name': pk})  # Подставляем имя, тк прередается пустое с фронта. Если пустое = Bad Request 400
        serializer = StrategySerializerPOST(instance=saved_strategy, data=data, partial=True)
        if serializer.is_valid(raise_exception=True):
            strategy_saved = serializer.save()

        return Response({"success": "Strategy '{}' updated successfully".format(strategy_saved.name)})


    def delete(self, request, pk):
        strategy = get_object_or_404(StrategyModel.objects.all(), name=pk)
        strategy.delete()

        deleteFile(filePath=f'strategies\\{pk}.txt')

        return Response({"message": "Strategy with name `{}` has been deleted.".format(pk)}, status=204)

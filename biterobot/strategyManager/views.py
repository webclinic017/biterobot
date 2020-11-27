from django.shortcuts import render
from rest_framework.generics import get_object_or_404
from rest_framework.renderers import StaticHTMLRenderer
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import StrategyModel
from .serializers import StrategySerializerGET, StrategySerializerPOST
from .common import deleteFile


# class StrategyViewSet(viewsets.ModelViewSet):
#     serializer_class = StrategySerializer
#     queryset = StrategyModel.objects.all()

class StrategyView(APIView):
    renderer_classes = [StaticHTMLRenderer]
    template_name = 'strategyEditor.html'

    def get(self, request):
        strategies = StrategyModel.objects.all()
        serializer = StrategySerializerGET(strategies, many=True)

        return render(request, self.template_name)

    def post(self, request):
        strategy = request.data
        serializer = StrategySerializerPOST(data=strategy)
        if serializer.is_valid(raise_exception=True):
            strategy_saved = serializer.save()

        return Response({"success": "Strategy '{}' created successfully".format(strategy_saved.name)})

    def put(self, request, pk):
        saved_strategy = get_object_or_404(StrategyModel.objects.all(), name=pk)
        data = request.data
        serializer = StrategySerializerPOST(instance=saved_strategy, data=data, partial=True)
        if serializer.is_valid(raise_exception=True):
            strategy_saved = serializer.save()

        return Response({"success": "Strategy '{}' updated successfully".format(strategy_saved.name)})


    def delete(self, request, pk):
        strategy = get_object_or_404(StrategyModel.objects.all(), name=pk)
        strategy.delete()

        deleteFile(filePath=f'strategies\\{pk}.txt')

        return Response({"message": "Strategy with name `{}` has been deleted.".format(pk)}, status=204)

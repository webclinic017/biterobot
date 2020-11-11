from rest_framework import viewsets

from .models import StrategyModel
from .serializers import StrategySerializer


class StrategyViewSet(viewsets.ModelViewSet):
    serializer_class = StrategySerializer
    queryset = StrategyModel.objects.all()

from rest_framework import serializers

from .models import StrategyModel


class StrategySerializer(serializers.ModelSerializer):
    class Meta:
        model = StrategyModel
        fields = ['name', 'description']

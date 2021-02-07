from django.shortcuts import render
from rest_framework import permissions
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User

from .models import StrategyModel
from .serializers import StrategySerializerGET, StrategySerializerPOST
from .common import deleteFile


# Return render template of Strategies and Tests page
def startPage(request):
    return render(request, 'strategyEditor.html')

class StrategyView(APIView):
    '''
    DRF view for Strategies requests. CRUD
    '''
    # Auth permissions
    permission_classes = [permissions.IsAuthenticated]

    # Handle GET-request for read Strategies from database and return them
    def get(self, request):
        ownerId = User.objects.filter(auth_token=request.headers['Authorization'])

        strategies = StrategyModel.objects.all(userId=ownerId)
        serializer = StrategySerializerGET(strategies, many=True)

        return Response({'data': serializer.data})

    # Handle POST-request for create new Strategy
    def post(self, request):
        strategy = request.data

        # Add user auth token from headers in context
        strategy.update({'userToken': request.headers['Authorization']})

        serializer = StrategySerializerPOST(data=strategy)

        if serializer.is_valid(raise_exception=True):
            serializer.save()

        return Response({"success": "true"})

    # Handle PUT-request for update Strategy
    def put(self, request, pk):
        saved_strategy = get_object_or_404(StrategyModel.objects.all(), id=pk)
        data = request.data
        serializer = StrategySerializerPOST(instance=saved_strategy, data=data, partial=True)

        if serializer.is_valid(raise_exception=True):
            serializer.save()

        return Response({"success": "true"})

    # Handle DELETE-request for delete Strategy
    def delete(self, request, pk):
        strategy = get_object_or_404(StrategyModel.objects.all(), id=pk)
        strategy.delete()

        deleteFile(filePath=f'strategies/{strategy.name}.py')  # Delete Strategy file

        return Response({"message": "Strategy with name `{}` has been deleted.".format(pk)}, status=204)

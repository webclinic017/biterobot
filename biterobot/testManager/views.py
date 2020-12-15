from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def startPage(request):
    return render(request, 'strategyEditor.html')

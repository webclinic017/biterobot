from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def indexPage(request):
    return render(request, 'index.html')

def index(request):
    return redirect('index.html')

def strategyManager(request):
    return redirect('strategyManager/')

def dataManager(request):
    return redirect('dataManager/')

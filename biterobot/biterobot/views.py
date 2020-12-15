from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def indexPage(request):
    return render(request, 'index.html')

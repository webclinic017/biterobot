from django.shortcuts import render, redirect


# Return render template of Main page
def indexPage(request):
    return render(request, 'index.html')

# Redirect on Main page from '/'
def index(request):
    return redirect('index.html')

# Return render template of Documentation page
def documentationPage(request):
    return render(request, 'Documentation.html')

# Redirect on strategyManager app's urls
def strategyManager(request):
    return redirect('strategyManager/')

# Redirect on dataManager app's urls
def dataManager(request):
    return redirect('dataManager/')

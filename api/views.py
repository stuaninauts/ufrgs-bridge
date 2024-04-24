from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics

from .serializer import ActivitySerializer
from .models import Activity

# Create your views here.
def homepage(request):
    return HttpResponse('Homepage')

class ActivityView(generics.ListAPIView):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer

## uses this to create a new activity
""" class ActivityView(generics.CreateAPIView):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer """
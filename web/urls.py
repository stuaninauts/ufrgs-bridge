from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('search', index),
    path('home', index),
    path('auth', index),
]
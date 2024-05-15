from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('search', index),
    path('login', index),
    path('register', index),
    path('home', index),
]
from django.urls import path
from .views import RegisterView, LoginView, ActivateView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('activate/<str:token>/', ActivateView.as_view(), name='activate'),
]

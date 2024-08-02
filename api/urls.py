from django.urls import path
from .views import RegisterView, LoginView, ActivateView, ProjectCreateView, ProjectAllListView, ProjectMyListView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('activate/<str:token>/', ActivateView.as_view(), name='activate'),
    path('create_project/', ProjectCreateView.as_view(), name='create_project'),
    path('list_projects/', ProjectAllListView.as_view(), name='list_projects'),
    path('list_my_projects/', ProjectMyListView.as_view(), name='list_my_projects'),
]

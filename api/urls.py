from django.urls import path
from .views import RegisterView, LoginView, ActivateView
from .views import ProjectCreateView, ProjectAllListView, ProjectMyListView
from .views import ApplicationFormCreateView, ApplicationResponseListView
from .views import ApplicationFormDetailView, ApplyToProjectView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('activate/<str:token>/', ActivateView.as_view(), name='activate'),
    path('create_project/', ProjectCreateView.as_view(), name='create_project'),
    path('list_projects/', ProjectAllListView.as_view(), name='list_projects'),
    path('list_my_projects/', ProjectMyListView.as_view(), name='list_my_projects'),
    path('create_form/', ApplicationFormCreateView.as_view(), name='create_form'),
    path('responses/<int:project_id>/', ApplicationResponseListView.as_view(), name='responses'),
    path('form_details/<int:project_id>/', ApplicationFormDetailView.as_view(), name='form_details'),
    path('apply_to_project/', ApplyToProjectView.as_view(), name='apply_to_project'),
]

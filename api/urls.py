from django.urls import path
from .views import RegisterView, LoginView, ActivateView
from .views import ProjectCreateView, ProjectAllListView, ProjectMyListView, ProjectSearchView
from .views import ApplicationFormCreateView, ApplicationResponseListView
from .views import ApplicationFormDetailView, ApplyToProjectView
from .views import ApplicationResponseDetailView, UserProjectsView, UserProfileView
from .views import EditProjectView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('activate/<str:token>/', ActivateView.as_view(), name='activate'),
    path('create_project/', ProjectCreateView.as_view(), name='create_project'),
    path('list_projects/', ProjectAllListView.as_view(), name='list_projects'),
    path('list_my_projects/', ProjectMyListView.as_view(), name='list_my_projects'),
    path('search_projects/', ProjectSearchView.as_view(), name='search_projects'),
    path('create_form/', ApplicationFormCreateView.as_view(), name='create_form'),
    path('form_details/<int:project_id>/', ApplicationFormDetailView.as_view(), name='form_details'),
    path('apply_to_project/', ApplyToProjectView.as_view(), name='apply_to_project'),
    path('responses/<int:project_id>/', ApplicationResponseListView.as_view(), name='responses'),
    path('response_action/<int:pk>/', ApplicationResponseDetailView.as_view(), name='response_action'),
    path('user/projects/', UserProjectsView.as_view(), name='user-projects'),
    path('user/profile/', UserProfileView.as_view(), name='user-profile'),
    path('edit_project/<int:pk>/', EditProjectView.as_view(), name='edit_project'),
]

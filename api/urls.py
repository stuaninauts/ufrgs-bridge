from django.urls import path
from .views import homepage, ActivityView

urlpatterns = [
    #path('home', hello),
    path('', homepage),
    path('list', ActivityView.as_view())
]

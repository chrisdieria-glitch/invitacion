from django.urls import path
from . import views

urlpatterns =[
    path("csrf/",views.csrf),
    path('',views.api_home)
]
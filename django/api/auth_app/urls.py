from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("google", views.google_login, name="google_login"),
    path("logout", views.logout, name="logout"),
]

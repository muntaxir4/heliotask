from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path("", views.get_user, name="get_user"),
    path("tasks", views.tasks_view, name="tasks_view"),
    path("create-task", views.create_task, name="create_task"),
    path("change-task-status", views.change_task_status, name="change_task_status"),
    path("update-task", views.update_task, name="update_task"),
    path("delete-task", views.delete_task, name="delete_task"),
]

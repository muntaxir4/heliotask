from django.shortcuts import render
from django.http import HttpRequest, JsonResponse
from django.views.decorators.http import require_GET, require_POST, require_http_methods
from auth_app.extras import authenticate_user
from auth_app.models import User
from datetime import datetime
from .models import Task
import json


# Create your views here.
@require_GET
@authenticate_user
def get_user(request: HttpRequest):
    try:
        userId = request.userId
        print(userId)
        user = User.objects.get(id=userId)
        return JsonResponse({"message": "Request Successful", "user": user.to_dict()})
    except Exception as e:
        print("Exception occurred:", e)
        return JsonResponse({"message": "Internal Server Error"}, status=500)


@require_http_methods(["GET", "POST"])
def tasks_view(request):
    if request.method == "GET":
        return get_tasks(request)
    elif request.method == "POST":
        return get_filtered_tasks(request)


@require_POST
@authenticate_user
def create_task(request: HttpRequest):
    try:
        userId = request.userId
        data = json.loads(request.body)
        title = data.get("title")
        description = data.get("description")
        status = data.get("status")
        priority = data.get("priority")
        dueDateTime = data.get("dueDateTime")
        print(data, status == "")

        if status == "":
            status = "TO_DO"
        if priority == "":
            priority = "LOW"

        dueDate = datetime.fromtimestamp(dueDateTime / 1000) if dueDateTime else None

        task = Task(
            title=title,
            description=description,
            status=status,
            priority=priority,
            dueDate=dueDate,
            user_id=userId,
        )
        task.save()
        return JsonResponse(
            {"message": "Task created successfully", "task": task.to_dict()}
        )
    except Exception as e:
        print("Exception occurred:", e)
        return JsonResponse({"message": "Internal Server Error"}, status=500)


@require_GET
@authenticate_user
def get_tasks(request: HttpRequest):
    try:
        userId = request.userId
        status = request.GET.get("status")
        print(status)
        if not status:
            return JsonResponse({"message": "Status is required"}, status=400)
        tasks = Task.objects.filter(user_id=userId, status=status)
        return JsonResponse(
            {
                "message": "Request Successful",
                "statusTasks": [task.to_dict() for task in tasks],
            }
        )
    except Exception as e:
        print("Exception occurred:", e)
        return JsonResponse({"message": "Internal Server Error"}, status=500)


@require_POST
@authenticate_user
def change_task_status(request: HttpRequest):
    try:
        userId = request.userId
        data = json.loads(request.body)
        taskId = data.get("taskId")
        status = data.get("status")
        if not taskId or not status:
            return JsonResponse(
                {"message": "Task ID and Status are required"}, status=400
            )
        task = Task.objects.get(id=taskId)
        if task.user.id != userId:
            return JsonResponse({"message": "Unauthorized"}, status=401)
        task.status = status
        task.save()
        return JsonResponse(
            {"message": "Task status updated successfully", "task": task.to_dict()}
        )
    except Exception as e:
        print("Exception occurred:", e)
        return JsonResponse({"message": "Internal Server Error"}, status=500)


@require_POST
@authenticate_user
def get_filtered_tasks(request: HttpRequest):
    try:
        userId = request.userId
        data = json.loads(request.body)
        page = data.get("page", 1)
        status = data.get("status")
        priority = data.get("priority")
        dueDateRange = data.get("dueDateRange")
        sortBy = data.get("sortBy")

        query = Task.objects.filter(user_id=userId)
        if status:
            query = query.filter(status=status)
        if priority:
            query = query.filter(priority=priority)
        if dueDateRange:
            from_date = (
                datetime.fromtimestamp(dueDateRange.get("from") / 1000)
                if dueDateRange.get("from")
                else None
            )
            to_date = (
                datetime.fromtimestamp(dueDateRange.get("to") / 1000)
                if dueDateRange.get("to")
                else None
            )
            if from_date:
                query = query.filter(dueDate__gte=from_date) | query.filter(
                    dueDate__isnull=True
                )
            if to_date:
                query = query.filter(dueDate__lte=to_date) | query.filter(
                    dueDate__isnull=True
                )

        tasks = query.order_by("-createdAt")[(page - 1) * 10 : page * 10]
        tasks_list = [task.to_dict() for task in tasks]

        # Custom Sorting
        if sortBy and "status" in sortBy:
            status_order = ["TO_DO", "IN_PROGRESS", "COMPLETED"]
            sign = 1 if "asc" in sortBy else -1
            tasks_list.sort(
                key=lambda x: (
                    sign * status_order.index(x["status"]),
                    sign * x["createdAt"].timestamp(),
                )
            )
        elif sortBy and "priority" in sortBy:
            priority_order = ["LOW", "MEDIUM", "HIGH"]
            sign = 1 if "asc" in sortBy else -1
            tasks_list.sort(
                key=lambda x: (
                    sign * priority_order.index(x["priority"]),
                    sign * x["createdAt"].timestamp(),
                )
            )
        elif sortBy and "dueDate" in sortBy:
            sign = 1 if "asc" in sortBy else -1
            tasks_list.sort(
                key=lambda x: (
                    sign * (x["dueDate"].timestamp() if x["dueDate"] else float("inf")),
                    sign * x["createdAt"].timestamp(),
                )
            )
        return JsonResponse({"message": "Request Successful", "tasks": tasks_list})
    except Exception as e:
        print("Exception occurred:", e)
        return JsonResponse({"message": "Internal Server Error"}, status=500)


@require_http_methods(["PUT"])
@authenticate_user
def update_task(request: HttpRequest):
    try:
        userId = request.userId
        data = json.loads(request.body)
        taskId = data.get("taskId")
        title = data.get("title")
        description = data.get("description")
        status = data.get("status")
        priority = data.get("priority")
        dueDateTime = data.get("dueDateTime")
        if not taskId:
            return JsonResponse({"message": "Task ID is required"}, status=400)
        task = Task.objects.get(id=taskId)
        if task.user.id != userId:
            return JsonResponse({"message": "Unauthorized"}, status=401)
        if title:
            task.title = title
        if description:
            task.description = description
        if status:
            task.status = status
        if priority:
            task.priority = priority
        if dueDateTime:
            task.dueDate = datetime.fromtimestamp(dueDateTime / 1000)
        task.save()
        return JsonResponse(
            {"message": "Task updated successfully", "task": task.to_dict()}
        )
    except Exception as e:
        print("Exception occurred:", e)
        return JsonResponse({"message": "Internal Server Error"}, status=500)


@require_http_methods(["DELETE"])
@authenticate_user
def delete_task(request: HttpRequest):
    try:
        userId = request.userId
        data = request.GET
        taskId = data.get("taskId")
        if not taskId:
            return JsonResponse({"message": "Task ID is required"}, status=400)
        task = Task.objects.get(id=taskId)
        if task.user.id != userId:
            return JsonResponse({"message": "Unauthorized"}, status=401)
        task.delete()
        return JsonResponse({"message": "Task deleted successfully"})
    except Exception as e:
        print("Exception occurred:", e)
        return JsonResponse({"message": "Internal Server Error"}, status=500)

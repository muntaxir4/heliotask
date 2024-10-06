from app.models import User, Task
from flask import Blueprint
from app.app import db
from app.auth.extras import authenticate_user
from flask import request
from datetime import datetime
from sqlalchemy import or_

user = Blueprint("user", __name__)


@user.route("/")
@authenticate_user
def index(userId):
    try:
        user = User.query.get(userId)
        if not user:
            return {"message": "User not found"}, 404
        return {"message": "Request Successful", "user": user.to_dict()}
    except Exception as e:
        print("Exception occurred:", e)
        return {"message": "Internal Server Error"}, 500


@user.route("/create-task", methods=["POST"])
@authenticate_user
def create_task(userId):
    try:
        data = request.get_json()
        if not data or "title" not in data:
            return {"message": "Title is required"}, 400

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
            userId=userId,
        )
        db.session.add(task)
        db.session.commit()
        return {"message": "Task created successfully", "task": task.to_dict()}
    except Exception as e:
        print("Exception occurred:", e)
        return {"message": "Internal Server Error"}, 500


@user.route("/tasks", methods=["GET"])
@authenticate_user
def get_tasks(userId):
    try:
        status = request.args.get("status")
        if not status:
            return {"message": "Status is required"}, 400

        tasks = Task.query.filter_by(userId=userId, status=status).all()
        tasks_list = [task.to_dict() for task in tasks]

        return {"message": "Request Successful", "statusTasks": tasks_list}, 200
    except Exception as e:
        print("Exception occurred:", e)
        return {"message": "Internal Server Error"}, 500


@user.route("/change-task-status", methods=["POST"])
@authenticate_user
def change_task_status(userId):
    try:
        data = request.get_json()
        taskId = data.get("taskId")
        status = data.get("status")

        if not taskId or not status:
            return {"message": "Task ID and status required"}, 400

        task = Task.query.filter_by(id=taskId, userId=userId).first()
        if not task:
            return {"message": "Task not found"}, 404

        task.status = status
        db.session.commit()

        return {"message": "Task status updated", "task": task.to_dict()}, 200
    except Exception as e:
        print("Exception occurred:", e)
        return {"message": "Internal Server Error"}, 500


@user.route("/tasks", methods=["POST"])
@authenticate_user
def get_filtered_tasks(userId):
    try:
        data = request.get_json()
        page = data.get("page", 1)
        status = data.get("status")
        priority = data.get("priority")
        dueDateRange = data.get("dueDateRange")
        sortBy = data.get("sortBy")

        query = Task.query.filter_by(userId=userId)

        if status:
            query = query.filter(Task.status.in_(status))
        if priority:
            query = query.filter(Task.priority.in_(priority))
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
                query = query.filter(
                    or_(Task.dueDate >= from_date, Task.dueDate == None)
                )
            if to_date:
                query = query.filter(or_(Task.dueDate <= to_date, Task.dueDate == None))

        tasks = (
            query.order_by(Task.createdAt.desc())
            .offset((page - 1) * 10)
            .limit(10)
            .all()
        )
        tasks_list = [task.to_dict() for task in tasks]

        # Custom sorting
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

        return {"message": "Request Successful", "tasks": tasks_list}, 200
    except Exception as e:
        print("Exception occurred:", e)
        return {"message": "Internal Server Error"}, 500


@user.route("/update-task", methods=["PUT"])
@authenticate_user
def update_task(userId):
    try:
        data = request.get_json()
        taskId = data.get("taskId")
        title = data.get("title")
        description = data.get("description")
        status = data.get("status")
        priority = data.get("priority")
        dueDateTime = data.get("dueDateTime")

        if not taskId:
            return {"message": "Task ID is required"}, 400

        task = Task.query.filter_by(id=taskId, userId=userId).first()
        if not task:
            return {"message": "Task not found"}, 404

        task.title = title if title else task.title
        task.description = description if description else task.description
        task.status = status if status else task.status
        task.priority = priority if priority else task.priority
        task.dueDate = (
            datetime.fromtimestamp(dueDateTime / 1000) if dueDateTime else task.dueDate
        )

        db.session.commit()

        return {"message": "Task updated successfully", "task": task.to_dict()}, 200
    except Exception as e:
        print("Exception occurred:", e)
        return {"message": "Internal Server Error"}, 500


@user.route("/delete-task", methods=["DELETE"])
@authenticate_user
def delete_task(userId):
    try:
        taskId = request.args.get("taskId")

        if not taskId:
            return {"message": "Task ID is required"}, 400

        task = Task.query.filter_by(id=taskId, userId=userId).first()
        if not task:
            return {"message": "Task not found"}, 404

        db.session.delete(task)
        db.session.commit()

        return {"message": "Task deleted successfully"}, 200
    except Exception as e:
        print("Exception occurred:", e)
        return {"message": "Internal Server Error"}, 500

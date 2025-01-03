from django.db import models
from auth_app.models import User


class TaskStatusEnum(models.TextChoices):
    TO_DO = "TO_DO"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"


class TaskPriorityEnum(models.TextChoices):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


# Create your models here.
class Task(models.Model):
    id = models.IntegerField(primary_key=True, auto_created=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(
        max_length=20, choices=TaskStatusEnum.choices, default=TaskStatusEnum.TO_DO
    )
    priority = models.CharField(
        max_length=20, choices=TaskPriorityEnum.choices, default=TaskPriorityEnum.LOW
    )
    createdAt = models.DateTimeField(auto_now_add=True)
    dueDate = models.DateTimeField(null=True, blank=True)
    user = models.ForeignKey(User, related_name="tasks", on_delete=models.CASCADE)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "priority": self.priority,
            "createdAt": self.createdAt,
            "dueDate": self.dueDate,
        }

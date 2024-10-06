import enum
from app.app import db
from sqlalchemy.types import Enum as BaseEnum
from datetime import datetime


class TaskStatusEnum(str, enum.Enum):
    TO_DO = "TO_DO"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"


class TaskPriorityEnum(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class Task(db.Model):
    __tablename__ = "task"
    id: int = db.Column(db.Integer, primary_key=True)
    title: str = db.Column(db.Text, nullable=False)
    description: str | None = db.Column(db.Text)
    status: TaskStatusEnum = db.Column(
        BaseEnum(TaskStatusEnum), default=TaskStatusEnum.TO_DO
    )
    priority: TaskPriorityEnum = db.Column(
        BaseEnum(TaskPriorityEnum), default=TaskPriorityEnum.LOW
    )
    createdAt: datetime = db.Column(db.DateTime, default=datetime.utcnow)
    dueDate: datetime | None = db.Column(db.DateTime)
    userId: int = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

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


class User(db.Model):
    __tablename__ = "user"
    id: int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.Text, nullable=False)
    email: str = db.Column(db.Text, nullable=False)
    avatarUrl: str = db.Column(db.Text, nullable=False)
    tasks = db.relationship("Task", backref="user", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "avatarUrl": self.avatarUrl,
            "tasks": [task.to_dict() for task in self.tasks],
        }

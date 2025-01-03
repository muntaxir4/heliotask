from django.db import models


# Create your models here.
class User(models.Model):
    id = models.IntegerField(primary_key=True, auto_created=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    avatarUrl = models.URLField(max_length=200, blank=True, null=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "avatarUrl": self.avatarUrl,
            "tasks": [task.to_dict() for task in self.tasks.all()],
        }

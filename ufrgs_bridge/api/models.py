from django.db import models


# Create your models here.
class Activity(models.Model):
    mentor = models.CharField(max_length=50, default="")
    title = models.CharField(max_length=50, default="")
    weekly_hours = models.IntegerField(null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
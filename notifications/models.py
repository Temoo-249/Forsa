from django.db import models
from django.conf import settings

class Notification(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    icon = models.CharField(max_length=50, default='Bell')
    title = models.CharField(max_length=255)
    time = models.CharField(max_length=100, default='الآن')
    unread = models.BooleanField(default=True)
    action_tab = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.username}: {self.title}"

from django.db import models
from django.conf import settings

class Conversation(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='conversations')
    company_name = models.CharField(max_length=255)
    company_logo = models.CharField(max_length=255, default='💼')
    last_message = models.TextField(blank=True)
    last_message_time = models.CharField(max_length=100, default='الآن')
    unread_count = models.IntegerField(default=0)
    is_online = models.BooleanField(default=False)
    job_title = models.CharField(max_length=255, blank=True)
    shared_files = models.JSONField(default=list, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.company_name} - {self.user.username}"

class Message(models.Model):
    SENDER_CHOICES = (
        ('user', 'user'),
        ('company', 'company'),
    )
    id = models.CharField(max_length=100, primary_key=True)
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.CharField(max_length=20, choices=SENDER_CHOICES, default='company')
    text = models.TextField(blank=True, null=True)
    time = models.CharField(max_length=100, default='الآن')
    is_offer = models.BooleanField(default=False)
    offer_details = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message {self.id} in {self.conversation.id}"

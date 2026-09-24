from django.db import models
from django.conf import settings

class Conversation(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='conversations')
    peer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_conversations', null=True, blank=True)
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


class HireOffer(models.Model):
    STATUS_CHOICES = [('sent', 'Sent'), ('accepted', 'Accepted'), ('declined', 'Declined'), ('negotiating', 'Negotiating')]
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='hire_offers')
    company = models.ForeignKey('companies.Company', on_delete=models.CASCADE, related_name='hire_offers')
    candidate = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_hire_offers')
    job = models.ForeignKey('jobs.Job', on_delete=models.SET_NULL, null=True, blank=True, related_name='hire_offers')
    offer_details = models.TextField()
    salary_offered = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='sent')
    sent_at = models.DateTimeField(auto_now_add=True)
    responded_at = models.DateTimeField(null=True, blank=True)

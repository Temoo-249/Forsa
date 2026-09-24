from django.contrib import admin
from .models import Conversation, Message, HireOffer

@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ('id', 'company_name', 'job_title', 'last_message_time', 'unread_count')

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'conversation', 'sender', 'time', 'is_offer')

admin.site.register(HireOffer)

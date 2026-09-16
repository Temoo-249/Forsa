from rest_framework import serializers
from .models import Conversation, Message

class MessageSerializer(serializers.ModelSerializer):
    isOffer = serializers.BooleanField(source='is_offer', required=False)
    offerDetails = serializers.JSONField(source='offer_details', required=False, allow_null=True)

    class Meta:
        model = Message
        fields = ['id', 'sender', 'text', 'time', 'isOffer', 'offerDetails']

class ConversationSerializer(serializers.ModelSerializer):
    companyName = serializers.CharField(source='company_name', required=False)
    companyLogo = serializers.CharField(source='company_logo', required=False)
    lastMessage = serializers.CharField(source='last_message', required=False)
    lastMessageTime = serializers.CharField(source='last_message_time', required=False)
    unreadCount = serializers.IntegerField(source='unread_count', required=False)
    isOnline = serializers.BooleanField(source='is_online', required=False)
    jobTitle = serializers.CharField(source='job_title', required=False)
    sharedFiles = serializers.JSONField(source='shared_files', required=False)
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = [
            'id', 'companyName', 'companyLogo', 'lastMessage', 'lastMessageTime',
            'unreadCount', 'isOnline', 'jobTitle', 'sharedFiles', 'messages'
        ]

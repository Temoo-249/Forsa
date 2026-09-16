from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    actionTab = serializers.CharField(source='action_tab', required=False, allow_null=True)

    class Meta:
        model = Notification
        fields = ['id', 'icon', 'title', 'time', 'unread', 'actionTab']

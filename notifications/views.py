from rest_framework import status, views
from rest_framework.response import Response
from rest_framework import permissions
from .models import Notification
from .serializers import NotificationSerializer
from accounts.models import User

class NotificationListView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        user = request.user
        notifications = Notification.objects.filter(user=user).order_by('-created_at')
        return Response(NotificationSerializer(notifications, many=True).data)

class MarkAllNotificationsReadView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        user = request.user
        Notification.objects.filter(user=user).update(unread=False)
        return Response({'message': 'All notifications marked as read'})

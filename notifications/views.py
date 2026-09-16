from rest_framework import status, views
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer
from accounts.models import User

class NotificationListView(views.APIView):
    def get(self, request):
        user = request.user if request.user.is_authenticated else User.objects.first()
        notifications = Notification.objects.filter(user=user).order_by('-created_at')
        return Response(NotificationSerializer(notifications, many=True).data)

class MarkAllNotificationsReadView(views.APIView):
    def post(self, request):
        user = request.user if request.user.is_authenticated else User.objects.first()
        Notification.objects.filter(user=user).update(unread=False)
        return Response({'message': 'All notifications marked as read'})

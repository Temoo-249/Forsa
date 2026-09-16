from django.urls import path
from .views import NotificationListView, MarkAllNotificationsReadView

urlpatterns = [
    path('', NotificationListView.as_view(), name='notification_list'),
    path('mark-all-read/', MarkAllNotificationsReadView.as_view(), name='mark_all_read'),
]

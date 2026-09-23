from django.urls import path
from .views import (
    PostListCreateView,
    PostDetailView,
    ToggleLikePostView,
    PostCommentsView,
    PostCommentDetailView,
)

urlpatterns = [
    path('', PostListCreateView.as_view(), name='post_list_create'),
    path('<str:pk>/', PostDetailView.as_view(), name='post_detail'),
    path('<str:pk>/like/', ToggleLikePostView.as_view(), name='toggle_like_post'),
    path('<str:pk>/comments/', PostCommentsView.as_view(), name='post_comments'),
    path('comments/<str:pk>/', PostCommentDetailView.as_view(), name='post_comment_detail'),
]
from django.urls import path
from .views import PostListCreateView, ToggleLikePostView, PostCommentsView

urlpatterns = [
    path('', PostListCreateView.as_view(), name='post_list_create'),
    path('<str:pk>/like/', ToggleLikePostView.as_view(), name='toggle_like_post'),
    path('<str:pk>/comments/', PostCommentsView.as_view(), name='post_comments'),
]

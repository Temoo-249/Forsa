from rest_framework import serializers
from .models import Post, PostLike, PostComment

class PostCommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.get_full_name', read_only=True)
    userAvatar = serializers.CharField(source='user.avatar', read_only=True)

    class Meta:
        model = PostComment
        fields = ['id', 'username', 'userAvatar', 'content', 'created_at']

class PostSerializer(serializers.ModelSerializer):
    authorName = serializers.CharField(source='author_name', required=False)
    authorHeadline = serializers.CharField(source='author_headline', required=False)
    authorAvatar = serializers.CharField(source='author_avatar', required=False)
    avatarColor = serializers.CharField(source='avatar_color', required=False)
    timeAgo = serializers.CharField(source='time_ago', required=False)
    likes = serializers.IntegerField(source='likes_count', required=False)
    comments = serializers.IntegerField(source='comments_count', required=False)
    isLiked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id', 'authorName', 'authorHeadline', 'authorAvatar', 'avatarColor',
            'timeAgo', 'content', 'skills', 'likes', 'comments', 'isLiked', 'category', 'image'
        ]

    def get_isLiked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return PostLike.objects.filter(user=request.user, post=obj).exists()
        return False

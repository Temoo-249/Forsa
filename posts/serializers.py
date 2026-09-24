from rest_framework import serializers
from .models import Post, PostLike, PostComment

class PostCommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.get_full_name', read_only=True)
    userAvatar = serializers.CharField(source='user.avatar', read_only=True)

    class Meta:
        model = PostComment
        fields = ['id', 'username', 'userAvatar', 'content', 'created_at']

from django.utils import timezone

class PostSerializer(serializers.ModelSerializer):
    authorId = serializers.UUIDField(source='author_id', read_only=True)
    authorName = serializers.CharField(source='author_name', required=False)
    authorHeadline = serializers.CharField(source='author_headline', required=False)
    authorAvatar = serializers.CharField(source='author_avatar', required=False)
    avatarColor = serializers.CharField(source='avatar_color', required=False)
    timeAgo = serializers.SerializerMethodField()  # ← التغيير
    likes = serializers.IntegerField(source='likes_count', required=False)
    comments = serializers.IntegerField(source='comments_count', required=False)
    isLiked = serializers.SerializerMethodField()

    def get_timeAgo(self, obj):
        if not obj.created_at:
            return 'الآن'
        now = timezone.now()
        diff = (now - obj.created_at).total_seconds()
        if diff < 60:
            return 'الآن'
        elif diff < 3600:
            return f'منذ {int(diff // 60)} دقيقة'
        elif diff < 86400:
            return f'منذ {int(diff // 3600)} ساعة'
        elif diff < 2592000:
            return f'منذ {int(diff // 86400)} يوم'
        elif diff < 31536000:
            return f'منذ {int(diff // 2592000)} شهر'
        else:
            return f'منذ {int(diff // 31536000)} سنة'
    class Meta:
        model = Post
        fields = [
            'id', 'authorId', 'authorName', 'authorHeadline', 'authorAvatar', 'avatarColor',
            'timeAgo', 'content', 'skills', 'likes', 'comments', 'isLiked', 'category', 'image'
        ]

    def get_isLiked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return PostLike.objects.filter(user=request.user, post=obj).exists()
        return False

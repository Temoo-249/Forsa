from django.db import models
from django.conf import settings

class Post(models.Model):
    CATEGORY_CHOICES = (
        ('عام', 'عام'),
        ('عرض مهارات', 'عرض مهارات'),
        ('إنجاز', 'إنجاز'),
        ('سؤال', 'سؤال'),
    )
    id = models.CharField(max_length=100, primary_key=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts')
    author_name = models.CharField(max_length=255)
    author_headline = models.TextField(blank=True)
    author_avatar = models.CharField(max_length=255, default='أر')
    avatar_color = models.CharField(max_length=100, default='from-blue-600 to-indigo-600')
    time_ago = models.CharField(max_length=100, default='الآن')
    content = models.TextField()
    skills = models.JSONField(default=list, blank=True)
    likes_count = models.IntegerField(default=0)
    comments_count = models.IntegerField(default=0)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='عام')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Post by {self.author_name} ({self.id})"

class PostLike(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='liked_posts')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='post_likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')

class PostComment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='post_comments')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.username} on {self.post.id}"

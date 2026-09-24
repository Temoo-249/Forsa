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
    image = models.TextField(blank=True, null=True)
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


class PostSkillTag(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='skill_tags')
    name = models.CharField(max_length=100)

    class Meta:
        constraints = [models.UniqueConstraint(fields=['post', 'name'], name='unique_post_skill_tag')]

class PostComment(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='replies')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def save(self, *args, **kwargs):
        if not self.id:
            import uuid
            self.id = f"comment-{uuid.uuid4().hex[:8]}"
        super().save(*args, **kwargs)

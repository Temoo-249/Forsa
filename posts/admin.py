from django.contrib import admin
from .models import Post, PostLike, PostComment

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'author_name', 'category', 'likes_count', 'comments_count', 'created_at')

admin.site.register(PostLike)
admin.site.register(PostComment)

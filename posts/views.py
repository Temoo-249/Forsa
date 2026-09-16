from rest_framework import status, views
from rest_framework.response import Response
from .models import Post, PostLike, PostComment
from .serializers import PostSerializer, PostCommentSerializer
from accounts.models import User
import uuid

class PostListCreateView(views.APIView):
    def get(self, request):
        category = request.query_params.get('category')
        queryset = Post.objects.all().order_by('-created_at')
        if category and category != 'الكل':
            queryset = queryset.filter(category=category)
        serializer = PostSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        user = request.user if request.user.is_authenticated else User.objects.first()
        content = request.data.get('content', '')
        skills = request.data.get('skills', [])
        category = request.data.get('category', 'عام')

        post = Post.objects.create(
            id=f"post-{uuid.uuid4().hex[:6]}",
            author=user,
            author_name=user.get_full_name() or user.username,
            author_headline=user.headline or 'مطور برمجيات',
            author_avatar=user.avatar,
            avatar_color='from-blue-600 to-indigo-600',
            time_ago='الآن',
            content=content,
            skills=skills,
            likes_count=0,
            comments_count=0,
            category=category
        )
        return Response(PostSerializer(post, context={'request': request}).data, status=status.HTTP_201_CREATED)

class ToggleLikePostView(views.APIView):
    def post(self, request, pk):
        try:
            post = Post.objects.get(id=pk)
        except Post.DoesNotExist:
            return Response({'detail': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user if request.user.is_authenticated else User.objects.first()
        liked = PostLike.objects.filter(user=user, post=post).first()
        if liked:
            liked.delete()
            post.likes_count = max(0, post.likes_count - 1)
            post.save()
            return Response({'isLiked': False, 'likes': post.likes_count})
        else:
            PostLike.objects.create(user=user, post=post)
            post.likes_count += 1
            post.save()
            return Response({'isLiked': True, 'likes': post.likes_count})

class PostCommentsView(views.APIView):
    def get(self, request, pk):
        try:
            post = Post.objects.get(id=pk)
        except Post.DoesNotExist:
            return Response({'detail': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
        comments = post.comments.all().order_by('created_at')
        return Response(PostCommentSerializer(comments, many=True).data)

    def post(self, request, pk):
        try:
            post = Post.objects.get(id=pk)
        except Post.DoesNotExist:
            return Response({'detail': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user if request.user.is_authenticated else User.objects.first()
        content = request.data.get('content', '')
        comment = PostComment.objects.create(user=user, post=post, content=content)
        post.comments_count += 1
        post.save()
        return Response(PostCommentSerializer(comment).data, status=status.HTTP_201_CREATED)

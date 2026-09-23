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
        if not user:
            return Response({'detail': 'No user available'}, status=status.HTTP_401_UNAUTHORIZED)

        content = request.data.get('content', '')
        skills = request.data.get('skills', [])
        category = request.data.get('category', 'عام')

        post = Post.objects.create(
            id=f"post-{uuid.uuid4().hex[:6]}",
            author=user,
            author_name=user.get_full_name() or user.username,
            author_headline=user.headline or 'مستخدم ',
            author_avatar=user.avatar,
            avatar_color='from-blue-600 to-indigo-600',
            content=content,
            skills=skills,
            likes_count=0,
            comments_count=0,
            image=request.data.get('image') or None,
            category=category
        )
        return Response(
            PostSerializer(post, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )


class PostDetailView(views.APIView):
    """GET / DELETE منشور واحد"""

    def get(self, request, pk):
        try:
            post = Post.objects.get(id=pk)
        except Post.DoesNotExist:
            return Response({'detail': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(PostSerializer(post, context={'request': request}).data)

    def delete(self, request, pk):
        try:
            post = Post.objects.get(id=pk)
        except Post.DoesNotExist:
            return Response({'detail': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

        # تأكد إن اللي بيحذف هو صاحب المنشور (لو في authentication)
        if request.user.is_authenticated and post.author != request.user:
            return Response(
                {'detail': 'You can only delete your own posts'},
                status=status.HTTP_403_FORBIDDEN
            )

        post.delete()
        return Response({'success': True, 'message': 'Post deleted'}, status=status.HTTP_200_OK)


class ToggleLikePostView(views.APIView):
    def post(self, request, pk):
        try:
            post = Post.objects.get(id=pk)
        except Post.DoesNotExist:
            return Response({'detail': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user if request.user.is_authenticated else User.objects.first()
        if not user:
            return Response({'detail': 'No user available'}, status=status.HTTP_401_UNAUTHORIZED)

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
    """GET / POST تعليقات منشور"""

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
        if not user:
            return Response({'detail': 'No user available'}, status=status.HTTP_401_UNAUTHORIZED)

        content = (request.data.get('content') or '').strip()
        if not content:
            return Response(
                {'content': ['هذا الحقل مطلوب.']},
                status=status.HTTP_400_BAD_REQUEST
            )

        parent_id = request.data.get('parentId') or request.data.get('parent_id')
        parent = None
        if parent_id:
            try:
                parent = PostComment.objects.get(id=parent_id, post=post)
            except PostComment.DoesNotExist:
                parent = None

        comment = PostComment.objects.create(
            user=user,
            post=post,
            content=content,
            parent=parent
        )
        post.comments_count += 1
        post.save()

        return Response(
            PostCommentSerializer(comment).data,
            status=status.HTTP_201_CREATED
        )


class PostCommentDetailView(views.APIView):
    """DELETE تعليق"""

    def delete(self, request, pk):
        try:
            comment = PostComment.objects.get(id=pk)
        except PostComment.DoesNotExist:
            return Response({'detail': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)

        if request.user.is_authenticated and comment.user != request.user:
            return Response(
                {'detail': 'You can only delete your own comments'},
                status=status.HTTP_403_FORBIDDEN
            )

        post = comment.post
        comment.delete()
        # حدّث عدد التعليقات
        post.comments_count = max(0, post.comments_count - 1)
        post.save()

        return Response({'success': True, 'message': 'Comment deleted'}, status=status.HTTP_200_OK)
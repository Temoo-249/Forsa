from django.db import transaction
from django.contrib.auth import get_user_model
from rest_framework import status, views
from rest_framework.response import Response

from .models import Post, PostLike, PostComment
from .serializers import PostSerializer, PostCommentSerializer

User = get_user_model()


def auth_required(request):
    if not request.user or not request.user.is_authenticated:
        return Response(
            {'detail': 'Authentication credentials were not provided.'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    return None


class PostListCreateView(views.APIView):
    """GET public feed, POST requires an authenticated user."""

    def get(self, request):
        category = request.query_params.get('category')
        queryset = Post.objects.all().order_by('-created_at')

        if category and category != 'الكل':
            queryset = queryset.filter(category=category)

        serializer = PostSerializer(
            queryset,
            many=True,
            context={'request': request}
        )
        return Response(serializer.data)

    def post(self, request):
        auth_error = auth_required(request)
        if auth_error:
            return auth_error

        content = (request.data.get('content') or '').strip()
        skills = request.data.get('skills') or []
        category = request.data.get('category') or 'عام'

        if not content:
            return Response(
                {'content': ['هذا الحقل مطلوب.']},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = request.user

        post = Post.objects.create(
            id=f"post-{__import__('uuid').uuid4().hex[:6]}",
            author=user,
            author_name=user.get_full_name() or user.username,
            author_headline=getattr(user, 'headline', '') or 'مستخدم',
            author_avatar=getattr(user, 'avatar', '') or '',
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
    """GET / DELETE منشور واحد. الحذف لصاحب المنشور فقط."""

    def get(self, request, pk):
        try:
            post = Post.objects.get(id=pk)
        except Post.DoesNotExist:
            return Response(
                {'detail': 'Post not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            PostSerializer(post, context={'request': request}).data
        )

    def delete(self, request, pk):
        auth_error = auth_required(request)
        if auth_error:
            return auth_error

        try:
            post = Post.objects.get(id=pk)
        except Post.DoesNotExist:
            return Response(
                {'detail': 'Post not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        if post.author_id != request.user.id and not request.user.is_staff:
            return Response(
                {'detail': 'You can only delete your own posts.'},
                status=status.HTTP_403_FORBIDDEN
            )

        post.delete()

        return Response(
            {'success': True, 'message': 'Post deleted'},
            status=status.HTTP_200_OK
        )


class ToggleLikePostView(views.APIView):
    """POST requires an authenticated user."""

    def post(self, request, pk):
        auth_error = auth_required(request)
        if auth_error:
            return auth_error

        try:
            post = Post.objects.get(id=pk)
        except Post.DoesNotExist:
            return Response(
                {'detail': 'Post not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        user = request.user

        with transaction.atomic():
            liked = PostLike.objects.filter(user=user, post=post).first()

            if liked:
                liked.delete()
                post.likes_count = max(0, PostLike.objects.filter(post=post).count())
                post.save(update_fields=['likes_count'])
                return Response({
                    'isLiked': False,
                    'likes': post.likes_count
                })

            PostLike.objects.create(user=user, post=post)
            post.likes_count = PostLike.objects.filter(post=post).count()
            post.save(update_fields=['likes_count'])

        return Response({
            'isLiked': True,
            'likes': post.likes_count
        })


class PostCommentsView(views.APIView):
    """GET public comments, POST requires authentication."""

    def get(self, request, pk):
        try:
            post = Post.objects.get(id=pk)
        except Post.DoesNotExist:
            return Response(
                {'detail': 'Post not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        comments = post.comments.all().order_by('created_at')

        serializer = PostCommentSerializer(
            comments,
            many=True,
            context={'request': request}
        )
        return Response(serializer.data)

    def post(self, request, pk):
        auth_error = auth_required(request)
        if auth_error:
            return auth_error

        try:
            post = Post.objects.get(id=pk)
        except Post.DoesNotExist:
            return Response(
                {'detail': 'Post not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        content = (request.data.get('content') or '').strip()
        if not content:
            return Response(
                {'content': ['هذا الحقل مطلوب.']},
                status=status.HTTP_400_BAD_REQUEST
            )

        parent_id = request.data.get('parent_id') or request.data.get('parentId')
        parent = None

        if parent_id:
            try:
                parent = PostComment.objects.get(
                    id=parent_id,
                    post=post
                )
            except PostComment.DoesNotExist:
                return Response(
                    {'parent_id': ['التعليق الأساسي غير موجود لهذا المنشور.']},
                    status=status.HTTP_400_BAD_REQUEST
                )

        comment = PostComment.objects.create(
            user=request.user,
            post=post,
            content=content,
            parent=parent
        )

        # إعادة حساب العدد من قاعدة البيانات حتى يظل صحيحًا مع الردود والحذف المتسلسل.
        post.comments_count = PostComment.objects.filter(post=post).count()
        post.save(update_fields=['comments_count'])

        return Response(
            PostCommentSerializer(
                comment,
                context={'request': request}
            ).data,
            status=status.HTTP_201_CREATED
        )


class PostCommentDetailView(views.APIView):
    """DELETE يتطلب أن يكون التعليق للمستخدم الحالي أو للمسؤول."""

    def delete(self, request, pk):
        auth_error = auth_required(request)
        if auth_error:
            return auth_error

        try:
            comment = PostComment.objects.select_related('post').get(id=pk)
        except PostComment.DoesNotExist:
            return Response(
                {'detail': 'Comment not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        if comment.user_id != request.user.id and not request.user.is_staff:
            return Response(
                {'detail': 'You can only delete your own comments.'},
                status=status.HTTP_403_FORBIDDEN
            )

        post = comment.post

        with transaction.atomic():
            comment.delete()

            # يعالج حالة حذف تعليق له ردود ON DELETE CASCADE إن كانت معرفة في الـ model.
            post.comments_count = PostComment.objects.filter(post=post).count()
            post.save(update_fields=['comments_count'])

        return Response(
            {'success': True, 'message': 'Comment deleted'},
            status=status.HTTP_200_OK
        )

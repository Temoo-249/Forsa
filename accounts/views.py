from rest_framework import status, views, permissions
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .models import User, Skill, Experience, Education, CVFile, Follow
from .serializers import UserSerializer, RegisterSerializer, SkillSerializer, ExperienceSerializer, EducationSerializer, CVFileSerializer, PublicProfileSerializer
import uuid
from companies.models import Company


import uuid
from companies.models import Company

class RegisterView(views.APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # إذا كان صاحب عمل، اعمل شركة مربوطة بيه
            if user.role == 'employer':
                Company.objects.get_or_create(
                    user=user,
                    defaults={
                        'id': f"company-{uuid.uuid4().hex[:12]}",
                        'name': user.company_name or f"شركة {user.get_full_name() or user.username}",
                        'industry': 'التكنولوجيا',
                        'location': user.location or 'الرياض',
                        'description': '',
                        'tagline': '',
                        'logo': '🏢',
                        'cover_gradient': 'from-blue-600 to-indigo-600',
                    }
                )

            token, _ = Token.objects.get_or_create(user=user)
            userData = UserSerializer(user).data
            userData['token'] = token.key
            return Response(userData, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class LoginView(views.APIView):
    def post(self, request):
        email_or_username = request.data.get('email') or request.data.get('username')
        password = request.data.get('password')

        user = None
        if email_or_username:
            try:
                user_obj = User.objects.get(email=email_or_username)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                user = authenticate(username=email_or_username, password=password)

        if not user:
            return Response({'detail': 'بيانات الدخول غير صحيحة'}, status=status.HTTP_400_BAD_REQUEST)

        if user:
            token, _ = Token.objects.get_or_create(user=user)
            userData = UserSerializer(user).data
            userData['token'] = token.key
            return Response(userData)

        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

class CurrentUserView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        token, _ = Token.objects.get_or_create(user=user)
        data = UserSerializer(user).data
        data['token'] = token.key
        return Response(data)

    def patch(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserSkillsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        user = request.user
        skills = Skill.objects.filter(user=user)
        return Response(SkillSerializer(skills, many=True).data)

    def post(self, request):
        user = request.user
        serializer = SkillSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserExperienceView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        user = request.user
        items = Experience.objects.filter(user=user)
        return Response(ExperienceSerializer(items, many=True).data)

    def post(self, request):
        serializer = ExperienceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserEducationView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        user = request.user
        items = Education.objects.filter(user=user)
        return Response(EducationSerializer(items, many=True).data)

    def post(self, request):
        serializer = EducationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserResumesView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        user = request.user
        items = CVFile.objects.filter(user=user)
        return Response(CVFileSerializer(items, many=True).data)

    def post(self, request):
        user = request.user
        serializer = CVFileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserResumeDetailView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def delete(self, request, pk):
        user = request.user
        try:
            cv = CVFile.objects.get(id=pk, user=user)
            cv.delete()
            return Response({'success': True, 'message': 'Resume deleted'})
        except CVFile.DoesNotExist:
            return Response({'detail': 'Resume not found'}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, pk):
        user = request.user
        try:
            cv = CVFile.objects.get(id=pk, user=user)
            if request.data.get('isDefault') is not None:
                if request.data.get('isDefault'):
                    CVFile.objects.filter(user=user).update(is_default=False)
                cv.is_default = bool(request.data.get('isDefault'))
                cv.save()
            return Response(CVFileSerializer(cv).data)
        except CVFile.DoesNotExist:
            return Response({'detail': 'Resume not found'}, status=status.HTTP_404_NOT_FOUND)


class PublicProfileView(views.APIView):
    """Public, privacy-safe profile for job seekers only."""
    def get(self, request, pk):
        try:
            user = User.objects.get(id=pk, role='seeker', is_active=True)
        except User.DoesNotExist:
            return Response({'detail': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        data = PublicProfileSerializer(user).data
        data['isFollowing'] = bool(request.user.is_authenticated and Follow.objects.filter(follower=request.user, following=user).exists())
        return Response(data)


class ToggleFollowView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            target = User.objects.get(id=pk, role='seeker', is_active=True)
        except User.DoesNotExist:
            return Response({'detail': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        if target.id == request.user.id:
            return Response({'detail': 'You cannot follow yourself'}, status=status.HTTP_400_BAD_REQUEST)
        relation = Follow.objects.filter(follower=request.user, following=target).first()
        if relation:
            relation.delete()
            return Response({'isFollowing': False, 'followersCount': Follow.objects.filter(following=target).count()})
        Follow.objects.create(follower=request.user, following=target)
        return Response({'isFollowing': True, 'followersCount': Follow.objects.filter(following=target).count()})



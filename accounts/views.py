from rest_framework import status, views
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .models import User, Skill, Experience, Education, CVFile
from .serializers import UserSerializer, RegisterSerializer, SkillSerializer, ExperienceSerializer, EducationSerializer, CVFileSerializer

class RegisterView(views.APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
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
    def get(self, request):
        user = request.user if request.user.is_authenticated else User.objects.first()
        if not user:
            return Response({'detail': 'No user found'}, status=status.HTTP_404_NOT_FOUND)
        token, _ = Token.objects.get_or_create(user=user)
        data = UserSerializer(user).data
        data['token'] = token.key
        return Response(data)

    def patch(self, request):
        user = request.user if request.user.is_authenticated else User.objects.first()
        if not user:
            return Response({'detail': 'No user found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserSkillsView(views.APIView):
    def get(self, request):
        user = request.user if request.user.is_authenticated else User.objects.first()
        skills = Skill.objects.filter(user=user)
        return Response(SkillSerializer(skills, many=True).data)

    def post(self, request):
        user = request.user if request.user.is_authenticated else User.objects.first()
        serializer = SkillSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserExperienceView(views.APIView):
    def get(self, request):
        user = request.user if request.user.is_authenticated else User.objects.first()
        items = Experience.objects.filter(user=user)
        return Response(ExperienceSerializer(items, many=True).data)

class UserEducationView(views.APIView):
    def get(self, request):
        user = request.user if request.user.is_authenticated else User.objects.first()
        items = Education.objects.filter(user=user)
        return Response(EducationSerializer(items, many=True).data)

class UserResumesView(views.APIView):
    def get(self, request):
        user = request.user if request.user.is_authenticated else User.objects.first()
        items = CVFile.objects.filter(user=user)
        return Response(CVFileSerializer(items, many=True).data)

    def post(self, request):
        user = request.user if request.user.is_authenticated else User.objects.first()
        serializer = CVFileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

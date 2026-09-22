from rest_framework import serializers
from .models import User, Skill, Experience, Education, CVFile

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'level', 'percentage']

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ['id', 'role', 'company', 'location', 'period', 'description']

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ['id', 'degree', 'institution', 'period', 'description']

class CVFileSerializer(serializers.ModelSerializer):
    uploadDate = serializers.CharField(source='upload_date', required=False)
    isDefault = serializers.BooleanField(source='is_default', required=False)

    class Meta:
        model = CVFile
        fields = ['id', 'name', 'uploadDate', 'size', 'isDefault', 'file']

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    companyName = serializers.CharField(source='company_name', required=False, allow_blank=True, allow_null=True)
    isLoggedIn = serializers.SerializerMethodField()
    skills = SkillSerializer(many=True, read_only=True)
    experiences = ExperienceSerializer(many=True, read_only=True)
    educations = EducationSerializer(many=True, read_only=True)
    resumes = CVFileSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'name', 'email', 'role', 'headline', 'avatar',
            'companyName', 'phone', 'location', 'bio', 'isLoggedIn',
            'skills', 'experiences', 'educations', 'resumes'
        ]

    def get_name(self, obj):
        return obj.get_full_name() or obj.username

    def get_isLoggedIn(self, obj):
        return True

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField()
    companyName = serializers.CharField(source='company_name', required=False, allow_blank=True)
    firstName = serializers.CharField(source='first_name', required=False, allow_blank=True)
    lastName = serializers.CharField(source='last_name', required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role', 'headline', 'avatar', 'companyName', 'firstName', 'lastName']
        

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

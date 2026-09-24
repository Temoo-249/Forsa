from rest_framework import serializers
from .models import Company


class CompanySerializer(serializers.ModelSerializer):
    ownerId = serializers.UUIDField(source='user_id', read_only=True, allow_null=True)
    coverGradient = serializers.CharField(source='cover_gradient', required=False, allow_blank=True, allow_null=True)
    employeesCount = serializers.CharField(source='employees_count', required=False, allow_blank=True, allow_null=True)
    foundedYear = serializers.CharField(source='founded_year', required=False, allow_blank=True, allow_null=True)
    reviewsCount = serializers.IntegerField(source='reviews_count', required=False, allow_null=True)
    isVerified = serializers.BooleanField(source='is_verified', required=False)
    openJobsCount = serializers.IntegerField(source='open_jobs_count', required=False, allow_null=True)
    logo = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    location = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    industry = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    name = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    tagline = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    website = serializers.URLField(required=False, allow_blank=True, allow_null=True)
    description = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = Company
        fields = [
            'id', 'name', 'tagline', 'logo', 'coverGradient', 'industry',
            'location', 'employeesCount', 'foundedYear', 'website',
            'description', 'benefits', 'rating', 'reviewsCount', 'ownerId',
            'isVerified', 'openJobsCount'
        ]
        read_only_fields = ['id']   # ← الأهم: خلي الـ id للقراءة فقط

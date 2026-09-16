from rest_framework import serializers
from .models import Company

class CompanySerializer(serializers.ModelSerializer):
    coverGradient = serializers.CharField(source='cover_gradient', required=False)
    employeesCount = serializers.CharField(source='employees_count', required=False)
    foundedYear = serializers.CharField(source='founded_year', required=False)
    reviewsCount = serializers.IntegerField(source='reviews_count', required=False)
    isVerified = serializers.BooleanField(source='is_verified', required=False)
    openJobsCount = serializers.IntegerField(source='open_jobs_count', required=False)

    class Meta:
        model = Company
        fields = [
            'id', 'name', 'tagline', 'logo', 'coverGradient', 'industry',
            'location', 'employeesCount', 'foundedYear', 'website',
            'description', 'benefits', 'rating', 'reviewsCount',
            'isVerified', 'openJobsCount'
        ]

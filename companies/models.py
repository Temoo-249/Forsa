from django.db import models
from django.conf import settings

class Company(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='owned_companies')
    name = models.CharField(max_length=255)
    tagline = models.CharField(max_length=255, blank=True)
    logo = models.CharField(max_length=255, default='🏢')
    cover_gradient = models.CharField(max_length=255, default='from-blue-600 to-indigo-700')
    industry = models.CharField(max_length=150)
    location = models.CharField(max_length=255)
    employees_count = models.CharField(max_length=100, default='50-200 موظف')
    founded_year = models.CharField(max_length=50, default='2020')
    website = models.URLField(blank=True, max_length=500)
    description = models.TextField(blank=True)
    benefits = models.JSONField(default=list, blank=True)
    rating = models.FloatField(default=4.8)
    reviews_count = models.IntegerField(default=10)
    is_verified = models.BooleanField(default=True)
    open_jobs_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class CompanyMember(models.Model):
    ROLE_CHOICES = [('owner', 'Owner'), ('admin', 'Admin'), ('recruiter', 'Recruiter'), ('hr', 'HR')]
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='members')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='company_memberships')
    member_role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='recruiter')
    joined_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=['company', 'user'], name='unique_company_member')]

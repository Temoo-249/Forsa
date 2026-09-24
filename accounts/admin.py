from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Skill, Experience, Education, CVFile, JobSeekerProfile, JobSeekerPreference, CVAnalysis

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('معلومات إضافية', {'fields': ('role', 'headline', 'avatar', 'company_name', 'phone', 'location', 'bio')}),
    )

admin.site.register(Skill)
admin.site.register(Experience)
admin.site.register(Education)
admin.site.register(CVFile)
admin.site.register(JobSeekerProfile)
admin.site.register(JobSeekerPreference)
admin.site.register(CVAnalysis)

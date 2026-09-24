from django.contrib import admin
from .models import Job, Application, SavedJob, JobCategory, JobSkill, ApplicationStatusLog, Interview, JobMatch, Recommendation

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'type', 'domain', 'salary', 'applicants_count', 'is_verified')
    search_fields = ('title', 'company', 'skills')

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('id', 'job_title', 'company', 'candidate_name', 'status', 'apply_date')
    list_filter = ('status',)

admin.site.register(SavedJob)
admin.site.register(JobCategory)
admin.site.register(JobSkill)
admin.site.register(ApplicationStatusLog)
admin.site.register(Interview)
admin.site.register(JobMatch)
admin.site.register(Recommendation)

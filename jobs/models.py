from django.db import models
from django.conf import settings
from companies.models import Company

class Job(models.Model):
    JOB_TYPES = (
        ('دوام كامل', 'دوام كامل'),
        ('دوام جزئي', 'دوام جزئي'),
        ('عن بُعد', 'عن بُعد'),
        ('عمل حر', 'عمل حر'),
        ('تدريب', 'تدريب'),
    )
    id = models.CharField(max_length=100, primary_key=True)
    title = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    company_ref = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True, blank=True, related_name='jobs')
    location = models.CharField(max_length=255)
    logo = models.CharField(max_length=255, default='💼')
    type = models.CharField(max_length=50, choices=JOB_TYPES, default='دوام كامل')
    domain = models.CharField(max_length=100, default='تطوير البرمجيات')
    salary = models.CharField(max_length=100)
    posted_time = models.CharField(max_length=100, default='الآن')
    applicants_count = models.IntegerField(default=0)
    skills = models.JSONField(default=list, blank=True)
    description = models.TextField()
    requirements = models.JSONField(default=list, blank=True)
    is_verified = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.company}"

class SavedJob(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='saved_jobs')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='saved_by_users')
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'job')

    def __str__(self):
        return f"{self.user.username} saved {self.job.title}"

class Application(models.Model):
    STATUS_CHOICES = (
        ('التقدم', 'التقدم'),
        ('المراجعة', 'المراجعة'),
        ('الاختصار', 'الاختصار'),
        ('المقابلة', 'المقابلة'),
        ('العرض', 'العرض'),
        ('التوظيف', 'التوظيف'),
        ('مرفوض', 'مرفوض'),
    )
    id = models.CharField(max_length=100, primary_key=True)
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='applications')
    
    # Redundant fields for instant frontend compatibility
    job_title = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    logo = models.CharField(max_length=255, default='💼')
    apply_date = models.CharField(max_length=100, default='اليوم')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='التقدم')
    current_step_index = models.IntegerField(default=0)
    
    interview_date = models.CharField(max_length=150, blank=True, null=True)
    interview_note = models.TextField(blank=True, null=True)
    resume_file_name = models.CharField(max_length=255, default='السيرة الذاتية.pdf')
    cover_note = models.TextField(blank=True, null=True)
    
    # Candidate info snapshot (matches JobApplicant view in employer hub)
    candidate_name = models.CharField(max_length=255, blank=True)
    candidate_headline = models.TextField(blank=True)
    candidate_avatar = models.CharField(max_length=255, default='أر')
    candidate_email = models.EmailField(blank=True)
    candidate_phone = models.CharField(max_length=50, blank=True)
    experience_years = models.IntegerField(default=3)
    education = models.CharField(max_length=255, blank=True)
    match_score = models.IntegerField(default=85)
    candidate_skills = models.JSONField(default=list, blank=True)

    timeline = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Application {self.id} for {self.job_title}"

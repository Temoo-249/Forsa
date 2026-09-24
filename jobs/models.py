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
    updated_at = models.DateTimeField(auto_now=True)
    category = models.ForeignKey('JobCategory', on_delete=models.SET_NULL, null=True, blank=True, related_name='jobs')
    created_by_member = models.ForeignKey('companies.CompanyMember', on_delete=models.SET_NULL, null=True, blank=True, related_name='created_jobs')
    employment_type = models.CharField(max_length=20, blank=True)
    work_mode = models.CharField(max_length=20, blank=True)
    salary_type = models.CharField(max_length=20, default='negotiable')
    salary_min = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    salary_max = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=10, default='SAR')
    status = models.CharField(max_length=20, default='active')
    deadline = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.title} - {self.company}"


class JobCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    icon = models.CharField(max_length=100, blank=True)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='children')

    def __str__(self):
        return self.name


class JobSkill(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='skill_requirements')
    name = models.CharField(max_length=100)
    is_required = models.BooleanField(default=True)
    weight = models.DecimalField(max_digits=5, decimal_places=2, default=1)

    class Meta:
        constraints = [models.UniqueConstraint(fields=['job', 'name'], name='unique_job_skill_name')]

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


class ApplicationStatusLog(models.Model):
    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name='status_logs')
    old_status = models.CharField(max_length=50, blank=True)
    new_status = models.CharField(max_length=50)
    note = models.TextField(blank=True)
    changed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='application_status_changes')
    changed_at = models.DateTimeField(auto_now_add=True)


class Interview(models.Model):
    TYPE_CHOICES = [('online', 'Online'), ('onsite', 'Onsite'), ('phone', 'Phone')]
    STATUS_CHOICES = [('scheduled', 'Scheduled'), ('completed', 'Completed'), ('cancelled', 'Cancelled'), ('no_show', 'No show')]
    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name='interviews')
    scheduled_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='scheduled_interviews')
    interview_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    scheduled_at = models.DateTimeField()
    duration_minutes = models.PositiveIntegerField(default=30)
    meeting_url = models.URLField(blank=True)
    location = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class JobMatch(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='matches')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='job_matches')
    match_score = models.DecimalField(max_digits=5, decimal_places=2)
    skill_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    experience_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    education_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    location_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    preference_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    ai_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    explanation = models.TextField(blank=True)
    model_version = models.CharField(max_length=100, blank=True)
    calculated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=['job', 'user'], name='unique_job_match')]


class Recommendation(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='recommendations')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='recommendations')
    score = models.DecimalField(max_digits=5, decimal_places=2)
    reason = models.TextField(blank=True)
    model_version = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=['user', 'job'], name='unique_recommendation')]

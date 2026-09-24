from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid

class User(AbstractUser):
    ROLE_CHOICES = (
        ('seeker', 'باحث عن عمل'),
        ('employer', 'صاحب عمل'),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='seeker')
    headline = models.TextField(blank=True, null=True)
    avatar = models.CharField(max_length=255, default='أر')
    company_name = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.get_full_name() or self.username

class Skill(models.Model):
    LEVEL_CHOICES = (
        ('مبتدئ', 'مبتدئ'),
        ('متوسط', 'متوسط'),
        ('متقدم', 'متقدم'),
        ('خبير', 'خبير'),
    )
    user = models.ForeignKey(User, related_name='skills', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='متقدم')
    percentage = models.IntegerField(default=80)

    def __str__(self):
        return f"{self.user.username} - {self.name}"

class Experience(models.Model):
    user = models.ForeignKey(User, related_name='experiences', on_delete=models.CASCADE)
    role = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    period = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.role} at {self.company}"

class Education(models.Model):
    user = models.ForeignKey(User, related_name='educations', on_delete=models.CASCADE)
    degree = models.CharField(max_length=255)
    institution = models.CharField(max_length=255)
    period = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.degree} - {self.institution}"

class CVFile(models.Model):
    user = models.ForeignKey(User, related_name='resumes', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='resumes/', blank=True, null=True)
    upload_date = models.CharField(max_length=100, default='اليوم')
    size = models.CharField(max_length=50, default='1.2 MB')
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.user.username})"


class JobSeekerProfile(models.Model):
    """Extended seeker data kept separate from the authentication account."""
    AVAILABILITY_CHOICES = [('open', 'Open'), ('not_looking', 'Not looking'), ('open_to_offers', 'Open to offers')]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='job_seeker_profile')
    linkedin_url = models.URLField(blank=True)
    portfolio_url = models.URLField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    availability = models.CharField(max_length=20, choices=AVAILABILITY_CHOICES, default='open')


class JobSeekerPreference(models.Model):
    JOB_TYPES = [('full_time', 'Full time'), ('part_time', 'Part time'), ('freelance', 'Freelance'), ('internship', 'Internship')]
    WORK_MODES = [('onsite', 'Onsite'), ('hybrid', 'Hybrid'), ('remote', 'Remote')]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='job_preferences')
    preferred_location = models.CharField(max_length=255, blank=True)
    preferred_job_type = models.CharField(max_length=20, choices=JOB_TYPES, blank=True)
    preferred_work_mode = models.CharField(max_length=20, choices=WORK_MODES, blank=True)
    min_salary = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    max_salary = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    preferred_currency = models.CharField(max_length=10, default='SAR')
    updated_at = models.DateTimeField(auto_now=True)


class CVAnalysis(models.Model):
    STATUS_CHOICES = [('pending', 'Pending'), ('processing', 'Processing'), ('completed', 'Completed'), ('failed', 'Failed')]
    cv = models.ForeignKey(CVFile, on_delete=models.CASCADE, related_name='analyses')
    parsed_text = models.TextField(blank=True)
    extracted_data = models.JSONField(default=dict, blank=True)
    profile_completeness = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    model_version = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')


class Follow(models.Model):
    """A directed professional follow relationship."""
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name='following_relations')
    following = models.ForeignKey(User, on_delete=models.CASCADE, related_name='follower_relations')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['follower', 'following'], name='unique_user_follow'),
            models.CheckConstraint(condition=~models.Q(follower=models.F('following')), name='prevent_self_follow'),
        ]

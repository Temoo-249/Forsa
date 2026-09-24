from rest_framework import serializers
from .models import Job, Application, SavedJob

class JobSerializer(serializers.ModelSerializer):
    companyId = serializers.CharField(source='company_ref_id', read_only=True, allow_null=True)
    ownerId = serializers.SerializerMethodField()
    postedTime = serializers.CharField(source='posted_time', required=False)
    applicantsCount = serializers.IntegerField(source='applicants_count', required=False)
    isVerified = serializers.BooleanField(source='is_verified', required=False)
    isSaved = serializers.SerializerMethodField()
    applied = serializers.SerializerMethodField()
    employmentType = serializers.CharField(source='employment_type', required=False, allow_blank=True)
    workMode = serializers.CharField(source='work_mode', required=False, allow_blank=True)
    salaryType = serializers.CharField(source='salary_type', required=False)
    salaryMin = serializers.DecimalField(source='salary_min', max_digits=12, decimal_places=2, required=False, allow_null=True)
    salaryMax = serializers.DecimalField(source='salary_max', max_digits=12, decimal_places=2, required=False, allow_null=True)

    class Meta:
        model = Job
        fields = [
            'id', 'title', 'company', 'companyId', 'ownerId', 'location', 'logo', 'type',
            'domain', 'salary', 'postedTime', 'applicantsCount',
            'skills', 'description', 'requirements', 'isVerified',
            'isSaved', 'applied', 'employmentType', 'workMode', 'salaryType',
            'salaryMin', 'salaryMax', 'currency', 'status', 'deadline'
        ]
        read_only_fields = ['id', 'company', 'isSaved', 'applied']

    def get_ownerId(self, obj):
        return str(obj.company_ref.user_id) if obj.company_ref_id and obj.company_ref and obj.company_ref.user_id else None

    def get_isSaved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return SavedJob.objects.filter(user=request.user, job=obj).exists()
        return False

    def get_applied(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Application.objects.filter(user=request.user, job=obj).exists()
        return False

class ApplicationSerializer(serializers.ModelSerializer):
    jobId = serializers.CharField(source='job_id', required=False)
    jobTitle = serializers.CharField(source='job_title', required=False)
    applyDate = serializers.CharField(source='apply_date', required=False)
    currentStepIndex = serializers.IntegerField(source='current_step_index', required=False)
    interviewDate = serializers.CharField(source='interview_date', required=False, allow_null=True)
    interviewNote = serializers.CharField(source='interview_note', required=False, allow_null=True)
    resumeFileName = serializers.CharField(source='resume_file_name', required=False)

    class Meta:
        model = Application
        fields = [
            'id', 'jobId', 'jobTitle', 'company', 'logo', 'applyDate',
            'status', 'currentStepIndex', 'interviewDate', 'interviewNote',
            'resumeFileName', 'timeline'
        ]

class JobApplicantSerializer(serializers.ModelSerializer):
    candidateId = serializers.UUIDField(source='user_id', read_only=True)
    jobId = serializers.CharField(source='job_id', required=False)
    jobTitle = serializers.CharField(source='job_title', required=False)
    candidateName = serializers.CharField(source='candidate_name', required=False)
    candidateHeadline = serializers.CharField(source='candidate_headline', required=False)
    candidateAvatar = serializers.CharField(source='candidate_avatar', required=False)
    candidateEmail = serializers.CharField(source='candidate_email', required=False)
    candidatePhone = serializers.CharField(source='candidate_phone', required=False)
    experienceYears = serializers.IntegerField(source='experience_years', required=False)
    education = serializers.CharField(required=False)
    appliedDate = serializers.CharField(source='apply_date', required=False)
    status = serializers.CharField(required=False)
    matchScore = serializers.IntegerField(source='match_score', required=False)
    resumeFileName = serializers.CharField(source='resume_file_name', required=False)
    coverNote = serializers.CharField(source='cover_note', required=False, allow_null=True)
    skills = serializers.JSONField(source='candidate_skills', required=False)
    interviewDate = serializers.CharField(source='interview_date', required=False, allow_null=True)

    class Meta:
        model = Application
        fields = [
            'id', 'jobId', 'jobTitle', 'candidateId', 'candidateName', 'candidateHeadline',
            'candidateAvatar', 'candidateEmail', 'candidatePhone',
            'experienceYears', 'education', 'appliedDate', 'status',
            'matchScore', 'resumeFileName', 'coverNote', 'skills',
            'interviewDate'
        ]

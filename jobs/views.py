from rest_framework import status, views
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Q
from .models import Job, Application, SavedJob, ApplicationStatusLog
from .serializers import JobSerializer, ApplicationSerializer, JobApplicantSerializer
from accounts.models import User
import uuid
from companies.models import Company, CompanyMember
class JobListCreateView(views.APIView):
    def get(self, request):
        queryset = Job.objects.all().order_by('-created_at')
        
        # Filtering & Search
        search = request.query_params.get('search')
        job_type = request.query_params.get('type')
        domain = request.query_params.get('domain')
        location = request.query_params.get('location')

        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(company__icontains=search) |
                Q(description__icontains=search)
            )
        if job_type and job_type != 'الكل':
            queryset = queryset.filter(type=job_type)
        if domain and domain != 'الكل':
            queryset = queryset.filter(domain=domain)
        if location:
            queryset = queryset.filter(location__icontains=location)

        serializer = JobSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        if request.user.role != 'employer':
            return Response({'detail': 'Only employers can create jobs'}, status=status.HTTP_403_FORBIDDEN)
        data = request.data.copy()
        # IDs are owned by the server so a client cannot overwrite or guess
        # another employer's listing.
        job_id = f"job-{uuid.uuid4().hex[:12]}"
        company = Company.objects.filter(user=request.user).first()
        if not company:
            return Response({'detail': 'Create your company profile before posting a job'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = JobSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            # The company is determined from the authenticated employer, never
            # from client input.  `company` is read-only in the serializer, so
            # it must be supplied explicitly here before saving the model.
            # `id` is read-only to clients, so pass the server-generated value
            # directly to save().  Putting it in request data is ignored by DRF
            # and previously created the first job with an empty primary key.
            job = serializer.save(id=job_id, company_ref=company, company=company.name)
            company.open_jobs_count = Job.objects.filter(company_ref=company).count()
            company.save(update_fields=['open_jobs_count'])
            return Response(JobSerializer(job, context={'request': request}).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class JobDetailView(views.APIView):
    def get(self, request, pk):
        try:
            job = Job.objects.get(id=pk)
            return Response(JobSerializer(job, context={'request': request}).data)
        except Job.DoesNotExist:
            return Response({'detail': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            job = Job.objects.select_related('company_ref').get(id=pk)
        except Job.DoesNotExist:
            return Response({'detail': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)

        is_company_manager = CompanyMember.objects.filter(
            company_id=job.company_ref_id, user=request.user, is_active=True,
            member_role__in=['owner', 'admin', 'recruiter', 'hr']
        ).exists()
        owns_company = Company.objects.filter(id=job.company_ref_id, user=request.user).exists()
        if request.user.role != 'employer' or not (owns_company or is_company_manager):
            return Response({'detail': 'You do not own this job'}, status=status.HTTP_403_FORBIDDEN)

        company = job.company_ref
        job.delete()
        if company:
            company.open_jobs_count = Job.objects.filter(company_ref=company).count()
            company.save(update_fields=['open_jobs_count'])
        return Response(status=status.HTTP_204_NO_CONTENT)

    def patch(self, request, pk):
        """Allow an authorised company team member to change a job lifecycle state."""
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            job = Job.objects.get(id=pk)
        except Job.DoesNotExist:
            return Response({'detail': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)

        is_company_manager = CompanyMember.objects.filter(
            company_id=job.company_ref_id, user=request.user, is_active=True,
            member_role__in=['owner', 'admin', 'recruiter', 'hr']
        ).exists()
        owns_company = Company.objects.filter(id=job.company_ref_id, user=request.user).exists()
        if request.user.role != 'employer' or not (owns_company or is_company_manager):
            return Response({'detail': 'You do not manage this job'}, status=status.HTTP_403_FORBIDDEN)

        new_status = request.data.get('status')
        if new_status not in {'active', 'paused', 'closed', 'draft'}:
            return Response({'detail': 'Invalid job status'}, status=status.HTTP_400_BAD_REQUEST)
        job.status = new_status
        job.save(update_fields=['status', 'updated_at'])
        return Response(JobSerializer(job, context={'request': request}).data)

class ToggleSaveJobView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, pk):
        try:
            job = Job.objects.get(id=pk)
        except Job.DoesNotExist:
            return Response({'detail': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        saved = SavedJob.objects.filter(user=user, job=job).first()
        if saved:
            saved.delete()
            return Response({'isSaved': False, 'message': 'Job unsaved'})
        else:
            SavedJob.objects.create(user=user, job=job)
            return Response({'isSaved': True, 'message': 'Job saved'})

class ApplyJobView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, pk):
        try:
            job = Job.objects.get(id=pk)
        except Job.DoesNotExist:
            return Response({'detail': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user

        existing = Application.objects.filter(user=user, job=job).first()
        if existing:
            return Response({'detail': 'Already applied for this job'}, status=status.HTTP_400_BAD_REQUEST)

        resume = request.data.get('resumeFileName', 'السيرة_الذاتية.pdf')
        cover_note = request.data.get('coverNote', '')

        default_timeline = [
            {'title': 'تم استلام طلبك بنجاح', 'date': 'اليوم', 'completed': True, 'active': False},
            {'title': 'المراجعة والتدقيق المبدئي', 'date': 'قيد الانتظار', 'completed': False, 'active': True},
            {'title': 'القائمة المختصرة', 'date': '-', 'completed': False, 'active': False},
            {'title': 'المقابلة الفنية / الشخصية', 'date': '-', 'completed': False, 'active': False},
            {'title': 'عرض العمل الرسمي', 'date': '-', 'completed': False, 'active': False},
            {'title': 'التوظيف النهائي', 'date': '-', 'completed': False, 'active': False},
        ]

        app = Application.objects.create(
            id=f"app-{uuid.uuid4().hex[:6]}",
            job=job,
            user=user,
            job_title=job.title,
            company=job.company,
            logo=job.logo,
            apply_date='اليوم',
            status='التقدم',
            current_step_index=0,
            resume_file_name=resume,
            cover_note=cover_note,
            candidate_name=user.get_full_name() or user.username,
            candidate_headline=user.headline or 'مطور برمجيات',
            candidate_avatar=user.avatar,
            candidate_email=user.email,
            candidate_phone=user.phone or '',
            match_score=90,
            candidate_skills=job.skills,
            timeline=default_timeline
        )

        job.applicants_count += 1
        job.save()

        return Response(ApplicationSerializer(app).data, status=status.HTTP_201_CREATED)

class ApplicationListView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        user = request.user
        apps = Application.objects.filter(user=user).order_by('-created_at')
        return Response(ApplicationSerializer(apps, many=True).data)


class EmployerApplicantsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        # جيب المستخدم الحالي
        user = request.user
        if user.role != 'employer':
            return Response({'detail': 'Only employers can view applicants'}, status=status.HTTP_403_FORBIDDEN)

        # جيب شركة المستخدم
        company = Company.objects.filter(user=user).first()
        if not company:
            return Response([])

        # جيب وظائف الشركة
        jobs = Job.objects.filter(company_ref=company)
        
        # جيب التقديمات على وظائف الشركة بس
        apps = Application.objects.filter(job__in=jobs).order_by('-created_at')
        return Response(JobApplicantSerializer(apps, many=True).data)

    def patch(self, request, pk):
   
        try:
            app = Application.objects.get(id=pk)
        except Application.DoesNotExist:
            return Response({'detail': 'Applicant not found'}, status=status.HTTP_404_NOT_FOUND)

        if request.user.role != 'employer' or app.job.company_ref_id not in Company.objects.filter(user=request.user).values_list('id', flat=True):
            return Response({'detail': 'You do not own this job'}, status=status.HTTP_403_FORBIDDEN)

        status_val = request.data.get('status')
        interview_date = request.data.get('interviewDate')

        if status_val:
            old_status = app.status
            app.status = status_val
            steps = ['التقدم', 'المراجعة', 'الاختصار', 'المقابلة', 'العرض', 'التوظيف']
            if status_val in steps:
                idx = steps.index(status_val)
                app.current_step_index = idx
                # Update timeline
                timeline = app.timeline or []
                for i, step in enumerate(timeline):
                    if i <= idx:
                        step['completed'] = True
                        step['active'] = (i == idx)
                    else:
                        step['completed'] = False
                        step['active'] = False
                app.timeline = timeline
        if interview_date:
            app.interview_date = interview_date

        app.save()
        if status_val and status_val != old_status:
            ApplicationStatusLog.objects.create(
                application=app, old_status=old_status, new_status=status_val,
                changed_by=request.user, note=request.data.get('note', '')
            )
        return Response(JobApplicantSerializer(app).data)

from rest_framework import status, views
from rest_framework.response import Response
from django.db.models import Q
from .models import Job, Application, SavedJob
from .serializers import JobSerializer, ApplicationSerializer, JobApplicantSerializer
from accounts.models import User
import uuid
from companies.models import Company
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
        data = request.data.copy()
        if 'id' not in data or not data['id']:
            data['id'] = f"job-{uuid.uuid4().hex[:6]}"
        serializer = JobSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class JobDetailView(views.APIView):
    def get(self, request, pk):
        try:
            job = Job.objects.get(id=pk)
            return Response(JobSerializer(job, context={'request': request}).data)
        except Job.DoesNotExist:
            return Response({'detail': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)

class ToggleSaveJobView(views.APIView):
    def post(self, request, pk):
        try:
            job = Job.objects.get(id=pk)
        except Job.DoesNotExist:
            return Response({'detail': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user if request.user.is_authenticated else User.objects.first()
        saved = SavedJob.objects.filter(user=user, job=job).first()
        if saved:
            saved.delete()
            return Response({'isSaved': False, 'message': 'Job unsaved'})
        else:
            SavedJob.objects.create(user=user, job=job)
            return Response({'isSaved': True, 'message': 'Job saved'})

class ApplyJobView(views.APIView):
    def post(self, request, pk):
        try:
            job = Job.objects.get(id=pk)
        except Job.DoesNotExist:
            return Response({'detail': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user if request.user.is_authenticated else User.objects.first()

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
    def get(self, request):
        user = request.user if request.user.is_authenticated else User.objects.first()
        apps = Application.objects.filter(user=user).order_by('-created_at')
        return Response(ApplicationSerializer(apps, many=True).data)


class EmployerApplicantsView(views.APIView):
    def get(self, request):
        # جيب المستخدم الحالي
        user = request.user if request.user.is_authenticated else User.objects.first()
        if not user:
            return Response({'detail': 'No user'}, status=status.HTTP_401_UNAUTHORIZED)

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

        status_val = request.data.get('status')
        interview_date = request.data.get('interviewDate')

        if status_val:
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
        return Response(JobApplicantSerializer(app).data)

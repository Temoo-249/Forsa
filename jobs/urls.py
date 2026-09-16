from django.urls import path
from .views import (
    JobListCreateView, JobDetailView, ToggleSaveJobView,
    ApplyJobView, ApplicationListView, EmployerApplicantsView
)

urlpatterns = [
    path('', JobListCreateView.as_view(), name='job_list_create'),
    path('<str:pk>/', JobDetailView.as_view(), name='job_detail'),
    path('<str:pk>/save/', ToggleSaveJobView.as_view(), name='toggle_save_job'),
    path('<str:pk>/apply/', ApplyJobView.as_view(), name='apply_job'),
    path('applications/my/', ApplicationListView.as_view(), name='my_applications'),
    path('employer/applicants/', EmployerApplicantsView.as_view(), name='employer_applicants'),
    path('employer/applicants/<str:pk>/', EmployerApplicantsView.as_view(), name='employer_applicant_detail'),
]

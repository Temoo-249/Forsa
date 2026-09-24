from django.urls import path
from .views import (
    RegisterView, LoginView, CurrentUserView,
    UserSkillsView, UserExperienceView, UserEducationView, UserResumesView,
    UserResumeDetailView, PublicProfileView, ToggleFollowView, JobSeekerPreferenceView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('user/', CurrentUserView.as_view(), name='current_user'),
    path('skills/', UserSkillsView.as_view(), name='user_skills'),
    path('experience/', UserExperienceView.as_view(), name='user_experience'),
    path('education/', UserEducationView.as_view(), name='user_education'),
    path('resumes/', UserResumesView.as_view(), name='user_resumes'),
    path('resumes/<int:pk>/', UserResumeDetailView.as_view(), name='user_resume_detail'),
    path('preferences/', JobSeekerPreferenceView.as_view(), name='job_seeker_preferences'),
    path('profiles/<uuid:pk>/', PublicProfileView.as_view(), name='public_profile'),
    path('profiles/<uuid:pk>/follow/', ToggleFollowView.as_view(), name='toggle_follow'),
]

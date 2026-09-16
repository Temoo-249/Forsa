from django.urls import path
from .views import CompanyListCreateView, CompanyDetailView

urlpatterns = [
    path('', CompanyListCreateView.as_view(), name='company_list_create'),
    path('<str:id>/', CompanyDetailView.as_view(), name='company_detail'),
]

from django.contrib import admin
from .models import Company, CompanyMember

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'industry', 'location', 'rating', 'open_jobs_count', 'is_verified')
    search_fields = ('name', 'industry', 'location')

admin.site.register(CompanyMember)

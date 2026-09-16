from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from django.http import JsonResponse

def api_root_view(request):
    return JsonResponse({
        'status': 'success',
        'message': 'خادم منصة فرصة (Forsa API) يعمل بنجاح! 🚀',
        'version': '1.0.0',
        'frontend_url': 'http://localhost:3000',
        'endpoints': {
            'jobs': '/api/jobs/',
            'auth': '/api/auth/',
            'companies': '/api/companies/',
            'posts': '/api/posts/',
            'conversations': '/api/conversations/',
            'notifications': '/api/notifications/',
            'admin': '/admin/'
        }
    }, json_dumps_params={'ensure_ascii': False, 'indent': 2})

urlpatterns = [
    path('', api_root_view, name='api_root'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/companies/', include('companies.urls')),
    path('api/jobs/', include('jobs.urls')),
    path('api/posts/', include('posts.urls')),
    path('api/conversations/', include('chat.urls')),
    path('api/notifications/', include('notifications.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

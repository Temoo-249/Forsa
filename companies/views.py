from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Company
from .serializers import CompanySerializer
from accounts.models import User


class CompanyListCreateView(generics.ListCreateAPIView):
    serializer_class = CompanySerializer

    def get_queryset(self):
        user = self.request.user if self.request.user.is_authenticated else None
        # لو صاحب عمل، رجّع شركته بس
        if user and user.role == 'employer':
            return Company.objects.filter(user=user).order_by('-created_at')
        # غير كده، رجّع كل الشركات
        return Company.objects.all().order_by('-created_at')
class CompanyDetailView( APIView):
    def get(self, request, pk):
        try:
            company = Company.objects.get(id=pk)
        except Company.DoesNotExist:
            return Response({'detail': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(CompanySerializer(company).data)

    def patch(self, request, pk):
        try:
            company = Company.objects.get(id=pk)
        except Company.DoesNotExist:
            return Response({'detail': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CompanySerializer(company, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
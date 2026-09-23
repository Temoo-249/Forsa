from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Company
from .serializers import CompanySerializer
from accounts.models import User
from jobs.models import Job


class CompanyListCreateView(generics.ListCreateAPIView):
    serializer_class = CompanySerializer

    def get_queryset(self):
        user = self.request.user if self.request.user.is_authenticated else None
        if user and user.role == 'employer':
            return Company.objects.filter(user=user).order_by('-created_at')
        return Company.objects.all().order_by('-created_at')

    def perform_create(self, serializer):
        import uuid
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(
            user=user,
            id=f"company-{uuid.uuid4().hex[:12]}"
        )


class CompanyDetailView(APIView):
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

        old_name = company.name
        serializer = CompanySerializer(company, data=request.data, partial=True)
        if serializer.is_valid():
            updated_company = serializer.save()

            new_name = updated_company.name
            if old_name and new_name and old_name != new_name:
                Job.objects.filter(company=old_name).update(company=new_name)

            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Company
from .serializers import CompanySerializer
from accounts.models import User

class CompanyListCreateView(generics.ListCreateAPIView):
    queryset = Company.objects.all().order_by('-created_at')
    serializer_class = CompanySerializer

class CompanyDetailView(views.APIView):
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
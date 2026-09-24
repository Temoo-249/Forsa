from django.test import TestCase

# Create your tests here.
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

from .models import Experience, User


class ProfileApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='seeker', email='seeker@example.com', password='safe-password'
        )
        self.client.force_authenticate(self.user)

    def test_authenticated_user_can_add_experience(self):
        response = self.client.post(reverse('user_experience'), {
            'role': 'Backend Developer',
            'company': 'Forsa',
            'location': 'Riyadh',
            'period': '2024 - الآن',
            'description': 'Building APIs',
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Experience.objects.filter(user=self.user).count(), 1)
        self.assertEqual(response.data['company'], 'Forsa')

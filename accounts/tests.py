from django.test import TestCase

# Create your tests here.
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

from companies.models import Company
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

    def test_switching_to_employer_creates_company_profile(self):
        response = self.client.patch(reverse('current_user'), {'role': 'employer'}, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['role'], 'employer')
        self.assertTrue(Company.objects.filter(user=self.user).exists())

    def test_registration_rejects_duplicate_email(self):
        response = self.client.post(reverse('register'), {
            'username': 'another-user',
            'email': 'seeker@example.com',
            'password': 'safe-password',
            'role': 'seeker',
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

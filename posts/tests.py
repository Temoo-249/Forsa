from django.test import TestCase

# Create your tests here.
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User


class PostOwnershipTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='author', email='author@example.com', password='safe-password'
        )
        self.client.force_authenticate(self.user)

    def test_created_post_exposes_its_author_id(self):
        response = self.client.post('/api/posts/', {
            'content': 'A professional update',
            'skills': ['Django'],
            'category': 'عام',
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['id'].startswith('post-'))
        self.assertEqual(response.data['authorId'], str(self.user.id))

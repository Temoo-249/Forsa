from django.test import TestCase

# Create your tests here.
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User
from .models import Conversation


class MessagingApiTests(APITestCase):
    def setUp(self):
        self.employer = User.objects.create_user(
            username='employer', email='employer@example.com', password='safe-password', role='employer'
        )
        self.seeker = User.objects.create_user(
            username='seeker', email='seeker@example.com', password='safe-password'
        )
        self.conversation = Conversation.objects.create(
            id='conversation-test', user=self.employer, peer=self.seeker, company_name='Forsa'
        )

    def test_sender_is_derived_from_authenticated_user(self):
        self.client.force_authenticate(self.employer)

        response = self.client.post(
            f'/api/conversations/{self.conversation.id}/messages/',
            {'text': 'Hello candidate', 'sender': 'user'},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['sender'], 'company')

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

    def test_employer_can_open_a_conversation_from_a_profile(self):
        self.client.force_authenticate(self.employer)

        response = self.client.post(f'/api/conversations/profiles/{self.seeker.id}/', {}, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['id'], self.conversation.id)
        self.assertEqual(Conversation.objects.filter(user=self.employer, peer=self.seeker).count(), 1)

    def test_seeker_can_open_a_regular_conversation_but_cannot_send_an_offer(self):
        other_seeker = User.objects.create_user(
            username='other-seeker', email='other@example.com', password='safe-password'
        )
        self.client.force_authenticate(other_seeker)

        response = self.client.post(f'/api/conversations/profiles/{self.seeker.id}/', {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = self.client.post(
            f'/api/conversations/{response.data["id"]}/messages/',
            {'text': 'I should not be an offer', 'isOffer': True},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

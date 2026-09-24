from django.test import TestCase

# Create your tests here.
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User
from companies.models import Company
from .models import Job


class JobOwnershipTests(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user(
            username='employer', email='employer@example.com', password='safe-password', role='employer'
        )
        self.company = Company.objects.create(
            id='company-test', user=self.owner, name='Forsa', industry='Technology', location='Riyadh'
        )
        self.job = Job.objects.create(
            id='job-test', company_ref=self.company, title='Developer', company='Forsa',
            location='Riyadh', salary='10000', description='Build reliable software'
        )

    def test_owner_can_delete_job_and_company_count_is_refreshed(self):
        self.client.force_authenticate(self.owner)

        response = self.client.delete(f'/api/jobs/{self.job.id}/')

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Job.objects.filter(id=self.job.id).exists())
        self.company.refresh_from_db()
        self.assertEqual(self.company.open_jobs_count, 0)

    def test_other_user_cannot_delete_job(self):
        other = User.objects.create_user(username='other', email='other@example.com', password='safe-password', role='employer')
        self.client.force_authenticate(other)

        response = self.client.delete(f'/api/jobs/{self.job.id}/')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(Job.objects.filter(id=self.job.id).exists())

    def test_job_response_includes_immutable_company_and_owner_ids(self):
        response = self.client.get('/api/jobs/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        item = response.data[0]
        self.assertEqual(item['id'], self.job.id)
        self.assertEqual(item['companyId'], self.company.id)
        self.assertEqual(item['ownerId'], str(self.owner.id))

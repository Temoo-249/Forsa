from rest_framework import status, views
from rest_framework.response import Response
from django.db.models import Q
from rest_framework import permissions
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from accounts.models import User
import uuid

class ConversationListView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        user = request.user
        conversations = Conversation.objects.filter(Q(user=user) | Q(peer=user)).order_by('-updated_at')
        return Response(ConversationSerializer(conversations, many=True).data)

class ConversationDetailView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, pk):
        try:
            conv = Conversation.objects.get(id=pk)
            if request.user.id not in {conv.user_id, conv.peer_id}:
                raise Conversation.DoesNotExist
            return Response(ConversationSerializer(conv).data)
        except Conversation.DoesNotExist:
            return Response({'detail': 'Conversation not found'}, status=status.HTTP_404_NOT_FOUND)

class SendMessageView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, pk):
        try:
            conv = Conversation.objects.get(id=pk)
            if request.user.id not in {conv.user_id, conv.peer_id}:
                raise Conversation.DoesNotExist
        except Conversation.DoesNotExist:
            return Response({'detail': 'Conversation not found'}, status=status.HTTP_404_NOT_FOUND)

        text = request.data.get('text', '')
        sender = request.data.get('sender', 'user')
        is_offer = request.data.get('isOffer', False)
        offer_details = request.data.get('offerDetails')

        msg = Message.objects.create(
            id=f"msg-{uuid.uuid4().hex[:6]}",
            conversation=conv,
            sender=sender,
            text=text,
            time='الآن',
            is_offer=is_offer,
            offer_details=offer_details
        )

        conv.last_message = text if text else 'عرض عمل وظيفي'
        conv.last_message_time = 'الآن'
        conv.save()

        return Response(MessageSerializer(msg).data, status=status.HTTP_201_CREATED)

class RespondOfferView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, pk, message_id):
        try:
            msg = Message.objects.get(id=message_id, conversation__id=pk)
            if request.user.id not in {msg.conversation.user_id, msg.conversation.peer_id}:
                raise Message.DoesNotExist
        except Message.DoesNotExist:
            return Response({'detail': 'Message not found'}, status=status.HTTP_404_NOT_FOUND)

        action = request.data.get('action') # 'accept' or 'decline'
        if msg.offer_details:
            details = msg.offer_details.copy()
            if action == 'accept':
                details['accepted'] = True
                details['declined'] = False
            elif action == 'decline':
                details['accepted'] = False
                details['declined'] = True
            msg.offer_details = details
            msg.save()
            return Response(MessageSerializer(msg).data)

        return Response({'detail': 'Not an offer message'}, status=status.HTTP_400_BAD_REQUEST)


class ProfileConversationView(views.APIView):
    """Employer-only contact and job-offer action for a seeker profile."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, user_id):
        from accounts.models import User
        if request.user.role != 'employer':
            return Response({'detail': 'Only employers can contact candidates'}, status=status.HTTP_403_FORBIDDEN)
        try:
            candidate = User.objects.get(id=user_id, role='seeker', is_active=True)
        except User.DoesNotExist:
            return Response({'detail': 'Candidate not found'}, status=status.HTTP_404_NOT_FOUND)

        conversation = Conversation.objects.filter(Q(user=request.user, peer=candidate) | Q(user=candidate, peer=request.user)).first()
        if not conversation:
            conversation = Conversation.objects.create(
                id=f"conv-{uuid.uuid4().hex[:12]}", user=request.user, peer=candidate,
                company_name=candidate.get_full_name() or candidate.username,
                company_logo=candidate.avatar or '👤', job_title='', shared_files=[]
            )

        offer = request.data.get('offer')
        if offer:
            job_title = (offer.get('jobTitle') or '').strip()
            if not job_title:
                return Response({'detail': 'Job title is required for an offer'}, status=status.HTTP_400_BAD_REQUEST)
            message = Message.objects.create(
                id=f"msg-{uuid.uuid4().hex[:12]}", conversation=conversation, sender='company',
                text=(offer.get('message') or f'لديك عرض لوظيفة {job_title}'), time='الآن', is_offer=True,
                offer_details={'jobTitle': job_title, 'salary': offer.get('salary') or 'يحدد لاحقًا', 'startDate': offer.get('startDate') or 'يحدد لاحقًا'}
            )
            conversation.last_message, conversation.last_message_time, conversation.job_title = message.text, 'الآن', job_title
            conversation.save(update_fields=['last_message', 'last_message_time', 'job_title', 'updated_at'])
        return Response(ConversationSerializer(conversation).data, status=status.HTTP_201_CREATED)

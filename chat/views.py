from rest_framework import status, views
from rest_framework.response import Response
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from accounts.models import User
import uuid

class ConversationListView(views.APIView):
    def get(self, request):
        user = request.user if request.user.is_authenticated else User.objects.first()
        conversations = Conversation.objects.filter(user=user).order_by('-updated_at')
        return Response(ConversationSerializer(conversations, many=True).data)

class ConversationDetailView(views.APIView):
    def get(self, request, pk):
        try:
            conv = Conversation.objects.get(id=pk)
            return Response(ConversationSerializer(conv).data)
        except Conversation.DoesNotExist:
            return Response({'detail': 'Conversation not found'}, status=status.HTTP_404_NOT_FOUND)

class SendMessageView(views.APIView):
    def post(self, request, pk):
        try:
            conv = Conversation.objects.get(id=pk)
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
    def post(self, request, pk, message_id):
        try:
            msg = Message.objects.get(id=message_id, conversation__id=pk)
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

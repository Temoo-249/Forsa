from django.urls import path
from .views import ConversationListView, ConversationDetailView, SendMessageView, RespondOfferView

urlpatterns = [
    path('', ConversationListView.as_view(), name='conversation_list'),
    path('<str:pk>/', ConversationDetailView.as_view(), name='conversation_detail'),
    path('<str:pk>/messages/', SendMessageView.as_view(), name='send_message'),
    path('<str:pk>/messages/<str:message_id>/respond/', RespondOfferView.as_view(), name='respond_offer'),
]

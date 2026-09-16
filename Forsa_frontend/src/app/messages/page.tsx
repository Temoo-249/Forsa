'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { MessagesView } from '../../components/MessagesView';

export default function MessagesPage() {
  const app = useApp();

  return (
    <MessagesView
      conversations={app.conversations}
      onSendMessage={app.handleSendMessage}
      onRespondOffer={app.handleRespondOffer}
    />
  );
}

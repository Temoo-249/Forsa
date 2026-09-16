'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { AuthView } from '../../components/AuthView';

export default function AuthPage() {
  const app = useApp();

  return (
    <AuthView
      onLoginSuccess={app.handleLoginSuccess}
      onNavigateTab={app.navigate}
      onCloseModal={() => app.navigate('landing')}
    />
  );
}

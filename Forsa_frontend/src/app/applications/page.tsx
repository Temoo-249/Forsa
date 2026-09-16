'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { ApplicationsView } from '../../components/ApplicationsView';

export default function ApplicationsPage() {
  const app = useApp();

  return (
    <ApplicationsView
      applications={app.applications}
      onNavigateToChat={(_companyName) => {
        app.navigate('messages');
      }}
      onExploreJobs={() => app.navigate('jobs')}
    />
  );
}

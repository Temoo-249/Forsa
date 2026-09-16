'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { LandingView } from '../components/LandingView';

export default function HomePage() {
  const app = useApp();

  return (
    <LandingView
      onNavigate={app.navigate}
      featuredJobs={app.jobs}
      onSelectJobForDetail={(job) => app.setSelectedJobForDetail(job)}
      onSelectJobForApply={(job) => app.setSelectedJobForApply(job)}
    />
  );
}

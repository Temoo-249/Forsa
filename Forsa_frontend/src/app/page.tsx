'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';
import { LandingView } from '../components/LandingView';

export default function HomePage() {
  const app = useApp();
  const router = useRouter();

  useEffect(() => {
    if (app.authReady && app.currentUser) router.replace('/feed');
  }, [app.authReady, app.currentUser, router]);

  // Do not expose the public introduction for a signed-in account while its
  // restored session is being routed to the professional feed.
  if (!app.authReady || app.currentUser) return null;

  return (
    <LandingView
      onNavigate={app.navigate}
      featuredJobs={app.jobs}
      companies={app.companies}
      onSelectJobForDetail={(job) => app.setSelectedJobForDetail(job)}
      onSelectJobForApply={(job) => app.setSelectedJobForApply(job)}
    />
  );
}

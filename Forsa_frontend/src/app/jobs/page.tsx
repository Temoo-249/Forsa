'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { JobsView } from '../../components/JobsView';

export default function JobsPage() {
  const app = useApp();

  return (
    <JobsView
      jobs={app.jobs}
      onSelectJobForDetail={(job) => app.setSelectedJobForDetail(job)}
      onSelectJobForApply={(job) => app.setSelectedJobForApply(job)}
      onToggleSaveJob={app.handleToggleSaveJob}
    />
  );
}

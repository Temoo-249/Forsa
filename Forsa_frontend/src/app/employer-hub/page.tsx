'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { EmployerDashboard } from '../../components/EmployerDashboard';

export default function EmployerHubPage() {
  const app = useApp();

  return (
    <EmployerDashboard
      company={app.myEmployerCompany}
      jobs={app.jobs}
      applicants={app.employerApplicants}
      onPostJob={app.handlePostJob}
      onUpdateApplicantStatus={app.handleUpdateApplicantStatus}
      onScheduleInterview={app.handleScheduleInterview}
      onContactCandidate={app.handleContactCandidate}
      onUpdateCompany={app.handleUpdateCompany}
      onDeleteJob={app.handleDeleteJob}
      onToggleJobStatus={app.handleToggleJobStatus}
      onSwitchToSeeker={() => {
        app.setUserRole('seeker');
        app.navigate('jobs');
      }}
      onSelectJobForDetail={(job) => app.setSelectedJobForDetail(job)}
      onSelectJobForApply={(job) => app.setSelectedJobForApply(job)}
      onLogout={app.handleLogout}
    />
  );
}

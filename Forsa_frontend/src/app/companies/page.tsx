'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CompaniesView } from '../../components/CompaniesView';
import { CompanyDetailModal } from '../../components/CompanyDetailModal';
import { Company } from '../../types';

export default function CompaniesPage() {
  const app = useApp();
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  return (
    <>
      <CompaniesView
        companies={app.companies}
        jobs={app.jobs}
        onSelectCompany={(company) => setSelectedCompany(company)}
        onSelectJobForDetail={(job) => app.setSelectedJobForDetail(job)}
        onSelectJobForApply={(job) => app.setSelectedJobForApply(job)}
        onSwitchToEmployer={() => {
          app.setUserRole('employer');
          app.navigate('employer-hub');
        }}
      />

      <CompanyDetailModal
        company={selectedCompany}
        isOpen={!!selectedCompany}
        onClose={() => setSelectedCompany(null)}
        jobs={app.jobs}
        onSelectJobForDetail={(job) => {
          setSelectedCompany(null);
          app.setSelectedJobForDetail(job);
        }}
        onSelectJobForApply={(job) => {
          setSelectedCompany(null);
          app.setSelectedJobForApply(job);
        }}
      />
    </>
  );
}

'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProfileView } from '../../components/ProfileView';

export default function ProfilePage() {
  const app = useApp();

  return (
    <ProfileView
      skills={app.skills}
      onAddSkill={app.handleAddSkill}
      experiences={app.experiences}
      onAddExperience={app.handleAddExperience}
      educations={app.educations}
      cvFiles={app.cvFiles}
      onUploadCV={app.handleUploadCV}
      onSetDefaultCV={app.handleSetDefaultCV}
      onDeleteCV={app.handleDeleteCV}
      currentUser={app.currentUser || undefined}
      onLogout={app.handleLogout}
    />
  );
}

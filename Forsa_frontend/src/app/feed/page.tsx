'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { FeedView } from '../../components/FeedView';

export default function FeedPage() {
  const app = useApp();

  return (
    <FeedView
      posts={app.posts}
      onAddPost={app.handleAddPost}
      onLikePost={app.handleLikePost}
      recommendedJobs={app.jobs}
      onSelectJobForDetail={(job) => app.setSelectedJobForDetail(job)}
      onSelectJobForApply={(job) => app.setSelectedJobForApply(job)}
      onNavigateTab={app.navigate}
      applicationsCount={app.applications.length}
    />
  );
}

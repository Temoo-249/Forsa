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
      onDeletePost={app.handleDeletePost}
      onGetComments={app.handleGetComments}
      onAddComment={app.handleAddComment}
     /* onDeleteComment={async (commentId: string) => {
        // ملاحظة: handleDeleteComment في AppContext بتاخد (postId, commentId)
        // لكن FeedView بتبعتها commentId بس. عشان كذا نمرر postId فارغ،
        // والـ AppContext هيتعامل مع ده من خلال إعادة تحميل التعليقات.
        // الأفضل: نعدّل AppContext عشان تقبل commentId بس.
        // (شوف التعديل 2 تحت)
        await app.handleDeleteComment('', commentId);
      }}*/
     onDeleteComment={app.handleDeleteComment}
      recommendedJobs={app.jobs}
      onSelectJobForDetail={(job) => app.setSelectedJobForDetail(job)}
      onSelectJobForApply={(job) => app.setSelectedJobForApply(job)}
      onNavigateTab={app.navigate}
      applicationsCount={app.applications.length}
    />
  );
}
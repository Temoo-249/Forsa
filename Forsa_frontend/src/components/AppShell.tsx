'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useApp } from '../context/AppContext';
import { Navbar } from './Navbar';
import { MobileNav } from './MobileNav';
import { Footer } from './Footer';
import { JobDetailModal } from './JobDetailModal';
import { ApplyModal } from './ApplyModal';
import { PostJobModal } from './PostJobModal';
import { CheckCircle2, X } from 'lucide-react';

export function AppShell({ children }: { children: React.ReactNode }) {
  const app = useApp();
  const pathname = usePathname();
  const isAuthPage = ['/auth', '/login', '/register'].includes(pathname);

  const unreadMessagesCount = app.conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white" dir="rtl">

      {/* The authentication pages deliberately use their focused, standalone layout. */}
      {!isAuthPage && <Navbar
        currentTab={app.currentTab}
        onSelectTab={app.navigate}
        applicationsCount={app.applications.length}
        unreadMessagesCount={unreadMessagesCount}
        notifications={app.notifications}
        onNotificationClick={app.handleNotificationClick}
        onMarkAllNotificationsRead={app.handleMarkAllNotificationsRead}
        userRole={app.userRole}
        currentUser={app.currentUser ?? undefined}
        onLogout={app.handleLogout}
        onToggleRole={app.handleToggleRole}
        onOpenPostJobModal={() => app.setIsPostJobModalOpen(true)}
      />}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-12">
        {children}
      </main>

      {/* Footer */}
      <Footer onNavigate={app.navigate} onShowMessage={(msg) => app.showToast(msg)} />

      {/* Mobile Bottom Navigation */}
      <MobileNav
        currentTab={app.currentTab}
        onSelectTab={app.navigate}
        applicationsCount={app.applications.length}
        unreadMessagesCount={unreadMessagesCount}
        userRole={app.userRole}
      />

      {/* ─── Modals ─── */}
      <JobDetailModal
        job={app.selectedJobForDetail}
        isOpen={!!app.selectedJobForDetail}
        onClose={() => app.setSelectedJobForDetail(null)}
        onApplyClick={(job) => {
          app.setSelectedJobForDetail(null);
          app.setSelectedJobForApply(job);
        }}
        onToggleSave={app.handleToggleSaveJob}
      />

      <ApplyModal
        job={app.selectedJobForApply}
        isOpen={!!app.selectedJobForApply}
        onClose={() => app.setSelectedJobForApply(null)}
        onApplySuccess={app.handleApplySuccess}
        cvFiles={app.cvFiles}
      />

      <PostJobModal
        isOpen={app.isPostJobModalOpen}
        onClose={() => app.setIsPostJobModalOpen(false)}
        employerCompany={app.myEmployerCompany}
        onPostJob={app.handlePostJob}
      />

      {/* ─── Toast Notifications ─── */}
      {app.toastMessage && (
        <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3.5 border border-slate-800 text-xs sm:text-sm">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold block">{app.toastMessage.title}</span>
              {app.toastMessage.subtitle && (
                <span className="text-[11px] text-slate-400 block mt-0.5">{app.toastMessage.subtitle}</span>
              )}
            </div>
            {app.toastMessage.actionLabel && app.toastMessage.onAction && (
              <button
                onClick={() => {
                  app.toastMessage?.onAction?.();
                  app.setToastMessage(null);
                }}
                className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold mr-2 shrink-0 transition-colors"
              >
                {app.toastMessage.actionLabel}
              </button>
            )}
            <button
              onClick={() => app.setToastMessage(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

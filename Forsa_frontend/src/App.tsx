'use client';

import React, { useState } from 'react';
import { 
  TabType, 
  Job, 
  Application, 
  Post, 
  Conversation, 
  NotificationItem, 
  SkillItem, 
  ExperienceItem, 
  EducationItem, 
  CVFile,
  UserRole,
  Company,
  JobApplicant,
  ApplicationStatus,
  AuthUser
} from './types';
import {
  initialJobs,
  initialApplications,
  initialPosts,
  initialConversations,
  initialNotifications,
  initialSkills,
  initialExperiences,
  initialEducations,
  initialCVFiles,
  initialCompanies,
  initialCompanyApplicants
} from './data/mockData';
import { 
  authAPI, 
  jobsAPI, 
  applicationsAPI, 
  companiesAPI, 
  postsAPI, 
  chatAPI, 
  notificationsAPI 
} from './services/api';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { JobsView } from './components/JobsView';
import { ApplicationsView } from './components/ApplicationsView';
import { FeedView } from './components/FeedView';
import { MessagesView } from './components/MessagesView';
import { ProfileView } from './components/ProfileView';
import { LandingView } from './components/LandingView';
import { CompaniesView } from './components/CompaniesView';
import { EmployerDashboard } from './components/EmployerDashboard';
import { AuthView } from './components/AuthView';
import { ApplyModal } from './components/ApplyModal';
import { JobDetailModal } from './components/JobDetailModal';
import { PostJobModal } from './components/PostJobModal';
import { Footer } from './components/Footer';
import { CheckCircle2, Sparkles, X } from 'lucide-react';

interface AppProps {
  initialTab?: TabType;
}

export default function App({ initialTab }: AppProps) {
  const getInitialTab = (): TabType => {
    if (initialTab) return initialTab;
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.replace(/^\//, '');
      if (['jobs', 'applications', 'feed', 'messages', 'profile', 'landing', 'companies', 'employer-hub', 'auth', 'login', 'register'].includes(path)) {
        if (path === 'login' || path === 'register') return 'auth';
        return path as TabType;
      }
      if (path === '') {
        return 'landing';
      }
    }
    return 'landing';
  };

  const [currentTab, setCurrentTabState] = useState<TabType>(getInitialTab);

  const setCurrentTab = (tab: TabType) => {
    setCurrentTabState(tab);
    if (typeof window !== 'undefined') {
      const targetPath = tab === 'landing' ? '/' : `/${tab}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState(null, '', targetPath);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  React.useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\//, '');
      if (['jobs', 'applications', 'feed', 'messages', 'profile', 'landing', 'companies', 'employer-hub', 'auth', 'login', 'register'].includes(path)) {
        if (path === 'login' || path === 'register') {
          setCurrentTabState('auth');
        } else {
          setCurrentTabState(path as TabType);
        }
      } else if (path === '') {
        setCurrentTabState('landing');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Current Authentication User Session
  const [currentUser, setCurrentUser] = useState<AuthUser | null>({
    id: 'usr-1',
    name: 'أحمد الرشيد',
    email: 'ahmed.rashid.dev@example.com',
    role: 'seeker',
    avatar: 'أر',
    headline: 'Senior Full Stack Developer متخصص في معمارية تطبيقات الويب باستخدام React, TypeScript و Node.js.',
    token: 'forsa-session-token-123'
  });

  const [userRole, setUserRole] = useState<UserRole>('seeker');

  // Core Data States
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [skills, setSkills] = useState<SkillItem[]>(initialSkills);
  const [experiences, setExperiences] = useState<ExperienceItem[]>(initialExperiences);
  const [educations, setEducations] = useState<EducationItem[]>(initialEducations);
  const [cvFiles, setCvFiles] = useState<CVFile[]>(initialCVFiles);

  // Companies & Employer States
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [employerApplicants, setEmployerApplicants] = useState<JobApplicant[]>(initialCompanyApplicants);
  const [myEmployerCompany, setMyEmployerCompany] = useState<Company>(initialCompanies[0]);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);

  // Modals & Popups
  const [selectedJobForDetail, setSelectedJobForDetail] = useState<Job | null>(null);
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle?: string; actionLabel?: string; onAction?: () => void } | null>(null);

  // Sync initial data with Backend on mount (with automatic fallback)
  React.useEffect(() => {
    let isMounted = true;
    const fetchBackendData = async () => {
      try {
        const [backendJobs, backendCompanies, backendPosts, backendApps, backendConvs, backendNotifs] = await Promise.all([
          jobsAPI.getJobs(undefined, initialJobs),
          companiesAPI.getCompanies(initialCompanies),
          postsAPI.getPosts(undefined, initialPosts),
          applicationsAPI.getMyApplications(initialApplications),
          chatAPI.getConversations(initialConversations),
          notificationsAPI.getNotifications(initialNotifications)
        ]);

        if (isMounted) {
          if (backendJobs && backendJobs.length > 0) setJobs(backendJobs);
          if (backendCompanies && backendCompanies.length > 0) setCompanies(backendCompanies);
          if (backendPosts && backendPosts.length > 0) setPosts(backendPosts);
          if (backendApps && backendApps.length > 0) setApplications(backendApps);
          if (backendConvs && backendConvs.length > 0) setConversations(backendConvs);
          if (backendNotifs && backendNotifs.length > 0) setNotifications(backendNotifs);
        }
      } catch (err) {
        console.warn('Sync with backend failed, keeping mock data:', err);
      }
    };
    fetchBackendData();
    return () => { isMounted = false; };
  }, []);

  const showToast = (title: string, subtitle?: string, actionLabel?: string, onAction?: () => void) => {
    setToastMessage({ title, subtitle, actionLabel, onAction });
    setTimeout(() => {
      setToastMessage(prev => (prev?.title === title ? null : prev));
    }, 5000);
  };

  // Job Bookmark toggle
  const handleToggleSaveJob = (jobId: string) => {
    jobsAPI.toggleSave(jobId);
    setJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        const nextSaved = !job.isSaved;
        showToast(nextSaved ? 'تم حفظ الوظيفة في قائمتك' : 'تمت إزالة الوظيفة من المحفوظات');
        return { ...job, isSaved: nextSaved };
      }
      return job;
    }));
  };

  // Apply to Job
  const handleApplySuccess = (jobId: string, coverNote: string, cvName: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    // Send to backend
    jobsAPI.apply(jobId, { resumeFileName: cvName, coverNote });

    // Mark job as applied
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, applied: true, applicantsCount: j.applicantsCount + 1 } : j));

    // Create new application
    const newApp: Application = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      logo: job.logo,
      applyDate: 'اليوم',
      status: 'التقدم',
      currentStepIndex: 0,
      resumeFileName: cvName,
      timeline: [
        { title: 'تم تقديم الطلب بنجاح', date: 'اليوم، الآن', completed: true, note: coverNote || 'تم إرسال السيرة الذاتية لمدير التوظيف.' },
        { title: 'المراجعة والفرز الأولي', date: 'قيد الانتظار', completed: false, active: true },
        { title: 'الاختصار (Shortlisting)', date: 'قريباً', completed: false },
        { title: 'المقابلة', date: 'بانتظار التحديد', completed: false },
        { title: 'العرض الوظيفي', date: 'قريباً', completed: false },
        { title: 'التوظيف النهائي', date: 'قريباً', completed: false },
      ]
    };

    setApplications(prev => [newApp, ...prev]);

    // Add Notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        icon: '💼',
        title: `تم استلام طلب تقديمك بنجاح لمنصب ${job.title} في ${job.company}`,
        time: 'الآن',
        unread: true,
        actionTab: 'applications'
      },
      ...prev
    ]);

    showToast(
      `تم إرسال طلبك إلى ${job.company} بنجاح!`,
      'يمكنك تتبع حالة الطلب خطوة بخطوة من قسم طلباتي',
      'عرض في طلباتي',
      () => setCurrentTab('applications')
    );
  };

  // Community Feed Actions
  const handleAddPost = (newPostData: Omit<Post, 'id' | 'likes' | 'comments' | 'timeAgo' | 'isLiked'>) => {
    postsAPI.createPost({
      content: newPostData.content,
      skills: newPostData.skills,
      category: newPostData.category || 'عام'
    });

    const post: Post = {
      ...newPostData,
      id: `post-${Date.now()}`,
      likes: 1,
      comments: 0,
      timeAgo: 'الآن',
      isLiked: true
    };
    setPosts(prev => [post, ...prev]);
    showToast('تم نشر منشورك في المجتمع المهني بنجاح');
  };

  const handleLikePost = (postId: string) => {
    postsAPI.toggleLike(postId);
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          likes: p.isLiked ? p.likes - 1 : p.likes + 1,
          isLiked: !p.isLiked
        };
      }
      return p;
    }));
  };

  // Messages Actions
  const handleSendMessage = (convId: string, text: string) => {
    chatAPI.sendMessage(convId, { text, sender: 'user' });

    const now = new Date();
    const timeStr = `${now.getHours() % 12 || 12}:${now.getMinutes().toString().padStart(2, '0')} ${now.getHours() >= 12 ? 'م' : 'ص'}`;

    const newMsg = {
      id: `m-${Date.now()}`,
      sender: 'user' as const,
      text,
      time: timeStr
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === convId) {
        return {
          ...conv,
          lastMessage: text,
          lastMessageTime: 'الآن',
          messages: [...conv.messages, newMsg]
        };
      }
      return conv;
    }));

    // Simulate friendly auto recruiter response after 1.5s
    setTimeout(() => {
      setConversations(prev => prev.map(conv => {
        if (conv.id === convId) {
          const reply = {
            id: `reply-${Date.now()}`,
            sender: 'company' as const,
            text: 'شكراً لرسالتك! استلمنا تفاصيلك وسيقوم مسؤول التوظيف بالرد عليك في أقرب وقت.',
            time: 'الآن'
          };
          return {
            ...conv,
            lastMessage: reply.text,
            lastMessageTime: 'الآن',
            messages: [...conv.messages, reply]
          };
        }
        return conv;
      }));
    }, 1500);
  };

  // Respond to Job Offer
  const handleRespondOffer = (convId: string, messageId: string, accepted: boolean) => {
    chatAPI.respondOffer(convId, messageId, accepted ? 'accept' : 'decline');

    setConversations(prev => prev.map(c => {
      if (c.id === convId) {
        return {
          ...c,
          messages: c.messages.map(m => {
            if (m.id === messageId && m.offerDetails) {
              return {
                ...m,
                offerDetails: {
                  ...m.offerDetails,
                  accepted,
                  declined: !accepted
                }
              };
            }
            return m;
          })
        };
      }
      return c;
    }));

    if (accepted) {
      showToast('تهانينا الحارة! 🎉 تم قبول العرض الوظيفي وسنقوم بتحديث ملفك رسمياً');
    } else {
      showToast('تم تسجيل اعتذارك عن العرض الوظيفي');
    }
  };

  // Profile Skills & Experiences
  const handleAddSkill = (skill: Omit<SkillItem, 'id'>) => {
    setSkills(prev => [...prev, { ...skill, id: `sk-${Date.now()}` }]);
    showToast(`تمت إضافة مهارة "${skill.name}" إلى ملفك الشخصي`);
  };

  const handleAddExperience = (exp: Omit<ExperienceItem, 'id'>) => {
    setExperiences(prev => [{ ...exp, id: `exp-${Date.now()}` }, ...prev]);
    showToast(`تمت إضافة خبرة "${exp.role}" في ${exp.company}`);
  };

  // CV Actions
  const handleUploadCV = (name: string, size: string) => {
    const newCV: CVFile = {
      id: `cv-${Date.now()}`,
      name,
      size,
      uploadDate: 'اليوم',
      isDefault: false
    };
    setCvFiles(prev => [newCV, ...prev]);
    showToast(`تم رفع ملف السيرة الذاتية "${name}" بنجاح`);
  };

  const handleSetDefaultCV = (id: string) => {
    setCvFiles(prev => prev.map(c => ({
      ...c,
      isDefault: c.id === id
    })));
    showToast('تم تعيين الملف كسيرة ذاتية أساسية للتقديم');
  };

  const handleDeleteCV = (id: string) => {
    setCvFiles(prev => prev.filter(c => c.id !== id));
    showToast('تم حذف الملف بنجاح');
  };

  // Employer & Companies Actions
  const handlePostJob = (newJob: Job) => {
    // Send to backend
    jobsAPI.createJob(newJob);

    setJobs(prev => [newJob, ...prev]);
    // Update company's open job count
    setCompanies(prev => prev.map(c => {
      if (c.name.trim().toLowerCase() === newJob.company.trim().toLowerCase()) {
        return { ...c, openJobsCount: c.openJobsCount + 1 };
      }
      return c;
    }));
    setMyEmployerCompany(prev => ({
      ...prev,
      openJobsCount: prev.openJobsCount + 1
    }));
    showToast(`تم نشر وظيفة "${newJob.title}" بنجاح!`, 'تظهر الآن للباحثين عن عمل في استكشاف الوظائف.');
  };

  const handleUpdateApplicantStatus = (applicantId: string, status: ApplicationStatus) => {
    applicationsAPI.updateApplicantStatus(applicantId, { status });

    setEmployerApplicants(prev => prev.map(app => {
      if (app.id === applicantId) {
        return { ...app, status };
      }
      return app;
    }));
    showToast(`تم تحديث حالة المرشح إلى: ${status}`);
  };

  const handleScheduleInterview = (applicantId: string, interviewDate: string) => {
    applicationsAPI.updateApplicantStatus(applicantId, { interviewDate, status: 'المقابلة' });

    setEmployerApplicants(prev => prev.map(app => {
      if (app.id === applicantId) {
        return { ...app, interviewDate, status: 'المقابلة' };
      }
      return app;
    }));
    showToast('تم تحديد موعد المقابلة بنجاح', `الموعد: ${interviewDate}`);
  };

  const handleContactCandidate = (applicant: JobApplicant) => {
    // Check if conversation exists
    let existing = conversations.find(c => c.companyName === applicant.candidateName);
    if (!existing) {
      const newConv: Conversation = {
        id: `conv-cand-${applicant.id}`,
        companyName: applicant.candidateName,
        companyLogo: applicant.candidateAvatar,
        jobTitle: `مرشح لوظيفة ${applicant.jobTitle}`,
        lastMessage: `مرحباً ${applicant.candidateName}، نود التواصل معك بخصوص طلبك لوظيفة ${applicant.jobTitle}.`,
        lastMessageTime: 'الآن',
        isOnline: true,
        unreadCount: 0,
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: 'company',
            text: `مرحباً ${applicant.candidateName}، نود التواصل معك بخصوص طلبك لوظيفة ${applicant.jobTitle}.`,
            time: 'الآن'
          }
        ],
        sharedFiles: [
          { name: applicant.resumeFileName, date: applicant.appliedDate, size: '2.4 MB' }
        ]
      };
      setConversations(prev => [newConv, ...prev]);
    }
    setCurrentTab('messages');
    showToast(`تم فتح المحادثة مع المرشح ${applicant.candidateName}`);
  };

  const handleUpdateCompany = (updatedCompany: Company) => {
    setCompanies(prev => prev.map(c => c.id === updatedCompany.id ? updatedCompany : c));
    setMyEmployerCompany(updatedCompany);
    showToast('تم حفظ وتحديث بيانات الشركة بنجاح');
  };

  const handleDeleteJob = (jobId: string) => {
    const jobToDelete = jobs.find(j => j.id === jobId);
    setJobs(prev => prev.filter(j => j.id !== jobId));
    if (jobToDelete) {
      setCompanies(prev => prev.map(c => {
        if (c.name.trim().toLowerCase() === jobToDelete.company.trim().toLowerCase()) {
          return { ...c, openJobsCount: Math.max(0, c.openJobsCount - 1) };
        }
        return c;
      }));
      setMyEmployerCompany(prev => ({
        ...prev,
        openJobsCount: Math.max(0, prev.openJobsCount - 1)
      }));
    }
    showToast('تم حذف الوظيفة من المنصة');
  };

  const handleToggleJobStatus = (jobId: string) => {
    showToast('تم تغيير حالة الوظيفة');
  };

  // Notifications
  const handleNotificationClick = (notif: NotificationItem) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, unread: false } : n));
    if (notif.actionTab) {
      setCurrentTab(notif.actionTab);
    }
  };

  const handleMarkAllNotificationsRead = () => {
    notificationsAPI.markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    showToast('تم تعليم جميع الإشعارات كمقروءة');
  };

  // Unread badge count
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  // Authentication Actions
  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setUserRole(user.role);
    if (user.role === 'employer') {
      setCurrentTab('employer-hub');
    } else {
      setCurrentTab('jobs');
    }
    showToast(`أهلاً بك مجدداً يا ${user.name}! 👋`, 'تم تسجيل الدخول وتنشيط جلستك بنجاح');
  };

  const handleLogout = () => {
    authAPI.logout();
    setCurrentUser(null);
    setCurrentTab('landing');
    showToast('تم تسجيل الخروج بنجاح 👋', 'تم إنهاء الجلسة، يمكنك تسجيل الدخول في أي وقت');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white" dir="rtl">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        applicationsCount={applications.length}
        unreadMessagesCount={unreadMessagesCount}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        userRole={userRole}
        currentUser={currentUser}
        onLogout={handleLogout}
        onToggleRole={() => {
          const nextRole = userRole === 'seeker' ? 'employer' : 'seeker';
          setUserRole(nextRole);
          if (currentUser) {
            setCurrentUser(prev => prev ? { ...prev, role: nextRole } : null);
          }
          if (nextRole === 'employer' && currentTab === 'applications') {
            setCurrentTab('employer-hub');
          }
          showToast(
            nextRole === 'employer'
              ? 'تم التبديل إلى وضع صاحب عمل / شركة'
              : 'تم التبديل إلى وضع باحث عن عمل'
          );
        }}
        onOpenPostJobModal={() => setIsPostJobModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-12">
        {currentTab === 'auth' && (
          <AuthView
            onLoginSuccess={handleLoginSuccess}
            onCancel={() => setCurrentTab('landing')}
          />
        )}

        {currentTab === 'landing' && (
          <LandingView
            onNavigate={setCurrentTab}
            featuredJobs={jobs}
            onSelectJobForDetail={(job) => setSelectedJobForDetail(job)}
            onSelectJobForApply={(job) => setSelectedJobForApply(job)}
          />
        )}

        {currentTab === 'jobs' && (
          <JobsView
            jobs={jobs}
            onSelectJobForDetail={(job) => setSelectedJobForDetail(job)}
            onSelectJobForApply={(job) => setSelectedJobForApply(job)}
            onToggleSaveJob={handleToggleSaveJob}
          />
        )}

        {currentTab === 'companies' && (
          <CompaniesView
            companies={companies}
            onSelectJobForDetail={(job) => setSelectedJobForDetail(job)}
            onSelectJobForApply={(job) => setSelectedJobForApply(job)}
            onNavigateToEmployerHub={() => {
              setUserRole('employer');
              setCurrentTab('employer-hub');
            }}
          />
        )}

        {currentTab === 'employer-hub' && (
          <EmployerDashboard
            company={myEmployerCompany}
            jobs={jobs}
            applicants={employerApplicants}
            onPostJob={handlePostJob}
            onUpdateApplicantStatus={handleUpdateApplicantStatus}
            onScheduleInterview={handleScheduleInterview}
            onContactCandidate={handleContactCandidate}
            onUpdateCompany={handleUpdateCompany}
            onDeleteJob={handleDeleteJob}
            onToggleJobStatus={handleToggleJobStatus}
            onSwitchToSeeker={() => {
              setUserRole('seeker');
              setCurrentTab('jobs');
            }}
            onSelectJobForDetail={(job) => setSelectedJobForDetail(job)}
            onSelectJobForApply={(job) => setSelectedJobForApply(job)}
            onLogout={handleLogout}
          />
        )}

        {currentTab === 'applications' && (
          <ApplicationsView
            applications={applications}
            onNavigateToChat={(companyName) => {
              setCurrentTab('messages');
            }}
            onExploreJobs={() => setCurrentTab('jobs')}
          />
        )}

        {currentTab === 'feed' && (
          <FeedView
            posts={posts}
            onAddPost={handleAddPost}
            onLikePost={handleLikePost}
            recommendedJobs={jobs}
            onSelectJobForDetail={(job) => setSelectedJobForDetail(job)}
            onSelectJobForApply={(job) => setSelectedJobForApply(job)}
            onNavigateTab={setCurrentTab}
            applicationsCount={applications.length}
          />
        )}

        {currentTab === 'messages' && (
          <MessagesView
            conversations={conversations}
            onSendMessage={handleSendMessage}
            onRespondOffer={handleRespondOffer}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            skills={skills}
            onAddSkill={handleAddSkill}
            experiences={experiences}
            onAddExperience={handleAddExperience}
            educations={educations}
            cvFiles={cvFiles}
            onUploadCV={handleUploadCV}
            onSetDefaultCV={handleSetDefaultCV}
            onDeleteCV={handleDeleteCV}
            currentUser={currentUser || undefined}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Bottom Footer (only on non-chat pages or full layouts) */}
      <Footer onNavigate={setCurrentTab} onShowMessage={(msg) => showToast(msg)} />

      {/* Mobile Bottom Navigation */}
      <MobileNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        applicationsCount={applications.length}
        unreadMessagesCount={unreadMessagesCount}
        userRole={userRole}
      />

      {/* Modals */}
      <JobDetailModal
        job={selectedJobForDetail}
        isOpen={!!selectedJobForDetail}
        onClose={() => setSelectedJobForDetail(null)}
        onApplyClick={(job) => {
          setSelectedJobForDetail(null);
          setSelectedJobForApply(job);
        }}
        onToggleSave={handleToggleSaveJob}
      />

      <ApplyModal
        job={selectedJobForApply}
        isOpen={!!selectedJobForApply}
        onClose={() => setSelectedJobForApply(null)}
        onApplySuccess={handleApplySuccess}
        cvFiles={cvFiles}
      />

      <PostJobModal
        isOpen={isPostJobModalOpen}
        onClose={() => setIsPostJobModalOpen(false)}
        employerCompany={myEmployerCompany}
        onPostJob={handlePostJob}
      />

      {/* Interactive Toast Notifications */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3.5 border border-slate-800 text-xs sm:text-sm">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold block">{toastMessage.title}</span>
              {toastMessage.subtitle && (
                <span className="text-[11px] text-slate-400 block mt-0.5">{toastMessage.subtitle}</span>
              )}
            </div>
            {toastMessage.actionLabel && toastMessage.onAction && (
              <button
                onClick={() => {
                  toastMessage.onAction?.();
                  setToastMessage(null);
                }}
                className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold mr-2 shrink-0 transition-colors"
              >
                {toastMessage.actionLabel}
              </button>
            )}
            <button
              onClick={() => setToastMessage(null)}
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

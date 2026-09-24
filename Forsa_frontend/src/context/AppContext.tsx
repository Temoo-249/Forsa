'use client';

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
} from '../types';
import {
  authAPI,
  jobsAPI,
  applicationsAPI,
  companiesAPI,
  postsAPI,
  chatAPI,
  notificationsAPI,
  profilesAPI
} from '../services/api';

// ─── Route Mapping ───────────────────────────────────────────────
const TAB_TO_ROUTE: Record<TabType, string> = {
  'landing': '/',
  'feed': '/feed',
  'jobs': '/jobs',
  'applications': '/applications',
  'messages': '/messages',
  'profile': '/profile',
  'companies': '/companies',
  'employer-hub': '/employer-hub',
  'auth': '/auth',
};

function pathnameToTab(pathname: string): TabType {
  const path = pathname.replace(/^\//, '');
  if (path === '') return 'landing';
  if (path === 'login' || path === 'register') return 'auth';
  const validTabs = ['jobs', 'applications', 'feed', 'messages', 'profile', 'companies', 'employer-hub', 'auth', 'landing'];
  if (validTabs.includes(path)) return path as TabType;
  return 'landing';
}

// ─── Empty Company Placeholder (للـ employer اللي لسه مفيش له شركة) ───
const EMPTY_COMPANY: Company = {
  id: '',
  name: '',
  tagline: '',
  logo: '',
  coverGradient: '',
  industry: '',
  location: '',
  employeesCount: '',
  foundedYear: '',
  website: '',
  description: '',
  benefits: [],
  rating: 0,
  reviewsCount: 0,
  isVerified: false,
  openJobsCount: 0,
};

// ─── Feed Comment Type ────────────────────────────────────────────
export type FeedComment = {
  id: string;
  postId: string;
  parentId?: string | null;
  userId?: string;
  authorName: string;
  authorAvatar: string;
  avatarColor?: string;
  content: string;
  createdAt: string;
};

// ─── Context Type ────────────────────────────────────────────────
interface AppContextType {
  // Navigation
  currentTab: TabType;
  navigate: (tab: TabType) => void;

  // Auth
  currentUser: AuthUser | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
  userRole: UserRole;
  setUserRole: React.Dispatch<React.SetStateAction<UserRole>>;
  handleLoginSuccess: (user: AuthUser) => void;
  handleLogout: () => void;
  handleToggleRole: () => void;

  // Jobs
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  handleToggleSaveJob: (jobId: string) => void;
  handleApplySuccess: (jobId: string, coverNote: string, cvName: string) => void;

  // Applications
  applications: Application[];

  // Posts
  posts: Post[];
  handleAddPost: (data: Omit<Post, 'id' | 'likes' | 'comments' | 'timeAgo' | 'isLiked'>) => Promise<void>;
  handleLikePost: (postId: string) => Promise<void>;
  handleDeletePost: (postId: string) => Promise<void>;
  handleGetComments: (postId: string) => Promise<FeedComment[]>;
  handleAddComment: (postId: string, content: string, parentId?: string | null) => Promise<FeedComment>;
  handleDeleteComment: (postId: string, commentId: string) => Promise<void>;

  // Messages
  conversations: Conversation[];
  handleSendMessage: (convId: string, text: string) => void;
  handleRespondOffer: (convId: string, messageId: string, accepted: boolean) => void;

  // Notifications
  notifications: NotificationItem[];
  handleNotificationClick: (notif: NotificationItem) => void;
  handleMarkAllNotificationsRead: () => void;

  // Profile
  skills: SkillItem[];
  handleAddSkill: (skill: Omit<SkillItem, 'id'>) => void;
  experiences: ExperienceItem[];
  handleAddExperience: (exp: Omit<ExperienceItem, 'id'>) => void;
  
  educations: EducationItem[];
  cvFiles: CVFile[];

  

  handleUploadCV: (file: File) => Promise<void>;
  handleSetDefaultCV: (id: string) => void;
  handleDeleteCV: (id: string) => void;

  // Companies & Employer
  companies: Company[];
  employerApplicants: JobApplicant[];
  myEmployerCompany: Company;
 handlePostJob: (job: Job) => Promise<void>;
  handleUpdateApplicantStatus: (applicantId: string, status: ApplicationStatus) => void;
  handleScheduleInterview: (applicantId: string, interviewDate: string) => void;
  handleContactCandidate: (applicant: JobApplicant) => Promise<void>;
  handleUpdateCompany: (updatedCompany: Company) => Promise<boolean>;
  handleDeleteJob: (jobId: string) => void;
  handleToggleJobStatus: (jobId: string) => void;

  // Modals
  selectedJobForDetail: Job | null;
  setSelectedJobForDetail: (job: Job | null) => void;
  selectedJobForApply: Job | null;
  setSelectedJobForApply: (job: Job | null) => void;
  isPostJobModalOpen: boolean;
  setIsPostJobModalOpen: (open: boolean) => void;

  // Toast
  toastMessage: { title: string; subtitle?: string; actionLabel?: string; onAction?: () => void } | null;
  setToastMessage: React.Dispatch<React.SetStateAction<{ title: string; subtitle?: string; actionLabel?: string; onAction?: () => void } | null>>;
  showToast: (title: string, subtitle?: string, actionLabel?: string, onAction?: () => void) => void;

  handleUpdateProfile: (updates: {
  name?: string;
  headline?: string;
  bio?: string;
  phone?: string;
  location?: string;
}) => Promise<boolean>;
}

// ─── Context ─────────────────────────────────────────────────────
const AppContext = createContext<AppContextType | null>(null);

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

// ─── Provider ────────────────────────────────────────────────────
export function AppProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // ── Derived Navigation State ──
  const currentTab = useMemo(() => pathnameToTab(pathname), [pathname]);

  const navigate = useCallback((tab: TabType) => {
    router.push(TAB_TO_ROUTE[tab] || '/');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [router]);

  // ── Auth State (يبدأ فاضي - المستخدم لازم يسجل دخول) ──
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('seeker');

  // ── Core Data (كلها بتبدأ فاضية، هتتملى من الـ API) ──
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [educations, setEducations] = useState<EducationItem[]>([]);
  const [cvFiles, setCvFiles] = useState<CVFile[]>([]);

  // ── Companies & Employer ──
  const [companies, setCompanies] = useState<Company[]>([]);
  const [employerApplicants, setEmployerApplicants] = useState<JobApplicant[]>([]);
  const [myEmployerCompany, setMyEmployerCompany] = useState<Company>(EMPTY_COMPANY);

  // ── Modals ──
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [selectedJobForDetail, setSelectedJobForDetail] = useState<Job | null>(null);
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);

  // ── Toast ──
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle?: string; actionLabel?: string; onAction?: () => void } | null>(null);

  const showToast = useCallback((title: string, subtitle?: string, actionLabel?: string, onAction?: () => void) => {
    setToastMessage({ title, subtitle, actionLabel, onAction });
    setTimeout(() => {
      setToastMessage(prev => (prev?.title === title ? null : prev));
    }, 5000);
  }, []);

  // ── Backend Sync on Mount ──
  useEffect(() => {
    let isMounted = true;
    const fetchBackendData = async () => {
      try {
        const isLoggedOut = typeof window !== 'undefined' && localStorage.getItem('forsa_logged_out') === 'true';
        const token = typeof window !== 'undefined' ? localStorage.getItem('forsa_auth_token') : null;

        // لو مفيش توكن أو المستخدم مسجل خروج، متجيبش بيانات المستخدم
        const shouldFetchUser = !isLoggedOut && !!token;

        const [
          backendUser,
          backendJobs,
          backendCompanies,
          backendPosts,
          backendApps,
          backendEmployerApps,
          backendConvs,
          backendNotifs
        ] = await Promise.all([
          shouldFetchUser ? authAPI.getCurrentUser(null) : Promise.resolve(null),
          jobsAPI.getJobs(),
          companiesAPI.getCompanies(),
          postsAPI.getPosts(),
          shouldFetchUser ? applicationsAPI.getMyApplications() : Promise.resolve([]),
          shouldFetchUser ? applicationsAPI.getEmployerApplicants() : Promise.resolve([]),
          shouldFetchUser ? chatAPI.getConversations() : Promise.resolve([]),
          shouldFetchUser ? notificationsAPI.getNotifications() : Promise.resolve([])
        ]);

        if (isMounted) {
          // المستخدم
          if (backendUser && !isLoggedOut) {
            setCurrentUser(backendUser);
            setUserRole(backendUser.role || 'seeker');
            if ((backendUser as any).skills?.length > 0) setSkills((backendUser as any).skills);
            if ((backendUser as any).experiences?.length > 0) setExperiences((backendUser as any).experiences);
            if ((backendUser as any).educations?.length > 0) setEducations((backendUser as any).educations);
            if ((backendUser as any).resumes?.length > 0) setCvFiles((backendUser as any).resumes);
          } else {
            setCurrentUser(null);
          }

          // البيانات العامة (بتتحط دايمًا حتى لو فاضية)
          setJobs(backendJobs || []);
          setCompanies(backendCompanies || []);
          setPosts(backendPosts || []);
          setApplications(backendApps || []);
          setEmployerApplicants(backendEmployerApps || []);
          setConversations(backendConvs || []);
          setNotifications(backendNotifs || []);

          // لو المستخدم صاحب عمل وله شركة، نحطها
          if (backendCompanies && backendCompanies.length > 0 && backendUser?.role === 'employer') {
            setMyEmployerCompany(backendCompanies[0]);
          }
        }
      } catch (err) {
        console.warn('Sync with backend failed:', err);
      }
    };
    fetchBackendData();
    return () => { isMounted = false; };
  }, []);

  // ═══════════════════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════════════════

  // ── Auth ──
  const handleLoginSuccess = useCallback((user: AuthUser) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('forsa_logged_out');
    }
    setCurrentUser(user);
    setUserRole(user.role);
    if (user.role === 'employer') {
      navigate('employer-hub');
    } else {
      navigate('jobs');
    }
    showToast(`أهلاً بك مجدداً يا ${user.name}! 👋`, 'تم تسجيل الدخول وتنشيط جلستك بنجاح');
  }, [navigate, showToast]);

  const handleLogout = useCallback(() => {
    authAPI.logout();
    if (typeof window !== 'undefined') {
      localStorage.setItem('forsa_logged_out', 'true');
      localStorage.removeItem('forsa_auth_token');
    }
    setCurrentUser(null);
    navigate('landing');
    showToast('تم تسجيل الخروج بنجاح 👋', 'تم إنهاء الجلسة، يمكنك تسجيل الدخول في أي وقت');
  }, [navigate, showToast]);

  const handleToggleRole = useCallback(() => {
    const nextRole: UserRole = userRole === 'seeker' ? 'employer' : 'seeker';
    setUserRole(nextRole);
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, role: nextRole } : null);
    }
    if (nextRole === 'employer' && currentTab === 'applications') {
      navigate('employer-hub');
    }
    showToast(
      nextRole === 'employer'
        ? 'تم التبديل إلى وضع صاحب عمل / شركة'
        : 'تم التبديل إلى وضع باحث عن عمل'
    );
  }, [userRole, currentUser, currentTab, navigate, showToast]);

  // ── Jobs ──
  const handleToggleSaveJob = useCallback((jobId: string) => {
    jobsAPI.toggleSave(jobId);
    setJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        const nextSaved = !job.isSaved;
        showToast(nextSaved ? 'تم حفظ الوظيفة في قائمتك' : 'تمت إزالة الوظيفة من المحفوظات');
        return { ...job, isSaved: nextSaved };
      }
      return job;
    }));
  }, [showToast]);

  const handleApplySuccess = useCallback((jobId: string, coverNote: string, cvName: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    jobsAPI.apply(jobId, { resumeFileName: cvName, coverNote });

    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, applied: true, applicantsCount: j.applicantsCount + 1 } : j));

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
      () => navigate('applications')
    );
  }, [jobs, navigate, showToast]);

  // ── Posts ──
  const handleAddPost = useCallback(async (
    newPostData: Omit<Post, 'id' | 'likes' | 'comments' | 'timeAgo' | 'isLiked'>
  ) => {
    try {
      // مهم: نعتمد على ID الذي يرجعه الـ Backend حتى يظل المنشور قابلاً للحذف والتعديل لاحقاً.
     const savedPost = await postsAPI.createPost({
  content: newPostData.content,
  skills: newPostData.skills,
  category: newPostData.category || 'عام',
  image: (newPostData as any).image || null,
});

      if (!savedPost || !savedPost.id) {
        throw new Error('The backend did not return the created post.');
      }

      const post: Post = {
        ...newPostData,
        ...savedPost,
        id: String(savedPost.id),
        likes: Number(savedPost.likes ?? 0),
        comments: Number(savedPost.comments ?? 0),
        timeAgo: savedPost.timeAgo ?? 'الآن',
        isLiked: Boolean(savedPost.isLiked ?? false)
      };

      setPosts(prev => [post, ...prev]);
      showToast('تم نشر منشورك في المجتمع المهني بنجاح');
    } catch (error) {
      console.error('Create post error:', error);
      showToast('تعذر نشر المنشور', 'تحقق من الاتصال بالـ Backend وحاول مرة أخرى');
    }
  }, [showToast]);

  const handleLikePost = useCallback(async (postId: string) => {
    try {
      const result = await postsAPI.toggleLike(postId);

      setPosts(prev => prev.map(p => {
        if (p.id !== postId) return p;

        // استخدم قيم الـ Backend لو كانت متاحة، وإلا حدث الحالة محلياً بشكل متفائل.
        const nextLiked = typeof result?.isLiked === 'boolean' ? result.isLiked : !p.isLiked;
        const nextLikes = typeof result?.likes === 'number'
          ? result.likes
          : (nextLiked ? p.likes + 1 : Math.max(0, p.likes - 1));

        return { ...p, likes: nextLikes, isLiked: nextLiked };
      }));
    } catch (error) {
      console.error('Like post error:', error);
      showToast('تعذر تحديث الإعجاب', 'حاول مرة أخرى');
    }
  }, [showToast]);

  const handleDeletePost = useCallback(async (postId: string) => {
    try {
      await postsAPI.deletePost(postId);
      setPosts(prev => prev.filter(p => p.id !== postId));
      showToast('تم حذف المنشور بنجاح');
    } catch (error) {
      console.error('Delete post error:', error);
      showToast('تعذر حذف المنشور', 'تأكد أن المنشور يخص حسابك وأن الـ Backend متصل');
      throw error;
    }
  }, [showToast]);

  const handleGetComments = useCallback(async (postId: string): Promise<FeedComment[]> => {
    try {
      const data = await postsAPI.getComments(postId);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Get comments error:', error);
      showToast('تعذر تحميل التعليقات', 'حاول مرة أخرى');
      return [];
    }
  }, [showToast]);

  const handleAddComment = useCallback(async (
    postId: string,
    content: string,
    parentId?: string | null
  ): Promise<FeedComment> => {
    try {
      const comment = await postsAPI.addComment(postId, content, parentId);

      if (!comment || !comment.id) {
        throw new Error('The backend did not return the created comment.');
      }

      setPosts(prev => prev.map(post =>
        post.id === postId
          ? { ...post, comments: Math.max(0, Number(post.comments || 0) + 1) }
          : post
      ));

      showToast(parentId ? 'تم إضافة الرد بنجاح' : 'تم إضافة تعليقك بنجاح');
      return comment as FeedComment;
    } catch (error) {
      console.error('Add comment error:', error);
      showToast('تعذر إضافة التعليق', 'حاول مرة أخرى');
      throw error;
    }
  }, [showToast]);

  const handleDeleteComment = useCallback(async (postId: string, commentId: string) => {
    try {
      await postsAPI.deleteComment(commentId);

      // نعيد تحميل التعليقات للحصول على العدد الصحيح، خصوصاً إذا حذف التعليق أدى لحذف ردود مرتبطة به.
      const refreshedComments = await postsAPI.getComments(postId);

      setPosts(prev => prev.map(post =>
        post.id === postId
          ? { ...post, comments: Array.isArray(refreshedComments) ? refreshedComments.length : Math.max(0, Number(post.comments || 0) - 1) }
          : post
      ));

      showToast('تم حذف التعليق بنجاح');
    } catch (error) {
      console.error('Delete comment error:', error);
      showToast('تعذر حذف التعليق', 'حاول مرة أخرى');
      throw error;
    }
  }, [showToast]);

  // ── Messages ──
  const handleSendMessage = useCallback((convId: string, text: string) => {
    chatAPI.sendMessage(convId, { text, sender: 'user' });

    const now = new Date();
    const timeStr = `${now.getHours() % 12 || 12}:${now.getMinutes().toString().padStart(2, '0')} ${now.getHours() >= 12 ? 'م' : 'ص'}`;

    const newMsg = { id: `m-${Date.now()}`, sender: 'user' as const, text, time: timeStr };

    setConversations(prev => prev.map(conv => {
      if (conv.id === convId) {
        return { ...conv, lastMessage: text, lastMessageTime: 'الآن', messages: [...conv.messages, newMsg] };
      }
      return conv;
    }));

   
  }, []);

  const handleRespondOffer = useCallback((convId: string, messageId: string, accepted: boolean) => {
    chatAPI.respondOffer(convId, messageId, accepted ? 'accept' : 'decline');

    setConversations(prev => prev.map(c => {
      if (c.id === convId) {
        return {
          ...c,
          messages: c.messages.map(m => {
            if (m.id === messageId && m.offerDetails) {
              return { ...m, offerDetails: { ...m.offerDetails, accepted, declined: !accepted } };
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
  }, [showToast]);

  // ── Profile ──
  const handleAddSkill = useCallback(async (skill: Omit<SkillItem, 'id'>) => {
    const saved = await authAPI.addSkill(skill);
    const newSkill = saved ? saved : { ...skill, id: `sk-${Date.now()}` };
    setSkills(prev => [...prev, newSkill]);
    showToast(`تمت إضافة مهارة "${skill.name}" إلى ملفك الشخصي`);
  }, [showToast]);

  const handleAddExperience = useCallback(async (exp: Omit<ExperienceItem, 'id'>) => {
    const saved = await authAPI.addExperience(exp);
    const newExp = saved ? saved : { ...exp, id: `exp-${Date.now()}` };
    setExperiences(prev => [newExp, ...prev]);
    showToast(`تمت إضافة خبرة "${exp.role}" في ${exp.company}`);
  }, [showToast]);
   

  const handleUpdateProfile = useCallback(async (updates: {
    name?: string;
    headline?: string;
    bio?: string;
    phone?: string;
    location?: string;
   }) => {
  try {
    // جهز البيانات للإرسال (نفصل الاسم الأول والأخير)
    const payload: any = {
      headline: updates.headline,
      bio: updates.bio,
      phone: updates.phone,
      location: updates.location,
    };

    if (updates.name) {
      const parts = updates.name.trim().split(' ');
      payload.firstName = parts[0] || '';
      payload.lastName = parts.slice(1).join(' ') || '';
    }

    const saved = await authAPI.updateProfile(payload);

    if (saved) {
      setCurrentUser(prev => prev ? { ...prev, ...saved } : null);
      showToast('تم حفظ التعديلات بنجاح ✓');
      return true;
    } else {
      showToast('تعذر حفظ التعديلات، حاول مرة أخرى');
      return false;
    }
  } catch (e) {
    console.error('Update profile error', e);
    showToast('حدث خطأ في الاتصال');
    return false;
  }
  }, [showToast]);


  const handleUploadCV = useCallback(async (file: File) => {
    const saved = await authAPI.uploadCV(file);
    if (!saved) {
      showToast('تعذر رفع السيرة الذاتية', 'تحقق من تسجيل الدخول وحاول مجددًا');
      return;
    }
    setCvFiles(prev => [saved, ...prev]);
    showToast(`تم رفع ملف السيرة الذاتية "${file.name}" بنجاح`);
  }, [showToast]);

  const handleSetDefaultCV = useCallback((id: string) => {
    authAPI.setDefaultCV(id);
    setCvFiles(prev => prev.map(c => ({ ...c, isDefault: c.id === id })));
    showToast('تم تعيين الملف كسيرة ذاتية أساسية للتقديم');
  }, [showToast]);

  const handleDeleteCV = useCallback((id: string) => {
    authAPI.deleteCV(id);
    setCvFiles(prev => prev.filter(c => c.id !== id));
    showToast('تم حذف الملف بنجاح');
  }, [showToast]);

  // ── Notifications ──
  const handleNotificationClick = useCallback((notif: NotificationItem) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, unread: false } : n));
    if (notif.actionTab) {
      navigate(notif.actionTab);
    }
  }, [navigate]);

  const handleMarkAllNotificationsRead = useCallback(() => {
    notificationsAPI.markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    showToast('تم تعليم جميع الإشعارات كمقروءة');
  }, [showToast]);

  // ── Employer & Companies ──
 const handlePostJob = useCallback(async (newJob: Job) => {
  try {
    const savedJob = await jobsAPI.createJob(newJob);

    if (!savedJob || !savedJob.id) {
      showToast('تعذر نشر الوظيفة', 'تأكد من البيانات وحاول مرة أخرى');
      return;
    }

    // استخدم بيانات الباك إند (بالـ ID الحقيقي)
    setJobs(prev => [savedJob, ...prev]);
    setCompanies(prev => prev.map(c => {
      if (c.name.trim().toLowerCase() === savedJob.company?.trim().toLowerCase()) {
        return { ...c, openJobsCount: c.openJobsCount + 1 };
      }
      return c;
    }));
    setMyEmployerCompany(prev => ({
      ...prev,
      openJobsCount: prev.openJobsCount + 1
    }));
    showToast(
      `تم نشر وظيفة "${savedJob.title}" بنجاح!`,
      'تظهر الآن للباحثين عن عمل في استكشاف الوظائف.'
    );
  } catch (error) {
    console.error('Post job error:', error);
    showToast('تعذر نشر الوظيفة', 'تأكد من الاتصال بالـ Backend');
  }
}, [showToast]);

  const handleUpdateApplicantStatus = useCallback((applicantId: string, status: ApplicationStatus) => {
    applicationsAPI.updateApplicantStatus(applicantId, { status });
    setEmployerApplicants(prev => prev.map(app => app.id === applicantId ? { ...app, status } : app));
    showToast(`تم تحديث حالة المرشح إلى: ${status}`);
  }, [showToast]);

  const handleScheduleInterview = useCallback((applicantId: string, interviewDate: string) => {
    applicationsAPI.updateApplicantStatus(applicantId, { interviewDate, status: 'المقابلة' });
    setEmployerApplicants(prev => prev.map(app => app.id === applicantId ? { ...app, interviewDate, status: 'المقابلة' } : app));
    showToast('تم تحديد موعد المقابلة بنجاح', `الموعد: ${interviewDate}`);
  }, [showToast]);

  const handleContactCandidate = useCallback(async (applicant: JobApplicant) => {
    if (!applicant.candidateId) {
      showToast('تعذر فتح المحادثة', 'بيانات المرشح غير مكتملة');
      return;
    }
    const conversation = await profilesAPI.contact(applicant.candidateId);
    if (!conversation) {
      showToast('تعذر فتح المحادثة', 'تحقق من الاتصال ثم حاول مرة أخرى');
      return;
    }
    setConversations(prev => {
      const exists = prev.some(item => item.id === conversation.id);
      return exists ? prev.map(item => item.id === conversation.id ? conversation : item) : [conversation, ...prev];
    });
    navigate('messages');
    showToast(`تم فتح المحادثة مع المرشح ${applicant.candidateName}`);
  }, [navigate, showToast]);

 const handleUpdateCompany = useCallback(async (updatedCompany: Company): Promise<boolean> => {
  try {
    let saved: Company | null;

    if (!updatedCompany.id || updatedCompany.id === '') {
      // مفيش شركة — اعملها
      saved = await companiesAPI.createCompany(updatedCompany);
    } else {
      saved = await companiesAPI.updateCompany(updatedCompany.id, updatedCompany);
    }

    if (!saved) {
      showToast('تعذر حفظ بيانات الشركة', 'تأكد من الاتصال بالـ Backend');
      return false;
    }

    setCompanies(prev => {
      const exists = prev.find(c => c.id === saved!.id);
      if (exists) {
        return prev.map(c => c.id === saved!.id ? saved! : c);
      }
      return [saved!, ...prev];
    });
    setMyEmployerCompany(saved);
    showToast('تم حفظ بيانات الشركة بنجاح ✓');
    return true;
  } catch (error) {
    console.error('Update company error:', error);
    showToast('تعذر حفظ التعديلات', 'حاول مرة أخرى');
    return false;
  }
}, [showToast]);

  const handleDeleteJob = useCallback(async (jobId: string) => {
    const jobToDelete = jobs.find(j => j.id === jobId);
    if (!jobToDelete || !await jobsAPI.deleteJob(jobId)) {
      showToast('تعذر حذف الوظيفة', 'تحقق من الاتصال والصلاحيات ثم حاول مرة أخرى');
      return;
    }
    setJobs(prev => prev.filter(j => j.id !== jobId));
    if (jobToDelete) {
      setCompanies(prev => prev.map(c => {
        if (c.name.trim().toLowerCase() === jobToDelete.company.trim().toLowerCase()) {
          return { ...c, openJobsCount: Math.max(0, c.openJobsCount - 1) };
        }
        return c;
      }));
      setMyEmployerCompany(prev => ({ ...prev, openJobsCount: Math.max(0, prev.openJobsCount - 1) }));
    }
    showToast('تم حذف الوظيفة من المنصة');
  }, [jobs, showToast]);

  const handleToggleJobStatus = useCallback((_jobId: string) => {
    showToast('تم تغيير حالة الوظيفة');
  }, [showToast]);

  // ═══════════════════════════════════════════════════════════════
  // CONTEXT VALUE
  // ═══════════════════════════════════════════════════════════════
  const value = useMemo<AppContextType>(() => ({
    handleUpdateProfile,
    currentTab, navigate,
    currentUser, setCurrentUser, userRole, setUserRole,
    handleLoginSuccess, handleLogout, handleToggleRole,
    jobs, setJobs, handleToggleSaveJob, handleApplySuccess,
    applications,
    posts, handleAddPost, handleLikePost, handleDeletePost,
    handleGetComments, handleAddComment, handleDeleteComment,
    conversations, handleSendMessage, handleRespondOffer,
    notifications, handleNotificationClick, handleMarkAllNotificationsRead,
    skills, handleAddSkill,
    experiences, handleAddExperience,
    educations,
    cvFiles, handleUploadCV, handleSetDefaultCV, handleDeleteCV,
    companies, employerApplicants, myEmployerCompany,
    handlePostJob, handleUpdateApplicantStatus, handleScheduleInterview,
    handleContactCandidate, handleUpdateCompany, handleDeleteJob, handleToggleJobStatus,
    selectedJobForDetail, setSelectedJobForDetail,
    selectedJobForApply, setSelectedJobForApply,
    isPostJobModalOpen, setIsPostJobModalOpen,
    toastMessage, setToastMessage, showToast,
  }), [
    currentTab, navigate,
    currentUser, userRole,
    handleLoginSuccess, handleLogout, handleToggleRole,
    jobs, handleToggleSaveJob, handleApplySuccess,
    applications,
    posts, handleAddPost, handleLikePost, handleDeletePost,
    handleGetComments, handleAddComment, handleDeleteComment,
    conversations, handleSendMessage, handleRespondOffer,
    notifications, handleNotificationClick, handleMarkAllNotificationsRead,
    skills, handleAddSkill,
    experiences, handleAddExperience,
    educations,
    cvFiles, handleUploadCV, handleSetDefaultCV, handleDeleteCV,
    companies, employerApplicants, myEmployerCompany,
    handlePostJob, handleUpdateApplicantStatus, handleScheduleInterview,
    handleContactCandidate, handleUpdateCompany, handleDeleteJob, handleToggleJobStatus,
    selectedJobForDetail, selectedJobForApply,
    isPostJobModalOpen,
    toastMessage, showToast,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

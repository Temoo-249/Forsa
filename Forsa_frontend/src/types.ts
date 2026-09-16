export type TabType = 'landing' | 'feed' | 'jobs' | 'companies' | 'applications' | 'messages' | 'profile' | 'employer-hub' | 'auth';

export type UserRole = 'seeker' | 'employer';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  headline: string;
  avatar: string;
  companyName?: string;
  isLoggedIn: boolean;
}

export interface Company {
  id: string;
  name: string;
  tagline: string;
  logo: string;
  coverGradient: string;
  industry: string;
  location: string;
  employeesCount: string;
  foundedYear: string;
  website: string;
  description: string;
  benefits: string[];
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  openJobsCount: number;
}

export interface JobApplicant {
  id: string;
  jobId: string;
  jobTitle: string;
  candidateName: string;
  candidateHeadline: string;
  candidateAvatar: string;
  candidateEmail: string;
  candidatePhone: string;
  experienceYears: number;
  education: string;
  appliedDate: string;
  status: ApplicationStatus;
  matchScore: number; // percentage match e.g. 94%
  resumeFileName: string;
  coverNote?: string;
  skills: string[];
  interviewDate?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  logo: string;
  type: 'دوام كامل' | 'دوام جزئي' | 'عن بُعد' | 'عمل حر' | 'تدريب';
  domain: string;
  salary: string;
  postedTime: string;
  applicantsCount: number;
  skills: string[];
  description: string;
  requirements: string[];
  isVerified?: boolean;
  isSaved?: boolean;
  applied?: boolean;
}

export type ApplicationStatus = 'التقدم' | 'المراجعة' | 'الاختصار' | 'المقابلة' | 'العرض' | 'التوظيف' | 'مرفوض';

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  logo: string;
  applyDate: string;
  status: ApplicationStatus;
  currentStepIndex: number; // 0 to 5
  interviewDate?: string;
  interviewNote?: string;
  resumeFileName: string;
  timeline: {
    title: string;
    date: string;
    completed: boolean;
    active?: boolean;
    note?: string;
  }[];
}

export interface Post {
  id: string;
  authorName: string;
  authorHeadline: string;
  authorAvatar: string;
  avatarColor: string;
  timeAgo: string;
  content: string;
  skills: string[];
  likes: number;
  comments: number;
  isLiked?: boolean;
  category?: 'عام' | 'عرض مهارات' | 'إنجاز' | 'سؤال';
}

export interface Message {
  id: string;
  sender: 'user' | 'company';
  text?: string;
  time: string;
  isOffer?: boolean;
  offerDetails?: {
    jobTitle: string;
    salary: string;
    startDate: string;
    accepted?: boolean;
    declined?: boolean;
  };
}

export interface Conversation {
  id: string;
  companyName: string;
  companyLogo: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  jobTitle: string;
  messages: Message[];
  sharedFiles: { name: string; date: string; size: string }[];
}

export interface NotificationItem {
  id: string;
  icon: string;
  title: string;
  time: string;
  unread: boolean;
  actionTab?: TabType;
}

export interface SkillItem {
  id: string;
  name: string;
  level: 'مبتدئ' | 'متوسط' | 'متقدم' | 'خبير';
  percentage: number;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  description: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  description: string;
}

export interface CVFile {
  id: string;
  name: string;
  uploadDate: string;
  size: string;
  isDefault: boolean;
}

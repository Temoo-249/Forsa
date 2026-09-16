'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Briefcase, 
  Users, 
  PlusCircle, 
  Search, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Mail, 
  Eye, 
  Edit3, 
  Trash2, 
  Filter, 
  Sparkles, 
  ArrowUpRight, 
  Award, 
  Star, 
  ShieldCheck, 
  Send, 
  ExternalLink,
  ChevronDown,
  UserCheck,
  Phone,
  FileText,
  LogOut
} from 'lucide-react';
import { Job, Company, JobApplicant, ApplicationStatus } from '../types';
import { PostJobModal } from './PostJobModal';
import { ApplicantDetailModal } from './ApplicantDetailModal';
import { CompanyDetailModal } from './CompanyDetailModal';

interface EmployerDashboardProps {
  company: Company;
  jobs: Job[];
  applicants: JobApplicant[];
  onPostJob: (newJob: Job) => void;
  onUpdateApplicantStatus: (applicantId: string, status: ApplicationStatus) => void;
  onScheduleInterview: (applicantId: string, interviewDate: string) => void;
  onContactCandidate: (applicant: JobApplicant) => void;
  onUpdateCompany: (updatedCompany: Company) => void;
  onDeleteJob: (jobId: string) => void;
  onToggleJobStatus: (jobId: string) => void;
  onSwitchToSeeker: () => void;
  onSelectJobForDetail: (job: Job) => void;
  onSelectJobForApply: (job: Job) => void;
  onLogout?: () => void;
}

export const EmployerDashboard: React.FC<EmployerDashboardProps> = ({
  company,
  jobs,
  applicants,
  onPostJob,
  onUpdateApplicantStatus,
  onScheduleInterview,
  onContactCandidate,
  onUpdateCompany,
  onDeleteJob,
  onToggleJobStatus,
  onSwitchToSeeker,
  onSelectJobForDetail,
  onSelectJobForApply,
  onLogout
}) => {
  // Tabs within employer hub
  const [activeSubTab, setActiveSubTab] = useState<'jobs' | 'applicants' | 'profile'>('applicants');

  // Modals state
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<JobApplicant | null>(null);
  const [isPreviewCompanyOpen, setIsPreviewCompanyOpen] = useState(false);

  // Filters for applicants
  const [selectedJobFilter, setSelectedJobFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [applicantSearch, setApplicantSearch] = useState('');

  // Editable company state
  const [editedCompany, setEditedCompany] = useState<Company>(company);
  const [isSavedProfileSuccess, setIsSavedProfileSuccess] = useState(false);

  // Filter company's jobs
  const myCompanyJobs = jobs.filter(
    j => j.company.trim().toLowerCase() === company.name.trim().toLowerCase()
  );

  // Filter applicants
  const filteredApplicants = applicants.filter(app => {
    const matchJob = selectedJobFilter === 'all' || app.jobId === selectedJobFilter;
    const matchStatus = selectedStatusFilter === 'all' || app.status === selectedStatusFilter;
    const matchSearch = 
      app.candidateName.toLowerCase().includes(applicantSearch.toLowerCase()) ||
      app.candidateHeadline.toLowerCase().includes(applicantSearch.toLowerCase()) ||
      app.skills.some(s => s.toLowerCase().includes(applicantSearch.toLowerCase()));

    return matchJob && matchStatus && matchSearch;
  });

  // Calculate stats
  const totalApplicantsCount = applicants.length;
  const inInterviewCount = applicants.filter(a => a.status === 'المقابلة' || a.status === 'الاختصار').length;
  const hiredOrOfferedCount = applicants.filter(a => a.status === 'العرض' || a.status === 'التوظيف').length;

  const handleSaveCompanyProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCompany(editedCompany);
    setIsSavedProfileSuccess(true);
    setTimeout(() => setIsSavedProfileSuccess(false), 3500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200" dir="rtl">
      
      {/* Employer Hub Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 sm:p-8 shadow-xl border border-indigo-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md p-2 flex items-center justify-center text-4xl sm:text-5xl shadow-lg border border-white/20">
              {company.logo}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-xs font-bold border border-blue-400/30">
                  لوحة تحكم الشركات وأصحاب العمل
                </span>
                {company.isVerified && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    حساب موثق
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
                {company.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5 max-w-xl">
                {company.tagline}
              </p>
            </div>
          </div>

          {/* Quick Hub Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsPostJobModalOpen(true)}
              className="px-4 sm:px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>نشر وظيفة جديدة</span>
            </button>

            <button
              onClick={() => setIsPreviewCompanyOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/15 transition-colors flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4" />
              <span>معاينة صفحة الشركة</span>
            </button>

            <button
              onClick={onSwitchToSeeker}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-semibold text-xs sm:text-sm border border-white/15 transition-colors flex items-center gap-1.5"
              title="العودة لتصفح المنصة كباحث عن عمل"
            >
              <UserCheck className="w-4 h-4 text-blue-400" />
              <span>وضع الباحث</span>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="px-3.5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-semibold text-xs sm:text-sm border border-rose-400/30 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="تسجيل الخروج من الحساب"
              >
                <LogOut className="w-4 h-4 text-rose-300" />
                <span>تسجيل الخروج</span>
              </button>
            )}
          </div>

        </div>

        {/* Dynamic Metric Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-white/10">
          <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10">
            <div className="text-2xl sm:text-3xl font-black text-white">{myCompanyJobs.length}</div>
            <div className="text-xs text-blue-200 font-semibold mt-1 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              <span>شواغر معلنة</span>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10">
            <div className="text-2xl sm:text-3xl font-black text-white">{totalApplicantsCount}</div>
            <div className="text-xs text-blue-200 font-semibold mt-1 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>إجمالي المتقدمين</span>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">{inInterviewCount}</div>
            <div className="text-xs text-blue-200 font-semibold mt-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>مقابلات واختصار</span>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10">
            <div className="text-2xl sm:text-3xl font-black text-amber-400">{hiredOrOfferedCount}</div>
            <div className="text-xs text-blue-200 font-semibold mt-1 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>عروض وتوظيف</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('applicants')}
          className={`relative px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'applicants'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>المتقدمين وفرز السير الذاتية (ATS)</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
            activeSubTab === 'applicants' ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {applicants.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('jobs')}
          className={`relative px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'jobs'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>الوظائف المنشورة للشركة</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
            activeSubTab === 'jobs' ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {myCompanyJobs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('profile')}
          className={`relative px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'profile'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>ملف الشركة وبيئة العمل</span>
        </button>
      </div>

      {/* TAB 1: APPLICANTS ATS PIPELINE */}
      {activeSubTab === 'applicants' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center gap-3">
            {/* Search candidate */}
            <div className="relative flex-1 w-full">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={applicantSearch}
                onChange={(e) => setApplicantSearch(e.target.value)}
                placeholder="ابحث بالاسم، المسمى المهني، أو المهارات..."
                className="w-full pr-10 pl-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Filter by Job */}
            <div className="w-full md:w-56">
              <select
                value={selectedJobFilter}
                onChange={(e) => setSelectedJobFilter(e.target.value)}
                className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="all">جميع الوظائف المعروضة</option>
                {myCompanyJobs.map(j => (
                  <option key={j.id} value={j.id}>{j.title}</option>
                ))}
              </select>
            </div>

            {/* Filter by Stage */}
            <div className="w-full md:w-44">
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="all">جميع المراحل</option>
                <option value="التقدم">التقدم</option>
                <option value="المراجعة">المراجعة</option>
                <option value="الاختصار">الاختصار</option>
                <option value="المقابلة">المقابلة</option>
                <option value="العرض">العرض</option>
                <option value="التوظيف">التوظيف</option>
                <option value="مرفوض">مرفوض</option>
              </select>
            </div>
          </div>

          {/* Applicants List */}
          {filteredApplicants.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">لا يوجد متقدمين مطابقين للبحث</h3>
              <p className="text-xs text-slate-500 mt-1">جرّب تغيير فلتر الوظيفة أو المرحلة لاستعراض باقي المتقدمين.</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredApplicants.map(applicant => (
                <div
                  key={applicant.id}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 shadow-xs hover:shadow-md transition-all p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  {/* Candidate Left (Avatar & Info) */}
                  <div className="flex items-start gap-3.5">
                    <img
                      src={applicant.candidateAvatar}
                      alt={applicant.candidateName}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
                    />

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-black text-sm sm:text-base text-slate-900">
                          {applicant.candidateName}
                        </h3>
                        
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                          {applicant.matchScore}% تطابق
                        </span>

                        <span className="text-xs text-slate-400 font-medium">
                          • {applicant.appliedDate}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 font-medium mt-0.5">
                        {applicant.candidateHeadline}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-2 font-medium flex-wrap">
                        <span className="flex items-center gap-1 text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-md">
                          <Briefcase className="w-3 h-3" />
                          <span>{applicant.jobTitle}</span>
                        </span>
                        <span>{applicant.experienceYears} سنوات خبرة</span>
                        <span>•</span>
                        <span className="truncate max-w-[200px]">{applicant.education}</span>
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {applicant.skills.slice(0, 4).map(sk => (
                          <span
                            key={sk}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Candidate Right (Status Changer & Actions) */}
                  <div className="flex flex-wrap items-center gap-2.5 lg:self-center shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    
                    {/* Status dropdown */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-500">المرحلة:</span>
                      <select
                        value={applicant.status}
                        onChange={(e) => onUpdateApplicantStatus(applicant.id, e.target.value as any)}
                        className={`py-1.5 px-3 rounded-xl text-xs font-bold border focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors ${
                          applicant.status === 'التوظيف' 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : applicant.status === 'المقابلة'
                              ? 'bg-blue-50 text-blue-800 border-blue-300'
                              : applicant.status === 'مرفوض'
                                ? 'bg-rose-50 text-rose-800 border-rose-300'
                                : 'bg-slate-50 text-slate-800 border-slate-300'
                        }`}
                      >
                        <option value="التقدم">التقدم</option>
                        <option value="المراجعة">المراجعة والفرز</option>
                        <option value="الاختصار">الاختصار (Shortlist)</option>
                        <option value="المقابلة">المقابلة</option>
                        <option value="العرض">تقديم عرض عمل</option>
                        <option value="التوظيف">تم التوظيف بنجاح</option>
                        <option value="مرفوض">اعتذار / مرفوض</option>
                      </select>
                    </div>

                    {/* View Details */}
                    <button
                      onClick={() => setSelectedApplicant(applicant)}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
                    >
                      عرض الملف والسيرة
                    </button>

                    {/* Contact Button */}
                    <button
                      onClick={() => onContactCandidate(applicant)}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-xs"
                      title="مراسلة المرشح في الشات"
                    >
                      <Send className="w-3 h-3" />
                      <span>مراسلة</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: POSTED JOBS MANAGEMENT */}
      {activeSubTab === 'jobs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span>الوظائف النشطة لـ {company.name}</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                {myCompanyJobs.length}
              </span>
            </h2>

            <button
              onClick={() => setIsPostJobModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>نشر وظيفة جديدة</span>
            </button>
          </div>

          {myCompanyJobs.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">لم تقم بنشر أي وظائف بعد</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-4">
                ابدأ الآن بنشر أول فرصة وظيفية لاستقطاب الكفاءات والبدء باستقبال طلبات التوظيف.
              </p>
              <button
                onClick={() => setIsPostJobModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-700 transition-colors"
              >
                + نشر وظيفة الآن
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myCompanyJobs.map(job => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl border border-slate-200/80 hover:border-blue-300 p-5 shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-extrabold text-base text-slate-900">
                            {job.title}
                          </h3>
                          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold">
                            {job.type}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 block mt-1">
                          {job.salary}
                        </span>
                      </div>

                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold shrink-0">
                        نشطة لاستقبال الطلبات
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-3 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
                      <span>{job.location}</span>
                      <span>•</span>
                      <span className="font-bold text-blue-600 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{job.applicantsCount} متقدم للوظيفة</span>
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setSelectedJobFilter(job.id);
                        setActiveSubTab('applicants');
                      }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>عرض المتقدمين ({job.applicantsCount})</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectJobForDetail(job)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="معاينة تفاصيل الوظيفة"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteJob(job.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="إلغاء أو أرشفة الوظيفة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: COMPANY PROFILE SETTINGS */}
      {activeSubTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs max-w-3xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <span>إعدادات وتعديل بيانات ملف الشركة</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                تظهر هذه البيانات للباحثين عن عمل في صفحة دليل الشركات وصفحات الوظائف المنشورة.
              </p>
            </div>

            <button
              onClick={() => setIsPreviewCompanyOpen(true)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>معاينة عامة</span>
            </button>
          </div>

          {isSavedProfileSuccess && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>تم حفظ وتحديث ملف الشركة بنجاح ويظهر الآن للباحثين عن عمل!</span>
            </div>
          )}

          <form onSubmit={handleSaveCompanyProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم الشركة</label>
                <input
                  type="text"
                  value={editedCompany.name}
                  onChange={(e) => setEditedCompany({ ...editedCompany, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">المجال / القطاع</label>
                <input
                  type="text"
                  value={editedCompany.industry}
                  onChange={(e) => setEditedCompany({ ...editedCompany, industry: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">الشعار التسويقي (Tagline)</label>
              <input
                type="text"
                value={editedCompany.tagline}
                onChange={(e) => setEditedCompany({ ...editedCompany, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">الموقع الجغرافي</label>
                <input
                  type="text"
                  value={editedCompany.location}
                  onChange={(e) => setEditedCompany({ ...editedCompany, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">حجم الفريق</label>
                <input
                  type="text"
                  value={editedCompany.employeesCount}
                  onChange={(e) => setEditedCompany({ ...editedCompany, employeesCount: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">رابط الموقع الإلكتروني</label>
                <input
                  type="text"
                  value={editedCompany.website}
                  onChange={(e) => setEditedCompany({ ...editedCompany, website: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">نبذة عن الشركة وبيئة العمل</label>
              <textarea
                rows={4}
                value={editedCompany.description}
                onChange={(e) => setEditedCompany({ ...editedCompany, description: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-normal focus:ring-2 focus:ring-blue-600 focus:outline-none leading-relaxed"
              />
            </div>

            <div className="pt-4 flex items-center justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all"
              >
                حفظ التغييرات
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modals */}
      <PostJobModal
        isOpen={isPostJobModalOpen}
        onClose={() => setIsPostJobModalOpen(false)}
        employerCompany={company}
        onPostJob={onPostJob}
      />

      <ApplicantDetailModal
        applicant={selectedApplicant}
        isOpen={!!selectedApplicant}
        onClose={() => setSelectedApplicant(null)}
        onUpdateStatus={onUpdateApplicantStatus}
        onScheduleInterview={onScheduleInterview}
        onContactCandidate={onContactCandidate}
      />

      <CompanyDetailModal
        company={company}
        isOpen={isPreviewCompanyOpen}
        onClose={() => setIsPreviewCompanyOpen(false)}
        jobs={jobs}
        onSelectJobForDetail={onSelectJobForDetail}
        onSelectJobForApply={onSelectJobForApply}
      />

    </div>
  );
};

'use client';

import React from 'react';
import { 
  Building2, 
  MapPin, 
  Users, 
  Calendar, 
  Globe, 
  Star, 
  CheckCircle2, 
  X, 
  Briefcase, 
  ChevronLeft,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Award
} from 'lucide-react';
import { Company, Job } from '../types';

interface CompanyDetailModalProps {
  company: Company | null;
  isOpen: boolean;
  onClose: () => void;
  jobs: Job[];
  onSelectJobForDetail: (job: Job) => void;
  onSelectJobForApply: (job: Job) => void;
}

export const CompanyDetailModal: React.FC<CompanyDetailModalProps> = ({
  company,
  isOpen,
  onClose,
  jobs,
  onSelectJobForDetail,
  onSelectJobForApply
}) => {
  if (!isOpen || !company) return null;

  // Find all open vacancies matching this company
  const companyJobs = jobs.filter(
    j => j.company.trim().toLowerCase() === company.name.trim().toLowerCase()
  );

  return (
    <div 
      id="company-detail-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id={`company-modal-${company.id}`}
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in zoom-in-95 duration-200"
        dir="rtl"
      >
        {/* Cover Banner */}
        <div className={`h-36 sm:h-44 bg-gradient-to-r ${company.coverGradient} relative p-6 flex items-end justify-between`}>
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
            title="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute -bottom-10 right-6 flex items-end gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-2 shadow-lg border-2 border-white flex items-center justify-center text-4xl sm:text-5xl">
              {company.logo}
            </div>
          </div>
        </div>

        {/* Header Info */}
        <div className="pt-12 px-6 sm:px-8 pb-6 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-slate-900">{company.name}</h2>
                {company.isVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                    <CheckCircle2 className="w-3.5 h-3.5 fill-blue-600 text-white" />
                    جهة موثقة
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-slate-600 mt-1">{company.tagline}</p>
            </div>

            {/* Rating badge */}
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 px-3.5 py-1.5 rounded-2xl self-start">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-extrabold text-sm text-slate-800">{company.rating}</span>
              <span className="text-xs text-slate-400">({company.reviewsCount} تقييم)</span>
            </div>
          </div>

          {/* Metadata chips */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-4 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-slate-400" />
              {company.industry}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              {company.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-slate-400" />
              {company.employeesCount}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              تأسست عام {company.foundedYear}
            </span>
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-bold hover:underline"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>زيارة الموقع الإلكتروني</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[55vh] overflow-y-auto">
          {/* About */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2.5 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              نبذة عن الشركة وبيئة العمل
            </h3>
            <p className="text-sm leading-relaxed text-slate-600">
              {company.description}
            </p>
          </div>

          {/* Benefits */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              مزايا العمل والحوافز المقدمة
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {company.benefits.map((benefit, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-semibold text-slate-700"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Open Roles */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                الوظائف المتاحة حالياً لدى الشركة
              </h3>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                {companyJobs.length} وظائف شاغرة
              </span>
            </div>

            {companyJobs.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-600">لا توجد وظائف معلنة حالياً لهذه الشركة</p>
                <span className="text-xs text-slate-400 mt-1 block">يمكنك حفظ الشركة لتلقي إشعار فور نشر أي شواغر جديدة.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {companyJobs.map(job => (
                  <div
                    key={job.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-slate-900 hover:text-blue-600 transition-colors">
                          {job.title}
                        </h4>
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-bold">
                          {job.type}
                        </span>
                        <span className="text-xs font-bold text-emerald-600">
                          {job.salary}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5">
                        <span>{job.location}</span>
                        <span>•</span>
                        <span>نُشرت {job.postedTime}</span>
                        <span>•</span>
                        <span>{job.applicantsCount} متقدم</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          onClose();
                          onSelectJobForDetail(job);
                        }}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
                      >
                        التفاصيل
                      </button>
                      <button
                        onClick={() => {
                          onClose();
                          onSelectJobForApply(job);
                        }}
                        disabled={job.applied}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                          job.applied 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {job.applied ? 'تم التقديم' : 'تقديم سريع'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            تتم مراجعة بيانات الشركات واعتمادها رسمياً من قِبل فريق منصة فرصة
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs font-bold text-slate-800 transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

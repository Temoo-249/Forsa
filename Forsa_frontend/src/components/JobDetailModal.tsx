'use client';

import React from 'react';
import { Job } from '../types';
import { 
  X, 
  Building2, 
  MapPin, 
  DollarSign, 
  Clock, 
  Users, 
  CheckCircle2, 
  Bookmark, 
  Share2, 
  Send,
  ShieldCheck,
  Briefcase
} from 'lucide-react';

interface JobDetailModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onApplyClick: (job: Job) => void;
  onToggleSave: (jobId: string) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  isOpen,
  onClose,
  onApplyClick,
  onToggleSave
}) => {
  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-slate-900 animate-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-50 via-white to-indigo-50/40 border-b border-slate-100 flex items-start justify-between relative">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-3xl shrink-0">
              {job.logo}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  {job.domain}
                </span>
                {job.isVerified && (
                  <span className="text-xs text-blue-600 flex items-center gap-1 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    شركة موثقة
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {job.title}
              </h2>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs sm:text-sm text-slate-500 mt-1.5 font-medium">
                <span className="font-bold text-slate-800">{job.company}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {job.location}
                </span>
                <span>•</span>
                <span className="text-slate-400">{job.postedTime}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 divide-y divide-slate-100">
          
          {/* Key Metrics Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[11px] text-slate-400 block font-medium">نوع العقد</span>
              <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                {job.type}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[11px] text-slate-400 block font-medium">الراتب المتوقع</span>
              <span className="text-xs sm:text-sm font-bold text-emerald-700 flex items-center gap-1.5 mt-0.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                {job.salary}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[11px] text-slate-400 block font-medium">المتقدمون</span>
              <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                {job.applicantsCount} متقدم
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[11px] text-slate-400 block font-medium">نمط العمل</span>
              <span className="text-xs sm:text-sm font-bold text-blue-700 flex items-center gap-1.5 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                مرن وعصري
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="pt-6 space-y-3">
            <h4 className="text-sm font-bold text-slate-900">الوصف الوظيفي</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Requirements */}
          <div className="pt-6 space-y-3">
            <h4 className="text-sm font-bold text-slate-900">المتطلبات والمؤهلات</h4>
            <ul className="space-y-2">
              {job.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Skills Required */}
          <div className="pt-6 space-y-3">
            <h4 className="text-sm font-bold text-slate-900">المهارات التقنية المطلوبة</h4>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => onToggleSave(job.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
              job.isSaved
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${job.isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span>{job.isSaved ? 'تم الحفظ' : 'حفظ الوظيفة'}</span>
          </button>

          <div className="flex items-center gap-2">
            {job.applied ? (
              <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs sm:text-sm border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" />
                تم التقديم بالفعل
              </span>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onApplyClick(job);
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all hover:scale-[1.01]"
              >
                <Send className="w-4 h-4" />
                <span>التقدم لهذه الوظيفة الآن</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

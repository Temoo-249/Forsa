'use client';

import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  GraduationCap, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ChevronRight,
  Send,
  Download,
  AlertCircle
} from 'lucide-react';
import { JobApplicant, ApplicationStatus } from '../types';

interface ApplicantDetailModalProps {
  applicant: JobApplicant | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (applicantId: string, newStatus: ApplicationStatus) => void;
  onScheduleInterview: (applicantId: string, interviewDate: string) => void;
  onContactCandidate: (applicant: JobApplicant) => void;
}

export const ApplicantDetailModal: React.FC<ApplicantDetailModalProps> = ({
  applicant,
  isOpen,
  onClose,
  onUpdateStatus,
  onScheduleInterview,
  onContactCandidate
}) => {
  const [interviewInput, setInterviewInput] = useState('');
  const [showInterviewForm, setShowInterviewForm] = useState(false);

  if (!isOpen || !applicant) return null;

  const statuses: ApplicationStatus[] = [
    'التقدم',
    'المراجعة',
    'الاختصار',
    'المقابلة',
    'العرض',
    'التوظيف',
    'مرفوض'
  ];

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewInput.trim()) return;
    onScheduleInterview(applicant.id, interviewInput.trim());
    setShowInterviewForm(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in zoom-in-95 duration-200"
        dir="rtl"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 left-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-4">
            <img 
              src={applicant.candidateAvatar} 
              alt={applicant.candidateName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-md"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-black text-white">{applicant.candidateName}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 border border-blue-400/40 text-blue-200 text-xs font-bold">
                  {applicant.matchScore}% تطابق مع متطلبات الوظيفة
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
                {applicant.candidateHeadline}
              </p>
              <div className="flex items-center gap-2 text-xs text-blue-300 mt-2 font-bold">
                <Briefcase className="w-3.5 h-3.5" />
                <span>متقدم لوظيفة: {applicant.jobTitle}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Status Pipeline Selection Bar */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              تحديث مرحلة المرشح في نظام الفرز (ATS):
            </label>
            <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl">
              {statuses.map(st => {
                const isActive = applicant.status === st;
                const isRejected = st === 'مرفوض';
                return (
                  <button
                    key={st}
                    onClick={() => onUpdateStatus(applicant.id, st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? isRejected
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-blue-600 text-white shadow-xs'
                        : isRejected
                          ? 'text-rose-600 hover:bg-rose-50'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contact & Meta info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 text-xs font-medium text-slate-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="font-mono">{applicant.candidateEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="font-mono" dir="ltr">{applicant.candidatePhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>تاريخ التقديم: {applicant.appliedDate}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 text-xs font-medium text-slate-600">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-400" />
                <span className="font-bold text-slate-800">{applicant.experienceYears} سنوات خبرة عملية</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                <span className="truncate">{applicant.education}</span>
              </div>
              {applicant.interviewDate && (
                <div className="flex items-center gap-1.5 text-blue-700 font-bold bg-blue-50 px-2 py-1 rounded-lg">
                  <Clock className="w-3.5 h-3.5" />
                  <span>موعد المقابلة: {applicant.interviewDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* Cover note */}
          {applicant.coverNote && (
            <div>
              <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                رسالة التقديم والملاحظات (Cover Note)
              </h4>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                "{applicant.coverNote}"
              </div>
            </div>
          )}

          {/* Skills */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 mb-2">المهارات والتقنيات الأساسية:</h4>
            <div className="flex flex-wrap gap-1.5">
              {applicant.skills.map(sk => (
                <span
                  key={sk}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>

          {/* Resume file preview block */}
          <div className="p-4 rounded-2xl border border-blue-100 bg-blue-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                PDF
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block truncate max-w-xs sm:max-w-sm">
                  {applicant.resumeFileName}
                </span>
                <span className="text-[11px] text-slate-400">تم الرفع والتحقق تلقائياً</span>
              </div>
            </div>

            <button
              onClick={() => alert(`جاري تنزيل السيرة الذاتية: ${applicant.resumeFileName}`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-blue-700 text-xs font-bold border border-slate-200 shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تحميل السيرة الذاتية</span>
            </button>
          </div>

          {/* Schedule Interview section */}
          <div>
            {!showInterviewForm ? (
              <button
                onClick={() => setShowInterviewForm(true)}
                className="w-full py-2.5 rounded-xl border border-dashed border-blue-300 text-blue-700 hover:bg-blue-50 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>{applicant.interviewDate ? 'تعديل موعد المقابلة' : 'تحديد وجدولة موعد مقابلة للمرشح'}</span>
              </button>
            ) : (
              <form onSubmit={handleSchedule} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">تحديد موعد المقابلة:</span>
                  <button
                    type="button"
                    onClick={() => setShowInterviewForm(false)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    إلغاء
                  </button>
                </div>
                <input
                  type="text"
                  value={interviewInput}
                  onChange={(e) => setInterviewInput(e.target.value)}
                  placeholder="مثال: الأربعاء القادم 03:00 م عبر Google Meet"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                >
                  حفظ الموعد وإرسال إشعار للمرشح
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
          >
            إغلاق
          </button>

          <button
            onClick={() => {
              onClose();
              onContactCandidate(applicant);
            }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>مراسلة المرشح في الشات</span>
          </button>
        </div>
      </div>
    </div>
  );
};

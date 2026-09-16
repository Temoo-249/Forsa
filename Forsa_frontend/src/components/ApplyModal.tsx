'use client';

import React, { useState } from 'react';
import { Job, CVFile } from '../types';
import { X, CheckCircle2, FileText, Send, Sparkles, Building2, MapPin, DollarSign } from 'lucide-react';

interface ApplyModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onApplySuccess: (jobId: string, coverNote: string, cvName: string) => void;
  cvFiles: CVFile[];
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  job,
  isOpen,
  onClose,
  onApplySuccess,
  cvFiles
}) => {
  if (!isOpen || !job) return null;

  const [selectedCV, setSelectedCV] = useState<string>(
    cvFiles.find(c => c.isDefault)?.name || cvFiles[0]?.name || 'ahmed_cv_2026.pdf'
  );
  const [coverNote, setCoverNote] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+966 50 123 4567');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onApplySuccess(job.id, coverNote, selectedCV);
      setSubmitted(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden text-slate-900 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50/50 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-2xl">
              {job.logo}
            </div>
            <div>
              <span className="text-xs font-bold text-blue-600 tracking-wide uppercase">تقديم طلب وظيفي</span>
              <h3 className="text-lg font-bold text-slate-900 leading-snug">{job.title}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span className="font-semibold text-slate-700">{job.company}</span>
                <span>•</span>
                <span>{job.location}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Compensation Highlight */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
            <span className="text-slate-600 font-medium">الراتب المتوقع / النطاق:</span>
            <span className="font-bold text-blue-700 bg-blue-100/70 px-2.5 py-0.5 rounded-md">
              {job.salary}
            </span>
          </div>

          {/* CV Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              اختر ملف السيرة الذاتية (CV) *
            </label>
            <div className="space-y-2">
              {cvFiles.map((cv) => (
                <label
                  key={cv.id}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedCV === cv.name
                      ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="selectedCV"
                      value={cv.name}
                      checked={selectedCV === cv.name}
                      onChange={() => setSelectedCV(cv.name)}
                      className="accent-blue-600 w-4 h-4"
                    />
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-bold text-slate-800">{cv.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {cv.isDefault && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                        الأساسي
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400">{cv.size}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Contact Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              رقم الهاتف للتواصل المباشر
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white font-mono text-left"
              dir="ltr"
              required
            />
          </div>

          {/* Cover Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>رسالة مختصرة لمدير التوظيف (اختياري)</span>
              <span className="text-[11px] text-slate-400 font-normal">أبرز ما يجعلك المرشح الأنسب</span>
            </label>
            <textarea
              rows={3}
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              placeholder="يسعدني التقدم لهذه الوظيفة. لدي خبرة واسعة في التقنيات المطلوبة وأتطلع لإضافة قيمة ملموسة لفريق العمل..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={submitted}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-[1.01]"
            >
              {submitted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 animate-spin" />
                  <span>جاري إرسال الطلب...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>تأكيد وإرسال الطلب</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

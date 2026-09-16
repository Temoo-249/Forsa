'use client';

import React, { useState } from 'react';
import { Application, TabType } from '../types';
import { 
  FileText, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronLeft, 
  Download, 
  MessageSquare, 
  X,
  ExternalLink,
  ShieldAlert,
  Building2,
  Video
} from 'lucide-react';

interface ApplicationsViewProps {
  applications: Application[];
  onNavigateToChat: (companyName: string) => void;
  onExploreJobs: () => void;
}

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({
  applications,
  onNavigateToChat,
  onExploreJobs,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedAppModal, setSelectedAppModal] = useState<Application | null>(null);

  const stats = {
    total: applications.length,
    active: applications.filter(a => a.status !== 'مرفوض' && a.status !== 'التوظيف').length,
    interview: applications.filter(a => a.status === 'المقابلة').length,
    rejected: applications.filter(a => a.status === 'مرفوض').length,
  };

  const filteredApps = applications.filter(app => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return app.status !== 'مرفوض';
    if (filterStatus === 'interview') return app.status === 'المقابلة';
    if (filterStatus === 'shortlisted') return app.status === 'الاختصار';
    if (filterStatus === 'rejected') return app.status === 'مرفوض';
    return true;
  });

  const stepsLabels = ['التقدم', 'المراجعة', 'الاختصار', 'المقابلة', 'العرض', 'التوظيف'];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'المقابلة':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'الاختصار':
        return 'bg-sky-100 text-sky-700 border-sky-200';
      case 'العرض':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'مرفوض':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Stats Summary Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100 mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>نظام تتبع طلبات التوظيف (ATS Tracker)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            طلباتي الوظيفية
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            تتبع مراحل ومواعيد المقابلات وحالة طلباتك مع الشركات مباشرة وبشكل فوري.
          </p>
        </div>

        {/* Quick Stat Chips */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">إجمالي الطلبات:</span>
            <span className="text-sm font-black text-slate-900">{stats.total}</span>
          </div>

          <div className="px-4 py-2.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center gap-2">
            <span className="text-xs text-blue-700 font-semibold">طلبات نشطة:</span>
            <span className="text-sm font-black text-blue-700">{stats.active}</span>
          </div>

          <div className="px-4 py-2.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center gap-2">
            <span className="text-xs text-indigo-700 font-semibold">مرحلة المقابلة:</span>
            <span className="text-sm font-black text-indigo-700">{stats.interview}</span>
          </div>

          <div className="px-4 py-2.5 rounded-2xl bg-rose-50/70 border border-rose-100 flex items-center gap-2">
            <span className="text-xs text-rose-700 font-semibold">مرفوض:</span>
            <span className="text-sm font-black text-rose-700">{stats.rejected}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {[
          { id: 'all', label: 'جميع الطلبات', count: stats.total },
          { id: 'active', label: 'الطلبات النشطة', count: stats.active },
          { id: 'interview', label: 'المقابلات المجدولة', count: stats.interview },
          { id: 'shortlisted', label: 'تم الاختصار' },
          { id: 'rejected', label: 'طلبات مكتملة / مرفوضة', count: stats.rejected },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              filterStatus === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`px-1.5 py-0.2 text-[10px] rounded-full ${
                filterStatus === tab.id ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Applications Cards List */}
      {filteredApps.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-3xl mx-auto">
            📋
          </div>
          <h3 className="text-base font-bold text-slate-900">لا توجد طلبات في هذا القسم</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            يمكنك تصفح الفرص الوظيفية المتاحة والتقديم عليها بخطوة واحدة.
          </p>
          <button
            onClick={onExploreJobs}
            className="mt-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors"
          >
            تصفح الوظائف الآن
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => {
            const isRejected = app.status === 'مرفوض';

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition-all p-5 sm:p-6 space-y-6"
              >
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-3xl shrink-0">
                      {app.logo}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(app.status)}`}>
                          {app.status}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          تاريخ التقدم: {app.applyDate}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                        {app.jobTitle}
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">
                        {app.company}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Interview Info */}
                  <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
                    {app.interviewDate && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>موعد المقابلة: {app.interviewDate}</span>
                      </div>
                    )}

                    <button
                      onClick={() => setSelectedAppModal(app)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
                    >
                      عرض التفاصيل الكاملة
                    </button>

                    <button
                      onClick={() => onNavigateToChat(app.company)}
                      className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                      title="مراسلة مسؤول التوظيف"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Stepper Timeline */}
                {!isRejected ? (
                  <div className="pt-3 border-t border-slate-100">
                    <div className="relative">
                      {/* Stepper bar background */}
                      <div className="absolute top-4 left-6 right-6 h-1 bg-slate-100 -z-0">
                        <div 
                          className="h-full bg-blue-600 transition-all duration-500 rounded-full"
                          style={{
                            width: `${(app.currentStepIndex / (stepsLabels.length - 1)) * 100}%`
                          }}
                        ></div>
                      </div>

                      {/* Stepper Dots & Labels */}
                      <div className="flex justify-between relative z-10">
                        {stepsLabels.map((step, idx) => {
                          const isDone = idx < app.currentStepIndex;
                          const isActive = idx === app.currentStepIndex;

                          return (
                            <div key={idx} className="flex flex-col items-center gap-1.5 text-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                  isDone
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : isActive
                                    ? 'bg-white border-2 border-blue-600 text-blue-600 shadow-md ring-4 ring-blue-100'
                                    : 'bg-white border-2 border-slate-200 text-slate-400'
                                }`}
                              >
                                {isDone ? (
                                  <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                  <span>{idx + 1}</span>
                                )}
                              </div>
                              <span className={`text-[11px] font-semibold ${
                                isActive ? 'text-blue-700 font-bold' : isDone ? 'text-slate-700' : 'text-slate-400'
                              }`}>
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-100 text-xs text-rose-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>تم استكمال العدد المطلوب لهذا المنصب. تم حفظ ملفك للفرص المستقبلية.</span>
                    </div>
                    <button
                      onClick={() => setSelectedAppModal(app)}
                      className="text-rose-800 font-bold hover:underline"
                    >
                      التفاصيل
                    </button>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* Application Details Modal */}
      {selectedAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-slate-900 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-100 flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-2xl shrink-0">
                  {selectedAppModal.logo}
                </div>
                <div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(selectedAppModal.status)}`}>
                    {selectedAppModal.status}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 leading-snug mt-1">
                    {selectedAppModal.jobTitle}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">{selectedAppModal.company}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAppModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Detailed Vertical Timeline */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Interview Note if scheduled */}
              {selectedAppModal.interviewDate && (
                <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-blue-600" />
                      مقابلة فيديو مجدولة (Google Meet)
                    </span>
                    <span className="text-[11px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded-md border border-blue-200">
                      {selectedAppModal.interviewDate}
                    </span>
                  </div>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    {selectedAppModal.interviewNote}
                  </p>
                  <button 
                    onClick={() => window.open('https://meet.google.com', '_blank')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>الانضمام لرابط الاجتماع</span>
                  </button>
                </div>
              )}

              {/* Submitted Resume Card */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">السيرة الذاتية المقدمة</span>
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs">
                      PDF
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        {selectedAppModal.resumeFileName}
                      </span>
                      <span className="text-[10px] text-slate-400">1.2 MB • تم الرفع مع الطلب</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert(`جاري تنزيل ${selectedAppModal.resumeFileName}`)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600" />
                    <span>تنزيل</span>
                  </button>
                </div>
              </div>

              {/* Vertical Detailed Stepper */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 block">سجل التتبع الزمني للطلب</span>
                <div className="relative pr-6 border-r-2 border-slate-100 space-y-5 mr-3">
                  {selectedAppModal.timeline.map((step, idx) => (
                    <div key={idx} className="relative">
                      {/* Timeline dot */}
                      <span className={`absolute -right-[31px] top-0.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                        step.completed
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : step.active
                          ? 'border-blue-600 ring-4 ring-blue-100'
                          : 'border-slate-300'
                      }`}>
                        {step.completed && <CheckCircle2 className="w-2.5 h-2.5" />}
                      </span>

                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className={`text-xs font-bold ${step.active ? 'text-blue-700' : 'text-slate-900'}`}>
                            {step.title}
                          </h4>
                          <span className="text-[10px] text-slate-400">{step.date}</span>
                        </div>
                        {step.note && (
                          <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 leading-relaxed">
                            {step.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setSelectedAppModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60"
              >
                إغلاق
              </button>
              <button
                onClick={() => {
                  const comp = selectedAppModal.company;
                  setSelectedAppModal(null);
                  onNavigateToChat(comp);
                }}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>إرسال استفسار للشركة</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

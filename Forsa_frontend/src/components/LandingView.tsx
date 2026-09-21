'use client';

import React from 'react';
import { TabType, Job } from '../types';
import { ForsaLogo } from './ForsaLogo';
import { 
  Briefcase, 
  Users, 
  Building2, 
  Award, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Laptop,
  PieChart,
  Palette,
  Megaphone,
  Wrench,
  Stethoscope,
  BookOpen,
  Headphones
} from 'lucide-react';

interface LandingViewProps {
  onNavigate: (tab: TabType) => void;
  featuredJobs: Job[];
  onSelectJobForDetail: (job: Job) => void;
  onSelectJobForApply: (job: Job) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onNavigate,
  featuredJobs,
  onSelectJobForDetail,
  onSelectJobForApply
}) => {
  const categories = [
    { title: 'تقنية المعلومات', count: 'تصفح الفرص', icon: Laptop, color: 'text-blue-600 bg-blue-50' },
    { title: 'المالية والمحاسبة', count: 'تصفح الفرص', icon: PieChart, color: 'text-indigo-600 bg-indigo-50' },
    { title: 'التصميم والإبداع', count: 'تصفح الفرص', icon: Palette, color: 'text-sky-600 bg-sky-50' },
    { title: 'التسويق والمبيعات', count: 'تصفح الفرص', icon: Megaphone, color: 'text-amber-600 bg-amber-50' },
    { title: 'الهندسة والإنشاءات', count: 'تصفح الفرص', icon: Wrench, color: 'text-slate-700 bg-slate-100' },
    { title: 'الطب والرعاية الصحية', count: 'تصفح الفرص', icon: Stethoscope, color: 'text-emerald-600 bg-emerald-50' },
    { title: 'التعليم والتدريب', count: 'تصفح الفرص', icon: BookOpen, color: 'text-purple-600 bg-purple-50' },
    { title: 'خدمة العملاء', count: 'تصفح الفرص', icon: Headphones, color: 'text-rose-600 bg-rose-50' },
  ];

  return (
    <div className="space-y-12 pb-12">
      
      {/* Top Welcome Notification / Navigation Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-right">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black">مرحباً بك في منصة فرصة للتوظيف والتواصل المهني</h2>
            <p className="text-xs text-blue-100 font-medium">هذه شاشة البداية والتعريف — اضغط على أي قسم للانتقال الفوري للواجهة المطلوبة:</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => onNavigate('feed')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-black text-xs shadow-xs transition-transform hover:scale-105 cursor-pointer"
          >
            <span>الرئيسية (المنشورات)</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigate('jobs')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-colors border border-white/20 cursor-pointer"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>الوظائف</span>
          </button>
          <button
            onClick={() => onNavigate('companies')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-colors border border-white/20 cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>الشركات</span>
          </button>
          <button
            onClick={() => onNavigate('auth')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-900/50 hover:bg-blue-900/70 text-blue-100 font-bold text-xs transition-colors border border-blue-400/30 cursor-pointer"
          >
            <span>دخول / تسجيل</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-blue-50/80 via-white to-white border border-blue-100/80 p-8 sm:p-14 text-center shadow-xs">
        
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-white border border-blue-100 shadow-md flex items-center justify-center p-2">
              <ForsaLogo className="w-12 h-12" />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200/70 shadow-xs">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>المنصة الرائدة للتوظيف والتواصل المهني الذكي</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.2]">
            اكتشف فرصتك المهنية <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-700 to-indigo-600">
              في العالم العربي
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            نربط الكفاءات وأفضل المواهب بكبرى الشركات وأصحاب الأعمال من خلال بيئة حديثة وسلسة، تتبع فوري للطلبات، ومحادثات مباشرة.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('feed')}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-black text-sm shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>الدخول للصفحة الرئيسية (المنشورات)</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('jobs')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-sm transition-colors cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>تصفح أحدث الوظائف</span>
            </button>

            <button
              onClick={() => onNavigate('auth')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-blue-50 text-blue-700 font-black text-sm border border-blue-200 shadow-xs transition-colors cursor-pointer"
            >
              <span>تسجيل الدخول / حساب جديد</span>
            </button>

            <button
              onClick={() => onNavigate('companies')}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm border border-slate-200 transition-colors cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>دليل الشركات</span>
            </button>
          </div>

          {/* Live Trust Metrics */}
          <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs font-bold text-slate-500 pt-4">
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              وظائف موثوقة من شركات حقيقية
            </span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              شركات موثقة تنشر شواغرها
            </span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              تجربة توظيف شفافة وموثوقة
            </span>
          </div>

        </div>
      </section>

      {/* Stats Cards Row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'وظيفة شاغرة متاحة', val: '—', icon: Briefcase, color: 'text-blue-600' },
          { label: 'شركة موثقة توظف', val: '—', icon: Building2, color: 'text-indigo-600' },
          { label: 'كفاءة وباحث عن عمل', val: '—', icon: Users, color: 'text-sky-600' },
          { label: 'نسبة نجاح التوظيف', val: '—', icon: Award, color: 'text-emerald-600' },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs text-center space-y-2 hover:border-blue-200 transition-colors"
          >
            <div className={`w-12 h-12 rounded-2xl bg-slate-50 mx-auto flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
              {stat.val}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Categories Grid */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            تصفح الوظائف حسب التخصص
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            اختر مجالك المهني واستكشف الفرص المحدثة بأعلى الرواتب والمزايا.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => onNavigate('jobs')}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-400 hover:shadow-md transition-all text-right flex flex-col justify-between h-36 group"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.color} group-hover:scale-105 transition-transform`}>
                <cat.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                  {cat.title}
                </h4>
                <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">
                  {cat.count}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-8 sm:p-12 space-y-12">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">خطوات سهلة</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            كيف تعمل منصة فرصة؟
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            رحلة مصممة بعناية فائقة لتوفير الوقت والجهد على الباحثين عن عمل والشركات.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* For Seekers */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
            <h3 className="font-bold text-base text-blue-700 flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>للباحثين عن عمل</span>
            </h3>
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">أنشئ ملفك وسيرتك الذاتية</h4>
                  <p className="text-xs text-slate-500 mt-0.5">أضف مهاراتك وخبراتك السابقة لرفع فرص اختيارك.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">تصفح وقدم بنقرة واحدة</h4>
                  <p className="text-xs text-slate-500 mt-0.5">فلترة ذكية للوظائف وتقديم فوري بدون نماذج معقدة.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">تتبع الطلبات وأجرِ المقابلات</h4>
                  <p className="text-xs text-slate-500 mt-0.5">إشعارات بمواعيد المقابلات واستلام عروض العمل رسمياً.</p>
                </div>
              </div>
            </div>
          </div>

          {/* For Employers */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
            <h3 className="font-bold text-base text-indigo-700 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              <span>للشركات وأصحاب العمل</span>
            </h3>
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">وثّق حساب شركتك</h4>
                  <p className="text-xs text-slate-500 mt-0.5">أنشئ بروفايل الشركة لتعزيز ثقة المرشحين والمواهب.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">انشر الوظائف الشاغرة</h4>
                  <p className="text-xs text-slate-500 mt-0.5">حدد المهارات ونطاق الراتب للوصول لأدق الكفاءات المناسبة.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">وظّف الكفاءات بكل سرعة</h4>
                  <p className="text-xs text-slate-500 mt-0.5">فرز تلقائي، جدولة مقابلات، وإرسال عروض توظيف مباشرة.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Preview */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              وظائف مميزة وموصى بها
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">أحدث الفرص الوظيفية المنشورة</p>
          </div>

          <button
            onClick={() => onNavigate('jobs')}
            className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>مشاهدة كل الوظائف</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {featuredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredJobs.slice(0, 3).map((job) => (
              <div
                key={job.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl shrink-0">
                      {job.logo}
                    </div>
                    <div>
                      <h4 
                        onClick={() => onSelectJobForDetail(job)}
                        className="font-bold text-sm text-slate-900 hover:text-blue-600 cursor-pointer line-clamp-1"
                      >
                        {job.title}
                      </h4>
                      <span className="text-[11px] text-slate-500 font-medium">{job.company} • {job.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 my-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700">
                      {job.type}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      {job.salary}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-2">
                  <button
                    onClick={() => onSelectJobForDetail(job)}
                    className="text-xs font-semibold text-slate-600 hover:text-blue-600"
                  >
                    التفاصيل
                  </button>
                  <button
                    onClick={() => onSelectJobForApply(job)}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs"
                  >
                    تقدم الآن
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-10 bg-white rounded-3xl border border-dashed border-slate-300">
            <p className="text-sm text-slate-500 font-medium">
              لا توجد وظائف منشورة حالياً. عد قريباً لاستكشاف الفرص الجديدة.
            </p>
          </div>
        )}
      </section>

      {/* Bottom CTA Banner */}
      <section className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 sm:p-12 text-center text-white shadow-xl space-y-6">
        <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
          جاهز لبدء مرحلتك المهنية القادمة؟
        </h2>
        <p className="text-xs sm:text-base text-blue-100 max-w-xl mx-auto">
          انضم مجاناً إلى المحترفين والشركات في منصة فرصة وابدأ التقديم أو التوظيف اليوم.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('feed')}
            className="px-7 py-3 rounded-2xl bg-white text-blue-700 font-black text-sm shadow-md hover:bg-slate-50 transition-all hover:scale-[1.02] cursor-pointer"
          >
            الدخول للصفحة الرئيسية (المنشورات)
          </button>
          <button
            onClick={() => onNavigate('jobs')}
            className="px-6 py-3 rounded-2xl bg-blue-500/40 hover:bg-blue-500/60 text-white font-bold text-sm border border-white/25 transition-colors cursor-pointer"
          >
            تصفح الوظائف الآن
          </button>
          <button
            onClick={() => onNavigate('auth')}
            className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-colors cursor-pointer"
          >
            إنشاء حساب جديد
          </button>
        </div>
      </section>

    </div>
  );
};
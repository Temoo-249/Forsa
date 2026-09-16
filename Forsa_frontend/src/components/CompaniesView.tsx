'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  MapPin, 
  Users, 
  Star, 
  Briefcase, 
  CheckCircle2, 
  Sparkles, 
  ArrowUpRight, 
  Filter, 
  PlusCircle, 
  Globe, 
  ShieldCheck,
  Building,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { Company, Job } from '../types';

interface CompaniesViewProps {
  companies: Company[];
  jobs: Job[];
  onSelectCompany: (company: Company) => void;
  onSelectJobForDetail: (job: Job) => void;
  onSelectJobForApply: (job: Job) => void;
  onSwitchToEmployer: () => void;
}

export const CompaniesView: React.FC<CompaniesViewProps> = ({
  companies,
  jobs,
  onSelectCompany,
  onSelectJobForDetail,
  onSelectJobForApply,
  onSwitchToEmployer
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('الكل');
  const [selectedLocation, setSelectedLocation] = useState<string>('الكل');
  const [sortBy, setSortBy] = useState<'rating' | 'jobs' | 'name'>('rating');

  // Industries list
  const industries = [
    'الكل',
    'تطوير البرمجيات والتقنية',
    'الحوسبة السحابية والبنية التحتية',
    'التكنولوجيا المالية والمدفوعات',
    'الذكاء الاصطناعي وعلوم البيانات',
    'تطوير تطبيقات الهواتف الذكية',
    'التسويق الرقمي والإعلام',
    'حاضنات الأعمال والاستثمار الجريء',
    'الموارد البشرية واستقطاب الكفاءات'
  ];

  // Locations list
  const locations = ['الكل', 'السعودية', 'الإمارات', 'مصر', 'الأردن', 'البحرين', 'عن بُعد'];

  // Filter logic
  const filteredCompanies = companies
    .filter(comp => {
      const matchSearch = 
        comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comp.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comp.industry.toLowerCase().includes(searchTerm.toLowerCase());

      const matchIndustry = 
        selectedIndustry === 'الكل' || comp.industry.includes(selectedIndustry);

      const matchLocation = 
        selectedLocation === 'الكل' || comp.location.includes(selectedLocation);

      return matchSearch && matchIndustry && matchLocation;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'jobs') return b.openJobsCount - a.openJobsCount;
      return a.name.localeCompare(b.name, 'ar');
    });

  // Calculate live dynamic metrics
  const totalOpenJobs = companies.reduce((acc, c) => acc + c.openJobsCount, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-200" dir="rtl">
      
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-blue-500/20">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-blue-200 text-xs font-bold mb-4 border border-white/15">
            <Building2 className="w-3.5 h-3.5" />
            <span>دليل الشركات وبيئات العمل المتميزة</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-3">
            استكشف أفضل الشركات التقنية والواعدة في العالم العربي
          </h1>

          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed mb-6 font-medium">
            تعرف على ثقافة العمل، المزايا التنافسية، وقيم المؤسسات، وتصفح الشواغر الوظيفية المتاحة وقدم عليها مباشرة وبكل سهولة.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onSwitchToEmployer}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs sm:text-sm shadow-md transition-all hover:shadow-lg active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-blue-600" />
              <span>هل أنت صاحب عمل؟ سجّل شركتك وانشر وظائف</span>
            </button>
          </div>
        </div>

        {/* Decorative Quick Metrics */}
        <div className="mt-8 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white">{companies.length}+</div>
            <div className="text-xs text-blue-200 mt-0.5 font-medium">شركة وجهة موثقة</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white">{totalOpenJobs}+</div>
            <div className="text-xs text-blue-200 mt-0.5 font-medium">فرصة عمل معلنة حالياً</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white">4.8 / 5</div>
            <div className="text-xs text-blue-200 mt-0.5 font-medium">متوسط رضا بيئة العمل</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white">100%</div>
            <div className="text-xs text-blue-200 mt-0.5 font-medium">اعتماد وموثوقية رسمي</div>
          </div>
        </div>

        <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none"></div>
      </div>

      {/* Search & Filters Controls */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1 w-full">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث باسم الشركة، المجال، أو الكلمات المفتاحية..."
              className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm placeholder:text-slate-400 font-medium transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                مسح
              </button>
            )}
          </div>

          {/* Location Dropdown */}
          <div className="w-full md:w-48">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50/60 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>
                  {loc === 'الكل' ? 'جميع الدول والمناطق' : loc}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="w-full md:w-44">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50/60 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="rating">الأعلى تقييماً ⭐</option>
              <option value="jobs">الأكثر وظائف 💼</option>
              <option value="name">أبجدياً (أ-ي)</option>
            </select>
          </div>
        </div>

        {/* Industry Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
          <span className="text-xs font-bold text-slate-400 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            المجال:
          </span>
          {industries.map(ind => (
            <button
              key={ind}
              onClick={() => setSelectedIndustry(ind)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedIndustry === ind
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Companies Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span>الشركات المتاحة</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold">
              {filteredCompanies.length}
            </span>
          </h2>

          <span className="text-xs text-slate-500 font-medium">
            تحديث فوري للبيانات والشواغر
          </span>
        </div>

        {filteredCompanies.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs">
            <Building className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">لم نتمكن من العثور على شركات مطابقة للبحث</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
              جرّب تغيير كلمات البحث أو إعادة تعيين الفلاتر لعرض جميع الشركات المسجلة في المنصة.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedIndustry('الكل');
                setSelectedLocation('الكل');
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
            >
              إعادة ضبط الفلاتر
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCompanies.map(comp => (
              <div
                key={comp.id}
                id={`company-card-${comp.id}`}
                className="group bg-white rounded-3xl border border-slate-200/80 hover:border-blue-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden"
              >
                {/* Cover Header */}
                <div className={`h-24 bg-gradient-to-r ${comp.coverGradient} p-4 relative flex items-start justify-between`}>
                  <span className="px-2 py-1 rounded-lg bg-black/30 backdrop-blur-xs text-white text-[11px] font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                    <span>{comp.rating}</span>
                  </span>

                  {comp.isVerified && (
                    <span className="px-2 py-0.5 rounded-full bg-white/90 text-blue-700 text-[10px] font-extrabold flex items-center gap-1 shadow-xs">
                      <CheckCircle2 className="w-3 h-3 fill-blue-600 text-white" />
                      موثقة
                    </span>
                  )}

                  {/* Logo Avatar */}
                  <div className="absolute -bottom-6 right-5 w-14 h-14 rounded-2xl bg-white shadow-md border-2 border-white p-1 flex items-center justify-center text-3xl">
                    {comp.logo}
                  </div>
                </div>

                {/* Company Content */}
                <div className="p-5 pt-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                      {comp.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
                      {comp.tagline}
                    </p>

                    {/* Metadata */}
                    <div className="mt-3.5 space-y-1.5 text-xs text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{comp.industry}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{comp.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{comp.employeesCount}</span>
                      </div>
                    </div>

                    {/* Benefits preview tags */}
                    <div className="mt-3.5 flex flex-wrap gap-1">
                      {comp.benefits.slice(0, 2).map((b, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/70 text-[10px] font-semibold text-slate-600 truncate max-w-[200px]"
                        >
                          ✓ {b}
                        </span>
                      ))}
                      {comp.benefits.length > 2 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-500">
                          +{comp.benefits.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions & Open Jobs */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-xl flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>{comp.openJobsCount} وظائف</span>
                    </span>

                    <button
                      onClick={() => onSelectCompany(comp)}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-all group-hover:shadow-xs"
                    >
                      <span>عرض الشركة</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recruiter Bottom Callout */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-white rounded-3xl p-6 sm:p-8 border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              تبحث عن أفضل المواهب والكوادر لشركتك؟
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
              انتقل الآن إلى لوحة أصحاب العمل والشركات في منصة فرصة لنشر الوظائف، متابعة المتقدمين في نظام تتبع الكفاءات (ATS)، وفرز السير الذاتية بضغطة زر.
            </p>
          </div>
        </div>

        <button
          onClick={onSwitchToEmployer}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all shrink-0 flex items-center gap-2"
        >
          <span>فتح بوابة أصحاب العمل</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};

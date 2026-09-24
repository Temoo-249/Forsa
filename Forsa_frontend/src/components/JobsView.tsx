'use client';

import React, { useState, useMemo } from 'react';
import { Job } from '../types';
import { 
  Search, 
  MapPin, 
  Filter, 
  Bookmark, 
  CheckCircle2, 
  DollarSign, 
  SlidersHorizontal, 
  RotateCcw,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Send,
  Eye
} from 'lucide-react';

interface JobsViewProps {
  jobs: Job[];
  onSelectJobForDetail: (job: Job) => void;
  onSelectJobForApply: (job: Job) => void;
  onToggleSaveJob: (jobId: string) => void;
}

export const JobsView: React.FC<JobsViewProps> = ({
  jobs,
  onSelectJobForDetail,
  onSelectJobForApply,
  onToggleSaveJob,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [onlyRemote, setOnlyRemote] = useState(false);
  const [sortBy, setSortBy] = useState<'latest' | 'salary' | 'applicants'>('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const domains = [
    { id: 'all', name: 'جميع المجالات' },
    { id: 'تطوير البرمجيات', name: 'تطوير البرمجيات' },
    { id: 'التصميم (UI/UX)', name: 'التصميم (UI/UX)' },
    { id: 'التسويق الرقمي', name: 'التسويق الرقمي' },
    { id: 'الموارد البشرية', name: 'الموارد البشرية' }
  ];

  const types = [
    { id: 'all', label: 'الكل' },
    { id: 'دوام كامل', label: 'دوام كامل' },
    { id: 'عمل حر', label: 'عمل حر' },
    { id: 'دوام جزئي', label: 'دوام جزئي' },
    { id: 'تدريب', label: 'تدريب' }
  ];

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchSearch = 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
      const matchDomain = selectedDomain === 'all' || job.domain === selectedDomain;
      const matchType = selectedType === 'all' || job.type === selectedType;
      const matchRemote = !onlyRemote || job.workMode === 'remote' || job.location.includes('عن بُعد') || job.type === 'عن بُعد';

      return matchSearch && matchLocation && matchDomain && matchType && matchRemote;
    }).sort((a, b) => {
      if (sortBy === 'applicants') return b.applicantsCount - a.applicantsCount;
      return 0; // Default order
    });
  }, [jobs, searchTerm, locationFilter, selectedDomain, selectedType, onlyRemote, sortBy]);

  const resetFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setSelectedDomain('all');
    setSelectedType('all');
    setOnlyRemote(false);
    setSortBy('latest');
  };

  return (
    <div className="space-y-6">
      
      {/* Search & Hero Banner */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 rounded-3xl p-6 sm:p-10 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-sky-400/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-blue-100 text-xs font-semibold border border-white/20">
            <Briefcase className="w-3.5 h-3.5 text-sky-300" />
            <span>+1,200 فرصة وظيفية نشطة اليوم</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            ابحث عن وظيفتك القادمة بكل سلاسة
          </h1>
          <p className="text-sm sm:text-base text-blue-100/90 max-w-xl mx-auto font-medium">
            تصفح آلاف الوظائف الموثقة في كبرى الشركات بالوطن العربي والشركات العالمية.
          </p>

          {/* Search Box */}
          <div className="bg-white rounded-2xl p-2 shadow-2xl flex flex-col sm:flex-row gap-2 border border-slate-100 mt-6 text-slate-800">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-50 sm:bg-transparent rounded-xl">
              <Search className="w-5 h-5 text-blue-600 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="المسمى الوظيفي، الكلمات المفتاحية، المهارة..."
                className="w-full bg-transparent border-none text-xs sm:text-sm font-medium focus:outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="hidden sm:block w-px bg-slate-200 my-1"></div>

            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-50 sm:bg-transparent rounded-xl">
              <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                placeholder="المدينة، الدولة، أو 'عن بُعد'..."
                className="w-full bg-transparent border-none text-xs sm:text-sm font-medium focus:outline-none placeholder:text-slate-400"
              />
            </div>

            <button
              onClick={() => {}}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shrink-0 shadow-md shadow-blue-500/20"
            >
              <Search className="w-4 h-4" />
              <span>بحث سريع</span>
            </button>
          </div>

          {/* Quick Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            <button
              onClick={() => { setSelectedType('all'); setOnlyRemote(false); }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedType === 'all' && !onlyRemote
                  ? 'bg-white text-blue-700 font-bold shadow-xs'
                  : 'bg-white/15 text-white hover:bg-white/25 border border-white/10'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setOnlyRemote(!onlyRemote)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                onlyRemote
                  ? 'bg-sky-400 text-slate-900 font-bold shadow-xs'
                  : 'bg-white/15 text-white hover:bg-white/25 border border-white/10'
              }`}
            >
              🌐 عن بُعد (Remote)
            </button>
            <button
              onClick={() => setSelectedType(selectedType === 'دوام كامل' ? 'all' : 'دوام كامل')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedType === 'دوام كامل'
                  ? 'bg-white text-blue-700 font-bold shadow-xs'
                  : 'bg-white/15 text-white hover:bg-white/25 border border-white/10'
              }`}
            >
              دوام كامل
            </button>
            <button
              onClick={() => setSelectedType(selectedType === 'عمل حر' ? 'all' : 'عمل حر')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedType === 'عمل حر'
                  ? 'bg-white text-blue-700 font-bold shadow-xs'
                  : 'bg-white/15 text-white hover:bg-white/25 border border-white/10'
              }`}
            >
              عمل حر (Freelance)
            </button>
          </div>
        </div>
      </div>

      {/* Main Jobs Layout: Sidebar Filters + Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="font-bold text-sm text-slate-800">
            تصفية النتائج ({filteredJobs.length} وظيفة)
          </span>
          <button
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>الفلاتر</span>
          </button>
        </div>

        {/* Sidebar Filters */}
        <aside className={`${showMobileFilter ? 'block' : 'hidden'} lg:block bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-6 sticky top-20`}>
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <Filter className="w-4 h-4 text-blue-600" />
              <span>تصفية متقدمة</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>إعادة ضبط</span>
            </button>
          </div>

          {/* Domain Category */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-700 block">مجال التخصص</label>
            <div className="space-y-1">
              {domains.map((d) => (
                <label
                  key={d.id}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                    selectedDomain === d.id
                      ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="domain"
                      value={d.id}
                      checked={selectedDomain === d.id}
                      onChange={() => setSelectedDomain(d.id)}
                      className="accent-blue-600"
                    />
                    <span>{d.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Job Type */}
          <div className="space-y-2.5 pt-3 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 block">نوع التعاقد</label>
            <div className="space-y-1">
              {types.map((t) => (
                <label
                  key={t.id}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                    selectedType === t.id
                      ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="jobType"
                      value={t.id}
                      checked={selectedType === t.id}
                      onChange={() => setSelectedType(t.id)}
                      className="accent-blue-600"
                    />
                    <span>{t.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Remote Toggle */}
          <div className="pt-3 border-t border-slate-100">
            <label className="flex items-center justify-between p-3 rounded-xl bg-blue-50/50 border border-blue-100 cursor-pointer">
              <span className="text-xs font-bold text-slate-800">وظائف عن بُعد فقط (Remote)</span>
              <input
                type="checkbox"
                checked={onlyRemote}
                onChange={(e) => setOnlyRemote(e.target.checked)}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
            </label>
          </div>

        </aside>

        {/* Jobs Feed Grid */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Top Bar with Count & Sort */}
          <div className="bg-white px-5 py-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-2">
              <span>تم العثور على</span>
              <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 font-extrabold">
                {filteredJobs.length}
              </span>
              <span>وظيفة متاحة</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span>ترتيب حسب:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="latest">الأحدث نشرًا</option>
                <option value="applicants">الأكثر إقبالاً</option>
              </select>
            </div>
          </div>

          {/* Job Cards */}
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl mx-auto">
                🔍
              </div>
              <h3 className="text-base font-bold text-slate-900">لم يتم العثور على وظائف مطابقة</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                جرّب تعديل كلمات البحث أو مسح الفلاتر المختارة لمشاهدة جميع الفرص المتاحة.
              </p>
              <button
                onClick={resetFilters}
                className="mt-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                عرض كل الوظائف
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between group"
                >
                  <div>
                    {/* Header: Logo, Title, Bookmark */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                          {job.logo}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-xs font-semibold text-slate-600">{job.company}</span>
                            {job.isVerified && (
                              <span title="شركة موثقة"><ShieldCheck className="w-3.5 h-3.5 text-blue-600" /></span>
                            )}
                          </div>
                          <h3 
                            onClick={() => onSelectJobForDetail(job)}
                            className="font-bold text-base text-slate-900 hover:text-blue-600 cursor-pointer transition-colors leading-snug line-clamp-1"
                          >
                            {job.title}
                          </h3>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {job.location}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onToggleSaveJob(job.id)}
                        className={`p-2 rounded-xl transition-colors ${
                          job.isSaved 
                            ? 'text-amber-500 bg-amber-50' 
                            : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                        }`}
                        title={job.isSaved ? 'إزالة من المحفوظات' : 'حفظ الوظيفة'}
                      >
                        <Bookmark className={`w-4 h-4 ${job.isSaved ? 'fill-amber-500' : ''}`} />
                      </button>
                    </div>

                    {/* Badges row */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-3.5">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        {job.type}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {job.salary}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600">
                        {job.domain}
                      </span>
                    </div>

                    {/* Description preview */}
                    <p className="text-xs text-slate-500 mt-3 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Skill tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3.5">
                      {job.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-50 text-slate-600 border border-slate-200/60"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded-md text-[10px] text-slate-400 font-medium">
                          +{job.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: Metadata + Actions */}
                  <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">
                      {job.postedTime} • {job.applicantsCount} متقدم
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectJobForDetail(job)}
                        className="p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                        title="عرض التفاصيل"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {job.applied ? (
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          تم التقديم
                        </span>
                      ) : (
                        <button
                          onClick={() => onSelectJobForApply(job)}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs shadow-blue-500/20 transition-all hover:scale-[1.02]"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>تقدم الآن</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs font-semibold text-slate-600">
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50">
              <ChevronRight className="w-4 h-4" />
              <span>السابق</span>
            </button>
            <div className="flex items-center gap-1">
              <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center">1</span>
              <span className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center cursor-pointer">2</span>
              <span className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center cursor-pointer">3</span>
            </div>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50">
              <span>التالي</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

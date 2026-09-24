'use client';

import React, { useState } from 'react';
import { 
  X, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  AlertCircle,
  Layers,
  FileText,
  Tag
} from 'lucide-react';
import { Job, Company } from '../types';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  employerCompany: Company;
  onPostJob: (newJob: Job) => Promise<boolean>;
}

export const PostJobModal: React.FC<PostJobModalProps> = ({
  isOpen,
  onClose,
  employerCompany,
  onPostJob
}) => {
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('تطوير البرمجيات');
  const [type, setType] = useState<Job['type']>('دوام كامل');
  const [location, setLocation] = useState('الرياض، السعودية (هجين)');
  const [salary, setSalary] = useState('$3,500 - $5,000');
  const [description, setDescription] = useState('');
  const [requirementsText, setRequirementsText] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(['React', 'TypeScript', 'Tailwind CSS']);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (!skillInput.trim()) return;
    if (!skills.includes(skillInput.trim())) {
      setSkills(prev => [...prev, skillInput.trim()]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('يرجى كتابة المسمى الوظيفي');
      return;
    }
    if (!description.trim()) {
      setError('يرجى إدخال تفاصيل ووصف الوظيفة');
      return;
    }

    const requirements = requirementsText
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    const newJob: Job = {
      id: `job-${Date.now()}`,
      title: title.trim(),
      company: employerCompany.name,
      location: location.trim() || 'الرياض، السعودية',
      logo: employerCompany.logo || '💼',
      type,
      domain,
      salary: salary.trim() || 'يُحدد حسب الخبرة',
      postedTime: 'الآن',
      applicantsCount: 0,
      skills: skills.length > 0 ? skills : ['مطلوب خبرة عملية'],
      description: description.trim(),
      requirements: requirements.length > 0 ? requirements : [
        'خبرة عملية مثبتة في نفس المجال',
        'مهارات تواصل وحل مشكلات عالية'
      ],
      isVerified: true,
      isSaved: false,
      applied: false
    };

    const posted = await onPostJob(newJob);
    if (posted) onClose();
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
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 left-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl border border-white/20">
              {employerCompany.logo || '💼'}
            </div>
            <div>
              <span className="text-xs font-bold text-blue-200 block">
                بوابة التوظيف • {employerCompany.name}
              </span>
              <h2 className="text-xl font-black">نشر فرصة وظيفية جديدة</h2>
            </div>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Job Title & Domain */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                المسمى الوظيفي <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: Senior React Developer"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                المجال والتخصص
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                <option value="تطوير البرمجيات">تطوير البرمجيات</option>
                <option value="الحوسبة السحابية">الحوسبة السحابية و DevOps</option>
                <option value="الذكاء الاصطناعي">الذكاء الاصطناعي والبيانات</option>
                <option value="التصميم وتجربة المستخدم">التصميم وتجربة المستخدم UI/UX</option>
                <option value="التسويق الرقمي">التسويق الرقمي والإعلام</option>
                <option value="الموارد البشرية">الموارد البشرية والتوظيف</option>
                <option value="التكنولوجيا المالية">التكنولوجيا المالية FinTech</option>
              </select>
            </div>
          </div>

          {/* Type, Salary & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                نوع الدوام
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                <option value="دوام كامل">دوام كامل</option>
                <option value="دوام جزئي">دوام جزئي</option>
                <option value="عن بُعد">عن بُعد (Remote)</option>
                <option value="عمل حر">عمل حر (Freelance)</option>
                <option value="تدريب">تدريب تعاوني</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                النطاق الراتبي
              </label>
              <input
                type="text"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="$3,000 - $4,500"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                الموقع / المدينة
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="الرياض، السعودية"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              تفاصيل والوصف العام للوظيفة <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب نبذة عن الدور والمسؤوليات المتوقعة من المرشح وما سيعمل عليه في الفريق..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
              required
            />
          </div>

          {/* Requirements list */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              متطلبات وشروط الوظيفة (اكتب كل شرط في سطر مستقل)
            </label>
            <textarea
              rows={3}
              value={requirementsText}
              onChange={(e) => setRequirementsText(e.target.value)}
              placeholder={`خبرة لا تقل عن 3 سنوات في تطوير البرمجيات\nإتقان عميق لمكتبة React و TypeScript\nمهارات تواصل وتعاون ممتازة`}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Skills tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              المهارات والتقنيات المطلوبة
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="أضف مهارة (مثلاً: Next.js) واضغط إضافة أو Enter"
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                إضافة
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {skills.map(skill => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-600 font-normal"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
            >
              إلغاء
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              نشر الوظيفة الآن
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

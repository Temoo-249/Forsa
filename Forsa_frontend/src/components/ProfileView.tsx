'use client';

import React, { useState } from 'react';
import { SkillItem, ExperienceItem, EducationItem, CVFile } from '../types';
import { 
  User, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Linkedin, 
  Download, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  FileText, 
  UploadCloud, 
  Briefcase, 
  GraduationCap, 
  Award,
  Sparkles,
  Share2,
  Edit3,
  LogOut,
  Settings
} from 'lucide-react';
import { AuthUser } from '../types';

interface ProfileViewProps {
  skills: SkillItem[];
  onAddSkill: (skill: Omit<SkillItem, 'id'>) => void;
  experiences: ExperienceItem[];
  onAddExperience: (exp: Omit<ExperienceItem, 'id'>) => void;
  educations: EducationItem[];
  cvFiles: CVFile[];
  onUploadCV: (name: string, size: string) => void;
  onSetDefaultCV: (id: string) => void;
  onDeleteCV: (id: string) => void;
  currentUser?: AuthUser;
  onLogout?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  skills,
  onAddSkill,
  experiences,
  onAddExperience,
  educations,
  cvFiles,
  onUploadCV,
  onSetDefaultCV,
  onDeleteCV,
  currentUser,
  onLogout
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editHeadline, setEditHeadline] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'skills' | 'experience' | 'education' | 'cv'>('about');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const userName = currentUser?.name || 'مستخدم جديد';
  const userInitials = currentUser?.avatar || userName.slice(0, 2);
  const userHeadline = currentUser?.headline || 'أكمل ملفك الشخصي بإضافة مسمى وظيفي';
  const userEmail = currentUser?.email || '';
  const userBio = (currentUser as any)?.bio || '';
  const userLocation = (currentUser as any)?.location || '';
  const userPhone = (currentUser as any)?.phone || '';
  const userLinkedin = (currentUser as any)?.linkedin || '';
  const userPortfolio = (currentUser as any)?.portfolio || '';
  const hasSocialLinks = userEmail || userPhone || userLinkedin || userPortfolio;


  // Modals for adding skill or exp
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<'مبتدئ' | 'متوسط' | 'متقدم' | 'خبير'>('متقدم');
  const [newSkillPercent, setNewSkillPercent] = useState(85);

  const [showExpModal, setShowExpModal] = useState(false);
  const [newExpRole, setNewExpRole] = useState('');
  const [newExpCompany, setNewExpCompany] = useState('');
  const [newExpPeriod, setNewExpPeriod] = useState('2024 — الآن');
  const [newExpDesc, setNewExpDesc] = useState('');


const { handleUpdateProfile } = useApp(); // تأكد من الاستيراد فوق

const openEditModal = () => {
  setEditName(userName === 'مستخدم جديد' ? '' : userName);
  setEditHeadline(userHeadline === 'أكمل ملفك الشخصي بإضافة مسمى وظيفي' ? '' : userHeadline);
  setEditBio(userBio);
  setEditPhone(userPhone);
  setEditLocation(userLocation);
  setShowEditModal(true);
};

  const handleSaveProfile = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSaving(true);
  const success = await handleUpdateProfile({
    name: editName.trim(),
    headline: editHeadline.trim(),
    bio: editBio.trim(),
    phone: editPhone.trim(),
    location: editLocation.trim(),
  });
  setIsSaving(false);
  if (success) {
    setShowEditModal(false);
  }
  };


  const handleAddSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    onAddSkill({
      name: newSkillName.trim(),
      level: newSkillLevel,
      percentage: newSkillPercent
    });
    setNewSkillName('');
    setShowSkillModal(false);
  };

  const handleAddExpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpRole.trim() || !newExpCompany.trim()) return;
    onAddExperience({
      role: newExpRole.trim(),
      company: newExpCompany.trim(),
      location:userLocation || '',
      period: newExpPeriod,
      description: newExpDesc.trim() || 'تطوير حلول برمجية وقيادة ميزات المنتجات الرقمية.'
    });
    setNewExpRole('');
    setNewExpCompany('');
    setNewExpDesc('');
    setShowExpModal(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      onUploadCV(file.name, sizeStr);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        
        {/* Banner with modern Blue Gradient */}
        <div className="h-44 sm:h-52 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent)]"></div>
          
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <button
              onClick={() => alert('تم نسخ رابط ملفك الشخصي')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-md hover:bg-white/30 text-white text-xs font-bold transition-colors border border-white/20"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>مشاركة</span>
            </button>
            <button
              onClick={() => alert('تعديل الغلاف')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-md hover:bg-white/30 text-white text-xs font-bold transition-colors border border-white/20"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>تغيير الغلاف</span>
            </button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="px-6 sm:px-10 pb-8 pt-0 relative">
          
          {/* Avatar & Main Actions */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 mb-5 gap-4">
            <div className="relative inline-block">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-3xl sm:text-4xl flex items-center justify-center ring-4 ring-white shadow-xl">
                {userInitials}
              </div>
              <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 ring-4 ring-white flex items-center justify-center text-white text-[10px]">
                ✓
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => {
                  const defaultCV = cvFiles.find(f => f.isDefault);
                  if (defaultCV) {
                    alert(`جاري تنزيل ${defaultCV.name}`);
                  } else {
                  alert('لا توجد سيرة ذاتية محفوظة. قم برفع ملف أولاً.');
                   }
                }}
                 className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition-colors border border-slate-200"
              >
                <Download className="w-4 h-4 text-blue-600" />
                <span>تحميل السيرة الذاتية</span>
              </button>

              <button
                onClick={openEditModal}
                className="..."
>
                <Edit3 className="w-4 h-4" />
                 <span>تعديل الملف</span>
              </button>

              {onLogout && (
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs sm:text-sm font-bold transition-colors border border-rose-200 cursor-pointer"
                  title="تسجيل الخروج من الحساب"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>تسجيل الخروج</span>
                </button>
              )}
            </div>
          </div>

          {/* Logout Confirmation Dialog */}
          {showLogoutConfirm && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl border border-slate-200 animate-in fade-in-50">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
                  <LogOut className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-slate-900">هل تود تسجيل الخروج؟</h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  سيتم إنهاء جلستك الحالية والعودة لصفحة الترحيب. يمكنك تسجيل الدخول في أي وقت.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={() => {
                      setShowLogoutConfirm(false);
                      onLogout();
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    تأكيد الخروج
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Name & Headline */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {userName}
              </h1>
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                متاح لفرص العمل فوراً
              </span>
            </div>

            <p className="text-xs sm:text-base text-slate-600 font-medium max-w-2xl">
              {userHeadline}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1 font-medium">
                {userLocation && (
                 <>
                   <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-slate-400" />
                     {userLocation}
                   </span>
                   {userEmail && <span>•</span>}
                 </>
                )}
                {userEmail && (
                 <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {userEmail}
                </span>
              )}
            </div>
          </div>

          {/* Key Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-100">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-center">
             <span className="text-lg sm:text-xl font-black text-blue-700 block">—</span>
             <span className="text-xs text-slate-400 font-semibold">طلبات وظيفية</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-center">
              <span className="text-lg sm:text-xl font-black text-slate-900 block">—</span>
              <span className="text-xs text-slate-400 font-semibold">منشورات ومقالات</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-center">
              <span className="text-lg sm:text-xl font-black text-slate-900 block">—</span>
              <span className="text-xs text-slate-400 font-semibold">مشاهدات للملف</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-center">
              <span className="text-lg sm:text-xl font-black text-slate-900 block">—</span>
              <span className="text-xs text-slate-400 font-semibold">متابع مهني</span>
            </div>
          </div>
        </div>

        

        {/* Profile Tabs Navigation */}
        <div className="flex items-center gap-2 px-6 sm:px-10 border-t border-slate-200/80 overflow-x-auto bg-slate-50/50">
          {[
            { id: 'about', label: 'نبذة عني' },
            { id: 'skills', label: `المهارات التقنية (${skills.length})` },
            { id: 'experience', label: `الخبرات السابقة (${experiences.length})` },
            { id: 'education', label: `التعليم والشهادات (${educations.length})` },
            { id: 'cv', label: `السيرة الذاتية والمستندات (${cvFiles.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 px-3 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* Profile Tab Content */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        
        {/* Tab 1: About */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">المقدمة المهنية والنبذة</h3>
              {userBio ? (
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {userBio}
                </p>
              ) : (
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  لم تتم إضافة نبذة تعريفية بعد. اضغط على "تعديل الملف" لإضافة نبذة عنك.
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="text-sm font-bold text-slate-900">وسائل التواصل والروابط المباشرة</h3>
              {hasSocialLinks ? (
                <div className="flex flex-wrap gap-2.5">
                  {userEmail && (
                    <a
                      href={`mailto:${userEmail}`}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
                    >
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span>{userEmail}</span>
                    </a>
                  )}
                  {userPhone && (
                    <a
                      href={`tel:${userPhone}`}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
                    >
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span dir="ltr">{userPhone}</span>
                    </a>
                  )}
                  {userLinkedin && (
                    <a
                      href={userLinkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
                    >
                      <Linkedin className="w-4 h-4 text-blue-700" />
                      <span>LinkedIn Profile</span>
                    </a>
                  )}
                  {userPortfolio && (
                    <a
                      href={userPortfolio}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
                    >
                      <Globe className="w-4 h-4 text-blue-600" />
                      <span>معرض الأعمال (Portfolio)</span>
                    </a>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  لم تتم إضافة أي وسائل تواصل بعد.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Skills */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">المهارات والتقنيات</h3>
                <p className="text-xs text-slate-500">مستوى الإتقان في أدوات التطوير وهندسة النظم</p>
              </div>
              <button
                onClick={() => setShowSkillModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة مهارة جديدة</span>
              </button>
            </div>

            {skills.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map((s) => (
                  <div
                    key={s.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm text-slate-900">{s.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-700">
                        {s.level}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${s.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                      <span>معدل الإتقان</span>
                      <span>{s.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-8">
                لا توجد مهارات مضافة بعد. اضغط على "إضافة مهارة جديدة" للبدء.
              </p>
            )}
          </div>
        )}

        {/* Tab 3: Experience */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">الخبرات الوظيفية والمهنية</h3>
                <p className="text-xs text-slate-500">المسار المهني والمشاريع السابقة</p>
              </div>
              <button
                onClick={() => setShowExpModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة خبرة</span>
              </button>
            </div>

            {experiences.length > 0 ? (
              <div className="relative pr-6 border-r-2 border-slate-200 space-y-8 mr-2">
                {experiences.map((exp) => (
                  <div key={exp.id} className="relative">
                    <span className="absolute -right-[31px] top-1.5 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-white"></span>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4 className="font-bold text-sm text-slate-900">{exp.role}</h4>
                        <span className="text-xs font-bold text-blue-700 bg-blue-100/70 px-2.5 py-0.5 rounded-md self-start">
                          {exp.period}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-semibold flex items-center gap-2">
                        <span className="text-slate-800">{exp.company}</span>
                        <span>•</span>
                        <span>{exp.location}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed pt-1">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-8">
                لا توجد خبرات مضافة بعد. اضغط على "إضافة خبرة" للبدء.
              </p>
            )}
          </div>
        )}

        {/* Tab 4: Education */}
        {activeTab === 'education' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">التعليم والمؤهلات الأكاديمية</h3>
              <p className="text-xs text-slate-500">الدرجات العلمية والشهادات الاحترافية</p>
            </div>

            {educations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {educations.map((edu) => (
                  <div
                    key={edu.id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 leading-snug">{edu.degree}</h4>
                    <div className="text-xs font-semibold text-slate-600 flex items-center justify-between">
                      <span>{edu.institution}</span>
                      <span className="text-blue-600 font-bold">{edu.period}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{edu.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-8">
                لا توجد مؤهلات دراسية مضافة بعد.
              </p>
            )}
          </div>
        )}

        {/* Tab 5: CV Manager */}
        {activeTab === 'cv' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">إدارة السيرة الذاتية (CV Manager)</h3>
              <p className="text-xs text-slate-500">رفع وإدارة نسخ سيرتك الذاتية لاختيار المناسب منها عند التقديم</p>
            </div>

            {/* Drag & Drop Upload Zone */}
            <label className="border-2 border-dashed border-blue-300 hover:border-blue-600 bg-blue-50/30 hover:bg-blue-50/60 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all">
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                <UploadCloud className="w-7 h-7" />
              </div>
              <span className="font-bold text-sm text-slate-900 block">
                انقر لتحديد ملف أو اسحب الملف وأفلته هنا
              </span>
              <span className="text-xs text-slate-500 mt-1 block">
                ملفات PDF أو DOCX (الحد الأقصى للحجم: 5 ميجابايت)
              </span>
            </label>

            {/* CV Files List */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 block">الملفات المرفوعة حالياً</span>
              {cvFiles.length > 0 ? (
                cvFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs shrink-0">
                        PDF
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-xs sm:text-sm text-slate-900">{file.name}</h5>
                          {file.isDefault && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                              الملف الأساسي
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {file.size} • أضيف في {file.uploadDate}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!file.isDefault && (
                        <button
                          onClick={() => onSetDefaultCV(file.id)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700"
                        >
                          تعيين كأساسي
                        </button>
                      )}
                      <button
                        onClick={() => alert(`جاري تنزيل ${file.name}`)}
                        className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-blue-600"
                        title="تنزيل"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteCV(file.id)}
                        className="p-2 rounded-lg bg-white border border-slate-200 text-rose-500 hover:bg-rose-50"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-6">
                  لم يتم رفع أي ملفات بعد.
                </p>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Add Skill Modal */}
      {showSkillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">إضافة مهارة جديدة</h3>
            <form onSubmit={handleAddSkillSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">اسم المهارة</label>
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="مثال: Next.js أو GraphQL"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">مستوى الخبرة</label>
                <select
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="مبتدئ">مبتدئ</option>
                  <option value="متوسط">متوسط</option>
                  <option value="متقدم">متقدم</option>
                  <option value="خبير">خبير</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>نسبة الإتقان التقريبي</span>
                  <span>{newSkillPercent}%</span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={100}
                  value={newSkillPercent}
                  onChange={(e) => setNewSkillPercent(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSkillModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
                >
                  حفظ المهارة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Experience Modal */}
      {showExpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">إضافة خبرة مهنية جديدة</h3>
            <form onSubmit={handleAddExpSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">المسمى الوظيفي</label>
                <input
                  type="text"
                  value={newExpRole}
                  onChange={(e) => setNewExpRole(e.target.value)}
                  placeholder="مثال: Frontend Team Lead"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">اسم الشركة أو المؤسسة</label>
                <input
                  type="text"
                  value={newExpCompany}
                  onChange={(e) => setNewExpCompany(e.target.value)}
                  placeholder="مثال: Tech Solutions Inc"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">الفترة الزمنية</label>
                <input
                  type="text"
                  value={newExpPeriod}
                  onChange={(e) => setNewExpPeriod(e.target.value)}
                  placeholder="مثال: يناير 2022 — حتى الآن"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">نبذة عن المهام والإنجازات</label>
                <textarea
                  value={newExpDesc}
                  onChange={(e) => setNewExpDesc(e.target.value)}
                  placeholder="قيادة تطوير الواجهات وتطبيق منهجيات Agile..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExpModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
                >
                  حفظ الخبرة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

function useApp(): {
  handleUpdateProfile: (profile: {
    name: string;
    headline: string;
    bio: string;
    phone: string;
    location: string;
  }) => Promise<boolean>;
} {
  const handleUpdateProfile = async (profile: {
    name: string;
    headline: string;
    bio: string;
    phone: string;
    location: string;
  }): Promise<boolean> => {
    try {
      if (typeof window === 'undefined') return false;

      const storedUser = window.localStorage.getItem('currentUser');
      const currentUser = storedUser ? JSON.parse(storedUser) : {};
      const updatedUser = { ...currentUser, ...profile };

      window.localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      window.dispatchEvent(new CustomEvent('profile-updated', {
        detail: updatedUser
      }));
      return true;
    } catch (error) {
      console.error('Unable to update profile', error);
      return false;
    }
  };

  return { handleUpdateProfile };
}

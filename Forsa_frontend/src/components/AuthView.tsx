'use client';

import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  Building2, 
  Briefcase, 
  Phone, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  X,
  AlertCircle
} from 'lucide-react';
import { ForsaLogo } from './ForsaLogo';
import { UserRole, TabType } from '../types';
import { authAPI } from '../services/api';

export interface AuthUserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  headline: string;
  avatar: string;
  companyName?: string;
  isLoggedIn: boolean;
}

interface AuthViewProps {
  initialMode?: 'login' | 'register';
  initialRole?: UserRole;
  isModal?: boolean;
  onCloseModal?: () => void;
  onLoginSuccess: (user: AuthUserData) => void;
  onNavigateTab?: (tab: TabType) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  initialMode = 'login',
  initialRole = 'seeker',
  isModal = false,
  onCloseModal,
  onLoginSuccess,
  onNavigateTab
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [role, setRole] = useState<UserRole>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [headline, setHeadline] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isForgotPassOpen, setIsForgotPassOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('يرجى إدخال البريد الإلكتروني وكلمة المرور للمتابعة.');
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setErrorMsg('يرجى إدخال الاسم الكامل.');
        return;
      }
      if (!termsAccepted) {
        setErrorMsg('يرجى الموافقة على شروط الاستخدام وسياسة الخصوصية.');
        return;
      }
      if (role === 'employer' && !companyName.trim()) {
        setErrorMsg('يرجى إدخال اسم الشركة أو المؤسسة.');
        return;
      }
    }

    setIsLoading(true);

    const performAuth = async () => {
      try {
        let authenticatedUser: AuthUserData | null = null;
        if (mode === 'login') {
          const res = await authAPI.login({ email: email.trim(), password: password.trim() });
          if (res) {
            authenticatedUser = {
              id: res.id,
              name: (res as any).username || res.name || email.split('@')[0],
              email: res.email,
              role: res.role,
              headline: res.headline || '',
              avatar: res.avatar || ((res as any).username ? (res as any).username.slice(0, 2) : 'فر'),
              companyName: res.companyName,
              isLoggedIn: true
            };
          } else {
            setErrorMsg('بيانات الدخول غير صحيحة، يرجى التحقق من البريد أو اسم المستخدم وكلمة المرور.');
            setIsLoading(false);
            return;
          }
        } else {
          // Register mode
          const res = await authAPI.register({
            username: email.split('@')[0] + Math.floor(Math.random() * 1000),
            email: email.trim(),
            password: password.trim(),
            role: role,
            headline: headline.trim() || (role === 'seeker' ? 'باحث عن عمل' : 'صاحب عمل'),
            avatar: name.trim().slice(0, 2) || 'فر',
            companyName: companyName.trim()
          });
          if (res) {
            authenticatedUser = {
              id: res.id,
              name: name.trim() || res.name,
              email: res.email,
              role: res.role,
              headline: res.headline || '',
              avatar: res.avatar,
              companyName: res.companyName,
              isLoggedIn: true
            };
          } else {
            setErrorMsg('تعذر إنشاء الحساب، قد يكون البريد الإلكتروني مسجلاً مسبقاً.');
            setIsLoading(false);
            return;
          }
        }

        setIsLoading(false);
        setSuccessMsg(mode === 'login' ? 'تم تسجيل الدخول بنجاح! مرحباً بك في فرصة.' : 'تم إنشاء حسابك بنجاح! مرحباً بك في منصة فرصة.');
        
        setTimeout(() => {
          if (authenticatedUser) {
            onLoginSuccess(authenticatedUser);
          }
          if (isModal && onCloseModal) {
            onCloseModal();
          }
        }, 600);
      } catch (err) {
        setIsLoading(false);
        setErrorMsg('حدث خطأ في الاتصال بالخادم، يرجى المحاولة مرة أخرى.');
      }
    };

    performAuth();
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSent(true);
    setTimeout(() => {
      setForgotSent(false);
      setIsForgotPassOpen(false);
      setForgotEmail('');
    }, 2500);
  };

  const content = (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative">
      
      {/* Modal Close Button */}
      {isModal && onCloseModal && (
        <button
          onClick={onCloseModal}
          className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          aria-label="إغلاق النافذة"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Right Column: Interactive Form */}
      <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
        <div>
          {/* Header & Logo */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <ForsaLogo className="w-10 h-10" withText={true} />
            </div>
            
            {/* Mode Switcher Pills */}
            <div className="flex p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(''); }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mode === 'login'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                تسجيل الدخول
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMsg(''); }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mode === 'register'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                حساب جديد
              </button>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-900">
              {mode === 'login' ? 'مرحباً بك مجدداً في فرصة' : 'انضم إلى مجتمع فرصة اليوم'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {mode === 'login'
                ? 'أدخل بيانات حسابك للوصول إلى الوظائف والرسائل وتتبع طلباتك.'
                : 'أنشئ حسابك المهني في ثوانٍ وابدأ رحلتك نحو أفضل الفرص والكفاءات.'}
            </p>
          </div>

          {/* Role Selection Tabs */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-700 mb-2">نوع الحساب:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('seeker')}
                className={`flex items-center gap-2.5 p-3 rounded-2xl border text-right transition-all ${
                  role === 'seeker'
                    ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-100 text-blue-900'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  role === 'seeker' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black">باحث عن عمل</div>
                  <div className="text-[10px] text-slate-500">تقديم، سيرة ذاتية، وتواصل</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('employer')}
                className={`flex items-center gap-2.5 p-3 rounded-2xl border text-right transition-all ${
                  role === 'employer'
                    ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-100 text-blue-900'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  role === 'employer' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black">صاحب عمل / شركة</div>
                  <div className="text-[10px] text-slate-500">نشر شواغر، واستقطاب مواهب</div>
                </div>
              </button>
            </div>
          </div>

           
          {/* Messages */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 animate-in fade-in-50">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2 animate-in fade-in-50">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Name Field (Register Mode Only) */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الاسم الكامل *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: أحمد عبد الله الرشيد"
                    className="w-full pr-10 pl-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                    required
                  />
                </div>
              </div>
            )}

            {/* Company Name (Register + Employer) */}
            {mode === 'register' && role === 'employer' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اسم الشركة أو المؤسسة *</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="مثال: TechVision Solutions"
                    className="w-full pr-10 pl-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pr-10 pl-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                  dir="ltr"
                  required
                />
              </div>
            </div>

            {/* Phone & Headline (Register Mode) */}
            {mode === 'register' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">رقم الجوال</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+966 50 000 0000"
                      className="w-full pr-10 pl-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {role === 'seeker' ? 'المسمى الوظيفي' : 'المسمى الوظيفي للمسؤول'}
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder={role === 'seeker' ? 'مثال: Full Stack Developer' : 'مثال: مدير الموارد البشرية'}
                      className="w-full pr-10 pl-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">كلمة المرور *</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setIsForgotPassOpen(true)}
                    className="text-[11px] text-blue-600 hover:underline font-bold"
                  >
                    نسيت كلمة المرور؟
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pr-10 pl-10 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                  dir="ltr"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Terms */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={mode === 'login' ? rememberMe : termsAccepted}
                  onChange={(e) => mode === 'login' ? setRememberMe(e.target.checked) : setTermsAccepted(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-600 font-medium">
                  {mode === 'login' ? 'تذكر بيانات الدخول' : 'أوافق على شروط الاستخدام وسياسة الخصوصية'}
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري المعالجة...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}</span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Social Logins */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <span className="text-xs text-slate-400 block mb-3 font-medium">أو المتابعة باستخدام</span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                        alert('تسجيل الدخول عبر Google سيتوفر قريباً');
                 }} 
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  alert('تسجيل الدخول عبر LinkedIn سيتوفر قريباً');
                }}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
              >
                <span className="w-4 h-4 rounded bg-[#0A66C2] text-white font-bold text-[10px] flex items-center justify-center">
                  in
                </span>
                <span>LinkedIn</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer switch prompt */}
        <div className="pt-6 text-center text-xs text-slate-500">
          {mode === 'login' ? (
            <p>
              ليس لديك حساب بعد؟{' '}
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMsg(''); }}
                className="text-blue-600 font-bold hover:underline"
              >
                أنشئ حسابك الآن مجاناً
              </button>
            </p>
          ) : (
            <p>
              لديك حساب بالفعل؟{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(''); }}
                className="text-blue-600 font-bold hover:underline"
              >
                تسجيل الدخول
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Left Column: Visual Brand Banner */}
      <div className="lg:col-span-5 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-orange-400/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-xs">
            <Sparkles className="w-4 h-4 text-orange-300" />
            <span>المنصة الأولى للفرص الوظيفية الذكية</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black leading-snug">
            طريقك المباشر نحو <br />
            <span className="text-orange-300">النمو المهني الحقيقي</span>
          </h3>

          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            منصة فرصة توفر لك بيئة متكاملة للتقديم المباشر، ومحادثة أصحاب العمل، وإدارة طلبات التوظيف وعروض العمل بشفافية مطلقة.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-xs text-blue-50 font-medium">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              </div>
              <span>مطابقة ذكية للوظائف مع مهاراتك وخبراتك</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-blue-50 font-medium">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              </div>
              <span>محادثات مباشرة وعروض عمل معتمدة</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-blue-50 font-medium">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              </div>
              <span>أمان وحماية كاملة للبيانات والسيرة الذاتية</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-8 mt-8 border-t border-white/15 flex items-center justify-between text-xs text-blue-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>بياناتك مؤمنة ومحمية بنسبة 100%</span>
          </div>
          <span className="font-mono text-[11px] opacity-80">FORSA v2.5</span>
        </div>
      </div>

      {/* Forgot Password Modal Sub-flow */}
      {isForgotPassOpen && (
        <div className="absolute inset-0 z-30 bg-white/95 backdrop-blur-md p-6 sm:p-10 flex items-center justify-center animate-in fade-in-50">
          <div className="max-w-md w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
              <Mail className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-black text-slate-900">استعادة كلمة المرور</h4>
            <p className="text-xs text-slate-500">
              أدخل بريدك الإلكتروني المسجل وسنرسل لك رابطاً لإعادة ضبط كلمة المرور في دقائق.
            </p>

            {forgotSent ? (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center justify-center gap-2 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" />
                <span>تم إرسال رابط الاستعادة إلى بريدك الإلكتروني بنجاح!</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3 pt-2">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-600"
                  dir="ltr"
                  required
                />
                <div className="flex items-center gap-2 justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotPassOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                  >
                    إرسال الرابط
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        {content}
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-10 flex items-center justify-center">
      {content}
    </div>
  );
};

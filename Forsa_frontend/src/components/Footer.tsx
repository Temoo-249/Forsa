'use client';

import React from 'react';
import { TabType } from '../types';
import { ForsaLogo } from './ForsaLogo';

interface FooterProps {
  onNavigate: (tab: TabType) => void;
  onShowMessage?: (msg: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onShowMessage }) => {
  const handleEmployerAction = (actionName: string) => {
    if (onShowMessage) {
      onShowMessage(`ميزة ${actionName} مفعلة في لوحة تحكم الشركات`);
    }
  };
  return (
    <footer className="bg-white border-t border-slate-200/80 mt-16 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-0.5 shadow-xs">
                <ForsaLogo className="w-6 h-6" />
              </div>
              <span className="text-lg font-black text-slate-900">فرصة FORSA</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              أكبر منصة عربية حديثة للتوظيف والتواصل المهني، مصممة بأعلى معايير السلاسة والبساطة باللونين الأبيض والأزرق.
            </p>
          </div>

          {/* Col 2: Candidates */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">للباحثين عن عمل</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-500">
              <li>
                <button onClick={() => onNavigate('jobs')} className="hover:text-blue-600 transition-colors">
                  استكشاف أحدث الوظائف
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('companies')} className="hover:text-blue-600 transition-colors">
                  دليل الشركات وبيئات العمل
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('applications')} className="hover:text-blue-600 transition-colors">
                  نظام تتبع طلباتي (ATS)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('profile')} className="hover:text-blue-600 transition-colors">
                  إدارة السيرة الذاتية (CV)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('feed')} className="hover:text-blue-600 transition-colors">
                  المجتمع المهني والنقاشات
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Employers */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">للشركات وأصحاب الأعمال</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-500">
              <li>
                <button onClick={() => onNavigate('employer-hub')} className="hover:text-blue-600 transition-colors font-bold text-blue-600">
                  لوحة تحكم الشركات (ATS)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('employer-hub')} className="hover:text-blue-600 transition-colors">
                  نشر وظيفة شاغرة
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('employer-hub')} className="hover:text-blue-600 transition-colors">
                  فرز المتقدمين والسير الذاتية
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('messages')} className="hover:text-blue-600 transition-colors">
                  إدارة المقابلات والتواصل
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">الشروط والخصوصية</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-500">
              <li><a href="#" className="hover:text-blue-600 transition-colors">شروط الاستخدام</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">سياسة الخصوصية وأمان البيانات</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">الدعم والمساعدة الفنية</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            جميع الحقوق محفوظة &copy; {new Date().getFullYear()} منصة فرصة FORSA. تصميم عصري باللونين الأبيض والأزرق.
          </div>
          <div className="flex items-center gap-4 text-slate-500 font-bold">
            <button onClick={() => onNavigate('landing')} className="hover:text-blue-600">عن المنصة</button>
            <span>•</span>
            <button onClick={() => onNavigate('jobs')} className="hover:text-blue-600">الوظائف</button>
            <span>•</span>
            <button onClick={() => onNavigate('profile')} className="hover:text-blue-600">ملفي الشخصي</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

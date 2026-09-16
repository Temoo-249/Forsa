'use client';

import React from 'react';
import { Home, Briefcase, FileText, MessageSquare, User, Building2, Sparkles, Users } from 'lucide-react';
import { TabType, UserRole } from '../types';

interface MobileNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  applicationsCount: number;
  unreadMessagesCount: number;
  userRole?: UserRole;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  onSelectTab,
  applicationsCount,
  unreadMessagesCount,
  userRole = 'seeker'
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-lg px-2 py-1.5 flex justify-around items-center">
      {/* الرئيسية (المنشورات) */}
      <button
        onClick={() => onSelectTab('feed')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-colors cursor-pointer ${
          currentTab === 'feed' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px]">الرئيسية</span>
      </button>

      {/* الوظائف */}
      <button
        onClick={() => onSelectTab('jobs')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-colors cursor-pointer ${
          currentTab === 'jobs' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Briefcase className="w-5 h-5" />
        <span className="text-[10px]">الوظائف</span>
      </button>

      {/* الشركات */}
      <button
        onClick={() => onSelectTab('companies')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-colors cursor-pointer ${
          currentTab === 'companies' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Building2 className="w-5 h-5" />
        <span className="text-[10px]">الشركات</span>
      </button>

      {userRole === 'employer' ? (
        <button
          onClick={() => onSelectTab('employer-hub')}
          className={`relative flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-colors ${
            currentTab === 'employer-hub' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <span className="text-[10px]">بوابة الشركة</span>
        </button>
      ) : (
        <button
          onClick={() => onSelectTab('applications')}
          className={`relative flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-colors ${
            currentTab === 'applications' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px]">طلباتي</span>
          {applicationsCount > 0 && (
            <span className="absolute top-0 right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
              {applicationsCount}
            </span>
          )}
        </button>
      )}

      <button
        onClick={() => onSelectTab('messages')}
        className={`relative flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-colors ${
          currentTab === 'messages' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <MessageSquare className="w-5 h-5" />
        <span className="text-[10px]">رسائل</span>
        {unreadMessagesCount > 0 && (
          <span className="absolute top-0 right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
            {unreadMessagesCount}
          </span>
        )}
      </button>

      <button
        onClick={() => onSelectTab('profile')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-colors ${
          currentTab === 'profile' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px]">ملفي</span>
      </button>
    </nav>
  );
};

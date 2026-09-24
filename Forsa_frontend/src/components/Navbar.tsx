'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Briefcase, 
  Home, 
  FileText, 
  MessageSquare, 
  User, 
  Bell, 
  CheckCircle2, 
  Globe, 
  ChevronDown,
  Sparkles,
  Search,
  Building2,
  UserCheck,
  Users,
  LogOut,
  LogIn,
  UserPlus,
  Settings,
  Trash2,
  Check
} from 'lucide-react';
import { TabType, NotificationItem, UserRole, AuthUser } from '../types';
import { ForsaLogo } from './ForsaLogo';

interface NavbarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  applicationsCount: number;
  unreadMessagesCount: number;
  notifications: NotificationItem[];
  onNotificationClick: (notif: NotificationItem) => void;
  onMarkAllNotificationsRead: () => void;
  onDeleteNotification?: (id: string) => void;
  userRole: UserRole;
  onToggleRole: () => void;
  currentUser?: AuthUser;
  onLogout?: () => void;
  onOpenAuthModal?: (mode?: 'login' | 'register') => void;
  onOpenNewPostModal?: () => void;
  onOpenPostJobModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  applicationsCount,
  unreadMessagesCount,
  notifications,
  onNotificationClick,
  onMarkAllNotificationsRead,
  onDeleteNotification,
  userRole,
  onToggleRole,
  currentUser,
  onLogout,
  onOpenAuthModal,
  onOpenNewPostModal,
  onOpenPostJobModal
}) => {
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread'>('all');

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadNotifsCount = notifications.filter(n => n.unread).length;
  const filteredNotifs = notifFilter === 'all' 
    ? notifications 
    : notifications.filter(n => n.unread);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifMenu(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isLoggedIn = Boolean(currentUser && currentUser.isLoggedIn);
  const userName = currentUser?.name || '';
  const userInitials = currentUser?.avatar || (userName ? userName.slice(0, 2) : 'زائر');
  const userEmail = currentUser?.email || '';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Right side (in RTL: Brand Logo & Main Nav) */}
          <div className="flex items-center gap-6 lg:gap-8">
            <button
              onClick={() => onSelectTab('feed')}
              className="flex items-center gap-3 group text-right focus:outline-none cursor-pointer"
              title="فرصة - الصفحة الرئيسية (المنشورات)"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center p-1 group-hover:border-blue-300 group-hover:scale-105 transition-all duration-200">
                <ForsaLogo className="w-8 h-8" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                  فرصة
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-600"></span>
                </span>
                <span className="text-[10px] font-extrabold tracking-widest text-blue-600 uppercase font-mono">
                  FORSA
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => onSelectTab('feed')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  currentTab === 'feed'
                    ? 'bg-blue-50 text-blue-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
                title="الصفحة الرئيسية - منشورات المجتمع المهني"
              >
                <Home className="w-4 h-4" />
                <span>الرئيسية</span>
              </button>

              <button
                onClick={() => onSelectTab('jobs')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  currentTab === 'jobs'
                    ? 'bg-blue-50 text-blue-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>استكشاف الوظائف</span>
              </button>

              <button
                onClick={() => onSelectTab('companies')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  currentTab === 'companies'
                    ? 'bg-blue-50 text-blue-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>دليل الشركات</span>
              </button>

              {userRole === 'employer' ? (
                <button
                  onClick={() => onSelectTab('employer-hub')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer ${
                    currentTab === 'employer-hub'
                      ? 'bg-indigo-50 text-indigo-700 font-bold shadow-xs ring-1 ring-indigo-200'
                      : 'text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50/70 font-bold'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>بوابة الشركة (ATS)</span>
                </button>
              ) : (
                <button
                  onClick={() => onSelectTab('applications')}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer ${
                    currentTab === 'applications'
                      ? 'bg-blue-50 text-blue-700 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>طلباتي</span>
                  {applicationsCount > 0 && (
                    <span className="px-1.5 py-0.5 text-xs font-bold rounded-full bg-blue-100 text-blue-700">
                      {applicationsCount}
                    </span>
                  )}
                </button>
              )}

              <button
                onClick={() => onSelectTab('messages')}
                className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  currentTab === 'messages'
                    ? 'bg-blue-50 text-blue-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>الرسائل</span>
                {unreadMessagesCount > 0 && (
                  <span className="px-1.5 py-0.5 text-xs font-bold rounded-full bg-blue-600 text-white">
                    {unreadMessagesCount}
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* Left side (Tools, Actions, Profile) */}
          <div className="flex items-center gap-2.5 sm:gap-3">

            {/* Post Job Quick Button for Employer */}
            {userRole === 'employer' && onOpenPostJobModal && (
              <button
                onClick={onOpenPostJobModal}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <span>+ نشر وظيفة</span>
              </button>
            )}

            {/* Quick Role Switcher */}
            <button
              onClick={onToggleRole}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border shadow-xs active:scale-95"
              style={{
                backgroundColor: userRole === 'employer' ? '#f5f3ff' : '#f8fafc',
                borderColor: userRole === 'employer' ? '#c7d2fe' : '#e2e8f0',
                color: userRole === 'employer' ? '#4338ca' : '#334155'
              }}
              title="التبديل بين باحث عن عمل وصاحب عمل"
            >
              {userRole === 'seeker' ? (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-bold">باحث عن عمل</span>
                </>
              ) : (
                <>
                  <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="font-bold">صاحب عمل / شركة</span>
                </>
              )}
              <span className="text-[10px] text-slate-400 font-normal underline mr-1">تبديل</span>
            </button>

            {/* Notifications Dropdown (Fixed position so it stays inside viewport cleanly) */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setShowNotifMenu(!showNotifMenu);
                  setShowProfileMenu(false);
                }}
                className={`relative p-2 rounded-xl transition-all duration-150 focus:outline-none ${
                  showNotifMenu 
                    ? 'bg-blue-50 text-blue-700 ring-2 ring-blue-200' 
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'
                }`}
                aria-label="الإشعارات"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white animate-pulse">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {/* Notification Popover - Anchored to left-0 with right: auto so it always opens inside the screen */}
              {showNotifMenu && (
                <div 
                  className="absolute left-0 mt-2.5 w-[calc(100vw-2rem)] sm:w-96 max-w-[380px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden z-50 origin-top-left animate-in fade-in-50 zoom-in-95 duration-150"
                  style={{ right: 'auto' }}
                >
                  {/* Notifications Header */}
                  <div className="p-3.5 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900">الإشعارات</span>
                      {unreadNotifsCount > 0 && (
                        <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-blue-100 text-blue-700">
                          {unreadNotifsCount} جديدة
                        </span>
                      )}
                    </div>

                    {unreadNotifsCount > 0 && (
                      <button
                        onClick={onMarkAllNotificationsRead}
                        className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>تعليم الكل</span>
                      </button>
                    )}
                  </div>

                  {/* Filter Sub-Tabs */}
                  <div className="flex items-center px-3 py-1.5 bg-white border-b border-slate-100 gap-2">
                    <button
                      onClick={() => setNotifFilter('all')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        notifFilter === 'all'
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      الكل ({notifications.length})
                    </button>
                    <button
                      onClick={() => setNotifFilter('unread')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        notifFilter === 'unread'
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      غير المقروءة ({unreadNotifsCount})
                    </button>
                  </div>

                  {/* Scrollable Notifications List */}
                  <div className="max-h-84 overflow-y-auto divide-y divide-slate-100">
                    {filteredNotifs.length === 0 ? (
                      <div className="p-8 text-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                          <Bell className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-slate-700">لا توجد إشعارات حالياً</p>
                        <p className="text-[11px] text-slate-400">ستظهر هنا التحديثات المباشرة لطلباتك والرسائل</p>
                      </div>
                    ) : (
                      filteredNotifs.map(notif => (
                        <div
                          key={notif.id}
                          className={`p-3.5 hover:bg-blue-50/50 cursor-pointer flex items-start gap-3 transition-colors group relative ${
                            notif.unread ? 'bg-blue-50/30' : ''
                          }`}
                          onClick={() => {
                            onNotificationClick(notif);
                            setShowNotifMenu(false);
                          }}
                        >
                          <span className="text-xl shrink-0 p-1.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                            {notif.icon}
                          </span>
                          <div className="flex-1 min-w-0 pr-1">
                            <p className={`text-xs leading-relaxed ${notif.unread ? 'font-black text-slate-900' : 'text-slate-700'}`}>
                              {notif.title}
                            </p>
                            <span className="text-[10px] text-slate-400 mt-1 block font-medium">
                              {notif.time}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0 mt-1">
                            {notif.unread && (
                              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                            )}
                            {onDeleteNotification && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteNotification(notif.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-rose-600 transition-opacity"
                                title="حذف الإشعار"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Notification Footer Action */}
                  <div className="p-2.5 bg-slate-50 text-center border-t border-slate-100 flex items-center justify-between px-4">
                    <button
                      onClick={() => {
                        setShowNotifMenu(false);
                        onSelectTab('applications');
                      }}
                      className="text-xs text-blue-600 font-bold hover:underline"
                    >
                      متابعة كل الطلبات
                    </button>
                    <button
                      onClick={() => {
                        setShowNotifMenu(false);
                        onSelectTab('messages');
                      }}
                      className="text-xs text-slate-500 font-medium hover:text-slate-800"
                    >
                      صندوق الرسائل
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown & Logout Buttons OR Login/Register Buttons */}
            {isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => {
                    setShowProfileMenu(!showProfileMenu);
                    setShowNotifMenu(false);
                  }}
                  className={`flex items-center gap-2 p-1 pl-2.5 rounded-full border transition-all ${
                    showProfileMenu || currentTab === 'profile'
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-100'
                      : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                  }`}
                  title="قائمة الحساب والملف الشخصي"
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                      {userInitials}
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                  </div>
                  <span className="hidden sm:inline-block text-xs font-bold text-slate-800 max-w-[100px] truncate">
                    {userName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Profile & Logout Dropdown Menu */}
                {showProfileMenu && (
                  <div 
                    className="absolute left-0 mt-2.5 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden z-50 origin-top-left animate-in fade-in-50 zoom-in-95 duration-150"
                    style={{ right: 'auto' }}
                  >
                    {/* User Identity Box */}
                    <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                        {userInitials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-black text-slate-900 truncate">
                          {userName}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate" dir="ltr">
                          {userEmail}
                        </div>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                          {userRole === 'seeker' ? 'باحث عن عمل' : 'صاحب عمل / شركة'}
                        </span>
                      </div>
                    </div>

                    {/* Menu Navigation Links */}
                    <div className="p-2 space-y-1">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onSelectTab('feed');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors text-right"
                      >
                        <Home className="w-4 h-4 text-blue-600" />
                        <span>الصفحة الرئيسية (المنشورات)</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onSelectTab('profile');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors text-right"
                      >
                        <User className="w-4 h-4 text-slate-500" />
                        <span>الملف الشخصي والخبرات</span>
                      </button>

                      {userRole === 'seeker' ? (
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            onSelectTab('applications');
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors text-right"
                        >
                          <FileText className="w-4 h-4 text-slate-500" />
                          <span>متابعة طلباتي الوظيفية</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            onSelectTab('employer-hub');
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors text-right"
                        >
                          <Building2 className="w-4 h-4 text-indigo-600" />
                          <span>لوحة إدارة التوظيف والشركة</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onToggleRole();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors text-right"
                      >
                        <UserCheck className="w-4 h-4 text-slate-500" />
                        <span>التحويل إلى: {userRole === 'seeker' ? 'صاحب عمل' : 'باحث عن عمل'}</span>
                      </button>
                    </div>

                    {/* Dedicated Logout Button */}
                    <div className="p-2 border-t border-slate-100 bg-slate-50/50">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          if (onLogout) {
                            onLogout();
                          }
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors text-right group cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
                        <span>تسجيل الخروج من الحساب</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* When Logged Out: Display Sign In & Sign Up buttons */
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectTab('auth')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-blue-600" />
                  <span>دخول</span>
                </button>

                <button
                  onClick={() => onSelectTab('auth')}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>حساب جديد</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

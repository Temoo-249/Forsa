'use client';

import React, { useState } from 'react';
import { Conversation, Message } from '../types';
import { 
  Send, 
  Paperclip, 
  Smile, 
  CheckCheck, 
  Phone, 
  Video, 
  Info, 
  FileText, 
  Download, 
  Building2, 
  CheckCircle2, 
  Search,
  Sparkles,
  ShieldCheck,
  XCircle
} from 'lucide-react';

interface MessagesViewProps {
  conversations: Conversation[];
  onSendMessage: (convId: string, text: string) => void;
  onRespondOffer: (convId: string, messageId: string, accepted: boolean) => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  conversations,
  onSendMessage,
  onRespondOffer
}) => {
  const [activeConvId, setActiveConvId] = useState<string>(conversations[0]?.id || '');
  const [inputText, setInputText] = useState('');
  const [searchConv, setSearchConv] = useState('');
  const [showDetailsSidebar, setShowDetailsSidebar] = useState(true);

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];

  const renderLogo = (logo: string, sizeClass: string = "w-12 h-12 text-2xl") => {
    if (!logo) return null;
    if (logo.startsWith('http://') || logo.startsWith('https://') || logo.startsWith('/')) {
      return (
        <img 
          src={logo} 
          alt="Avatar" 
          className={`${sizeClass} rounded-2xl object-cover shadow-xs border border-slate-200`}
        />
      );
    }
    return (
      <div className={`${sizeClass} rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center font-bold text-slate-800`}>
        {logo}
      </div>
    );
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;
    onSendMessage(activeConv.id, inputText.trim());
    setInputText('');
  };

  const filteredConvs = conversations.filter(c =>
    c.companyName.toLowerCase().includes(searchConv.toLowerCase()) ||
    c.jobTitle.toLowerCase().includes(searchConv.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col md:flex-row h-[750px] max-h-[85vh]">
      
      {/* Col 1: Conversations List */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-l border-slate-200/80 flex flex-col bg-slate-50/50 shrink-0">
        
        {/* Search header */}
        <div className="p-4 border-b border-slate-200/80 bg-white">
          <h2 className="text-base font-black text-slate-900 mb-3">الرسائل والمحادثات</h2>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            <input
              type="text"
              value={searchConv}
              onChange={(e) => setSearchConv(e.target.value)}
              placeholder="البحث في المحادثات..."
              className="w-full pl-3 pr-9 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredConvs.map((conv) => {
            const isActive = conv.id === activeConv?.id;

            return (
              <div
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`p-4 flex items-start gap-3.5 cursor-pointer transition-all ${
                  isActive 
                    ? 'bg-blue-50/60 border-r-4 border-r-blue-600' 
                    : 'hover:bg-slate-100/70 bg-transparent'
                }`}
              >
                <div className="relative shrink-0">
                  {renderLogo(conv.companyLogo, "w-12 h-12 text-xl")}
                  {conv.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {conv.companyName}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {conv.lastMessageTime}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 font-medium truncate mb-1">
                    {conv.jobTitle}
                  </p>

                  <div className="flex items-center justify-between">
                    <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'font-bold text-slate-900' : 'text-slate-400'}`}>
                      {conv.lastMessage}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-black shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Col 2: Chat Thread */}
      {activeConv ? (
        <div className="flex-1 flex flex-col bg-white">
          
          {/* Chat Header */}
          <div className="p-4 px-6 border-b border-slate-200/80 flex items-center justify-between bg-white z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                {renderLogo(activeConv.companyLogo, "w-10 h-10 text-lg")}
                {activeConv.isOnline && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                )}
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <span>{activeConv.companyName}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                </h3>
                <span className="text-[11px] text-emerald-600 font-semibold">
                  {activeConv.isOnline ? 'متصل الآن • مسؤول التوظيف متاح' : 'غير متصل حالياً'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-slate-500">
              <button
                onClick={() => alert('بدء مكالمة صوتية')}
                className="p-2 rounded-xl hover:bg-slate-100 hover:text-blue-600 transition-colors"
                title="اتصال صوتي"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={() => alert('بدء اجتماع فيديو')}
                className="p-2 rounded-xl hover:bg-slate-100 hover:text-blue-600 transition-colors"
                title="اجتماع فيديو"
              >
                <Video className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowDetailsSidebar(!showDetailsSidebar)}
                className={`p-2 rounded-xl transition-colors ${
                  showDetailsSidebar ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-100'
                }`}
                title="معلومات المحادثة"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/40">
            <div className="text-center my-2">
              <span className="px-3 py-1 rounded-full bg-white border border-slate-200/80 text-[11px] font-semibold text-slate-400">
                اليوم
              </span>
            </div>

            {activeConv.messages.map((msg) => {
              const isUser = msg.sender === 'user';

              if (msg.isOffer && msg.offerDetails) {
                const offer = msg.offerDetails;

                return (
                  <div key={msg.id} className="max-w-md mx-auto my-6 animate-in zoom-in-95 duration-200">
                    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-2 border-blue-500 rounded-2xl p-5 shadow-lg space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-blue-100">
                        <div className="flex items-center gap-2">
                          <span className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
                            <Sparkles className="w-4 h-4" />
                          </span>
                          <div>
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">رسمي</span>
                            <h4 className="font-extrabold text-sm text-slate-900">عرض توظيف مقدم لك</h4>
                          </div>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">{msg.time}</span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between p-2.5 rounded-xl bg-white/80 border border-slate-200/70">
                          <span className="text-slate-500 font-medium">المنصب:</span>
                          <span className="font-bold text-slate-900">{offer.jobTitle}</span>
                        </div>
                        <div className="flex justify-between p-2.5 rounded-xl bg-white/80 border border-slate-200/70">
                          <span className="text-slate-500 font-medium">الراتب المتفق عليه:</span>
                          <span className="font-extrabold text-emerald-700">{offer.salary}</span>
                        </div>
                        <div className="flex justify-between p-2.5 rounded-xl bg-white/80 border border-slate-200/70">
                          <span className="text-slate-500 font-medium">تاريخ بدء العمل:</span>
                          <span className="font-bold text-slate-900">{offer.startDate}</span>
                        </div>
                      </div>

                      {offer.accepted ? (
                        <div className="p-3 rounded-xl bg-emerald-100/70 border border-emerald-200 text-center text-emerald-800 font-bold text-xs flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>تهانينا! قمت بقبول العرض الوظيفي بنجاح</span>
                        </div>
                      ) : offer.declined ? (
                        <div className="p-3 rounded-xl bg-slate-100 text-center text-slate-600 font-semibold text-xs flex items-center justify-center gap-2">
                          <XCircle className="w-4 h-4 text-slate-500" />
                          <span>تم رفض العرض</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => onRespondOffer(activeConv.id, msg.id, true)}
                            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-sm"
                          >
                            ✅ قبول العرض
                          </button>
                          <button
                            onClick={() => onRespondOffer(activeConv.id, msg.id, false)}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors"
                          >
                            رفض
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-bl-xs'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-br-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 px-1 font-mono">
                    <span>{msg.time}</span>
                    {isUser && <CheckCheck className="w-3 h-3 text-blue-500" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSend} className="p-3.5 px-6 border-t border-slate-200 bg-white flex items-center gap-2">
            <button
              type="button"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              onClick={() => alert('اختر ملف لإرفاقه')}
              title="إرفاق ملف"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اكتب رسالتك لمدير التوظيف هنا..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:bg-white"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-all shadow-xs"
              title="إرسال"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400">
          اختر محادثة من القائمة للبدء
        </div>
      )}

      {/* Col 3: Details & Context Sidebar */}
      {showDetailsSidebar && activeConv && (
        <div className="hidden xl:flex w-72 border-r border-slate-200/80 flex-col bg-slate-50/40 p-5 space-y-6 shrink-0 overflow-y-auto">
          <div>
            <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-3">
              عن هذه المحادثة
            </h4>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 text-center space-y-2.5 shadow-xs flex flex-col items-center">
              {renderLogo(activeConv.companyLogo, "w-14 h-14 text-2xl")}
              <h3 className="font-bold text-sm text-slate-900">{activeConv.companyName}</h3>
              <span className="inline-flex items-center gap-1 text-[11px] text-blue-600 font-bold bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                <ShieldCheck className="w-3.5 h-3.5" />
                شركة معتمدة
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">
              الطلب الوظيفي المرتبط
            </h4>
            <div className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-1">
              <span className="text-xs font-bold text-slate-900 block">{activeConv.jobTitle}</span>
              <span className="text-[10px] text-slate-400">مرحلة المقابلة النشطة</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">
              الملفات المشتركة ({activeConv.sharedFiles.length})
            </h4>
            <div className="space-y-2">
              {activeConv.sharedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/70 text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="truncate font-semibold text-slate-800 text-[11px]">{file.name}</span>
                  </div>
                  <button 
                    onClick={() => alert(`جاري تنزيل ${file.name}`)}
                    className="p-1 text-slate-400 hover:text-blue-600"
                    title="تنزيل"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

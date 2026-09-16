import React from 'react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-slate-50" dir="rtl">
      <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold mb-4">
        404
      </div>
      <h1 className="text-2xl font-black text-slate-900 mb-2">الصفحة غير موجودة</h1>
      <p className="text-sm text-slate-500 mb-6 max-w-sm">
        عذراً، الرابط الذي تحاول الوصول إليه غير متوفر أو تم نقله.
      </p>
      <a
        href="/"
        className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm"
      >
        العودة للرئيسية
      </a>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Briefcase, MapPin, MessageCircle, Send, UserPlus, Users } from 'lucide-react';
import { profilesAPI } from '../../../services/api';
import { PublicProfile } from '../../../types';
import { useApp } from '../../../context/AppContext';

export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { currentUser, userRole, showToast, upsertConversation } = useApp();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => { profilesAPI.getProfile(id).then(setProfile).finally(() => setLoading(false)); }, [id]);

  const requireEmployer = () => {
    if (!currentUser) { showToast('سجّل دخولك أولاً'); router.push('/login'); return false; }
    if (userRole !== 'employer') { showToast('هذه الخاصية متاحة لأصحاب العمل فقط'); return false; }
    return true;
  };
  const follow = async () => {
    if (!currentUser) { router.push('/login'); return; }
    const result = await profilesAPI.toggleFollow(id);
    if (result) setProfile(p => p ? { ...p, ...result } : p);
    else showToast('تعذر تحديث المتابعة، حاول مرة أخرى');
  };
  const contact = async (offer = false) => {
    if (!requireEmployer()) return;
    setSending(true);
    const result = await profilesAPI.contact(id, offer ? { jobTitle: 'عرض وظيفي جديد', message: `مرحباً ${profile?.name}، نرغب في تقديم عرض وظيفي لك.` } : undefined);
    setSending(false);
    if (!result) { showToast('تعذر إنشاء المحادثة'); return; }
    upsertConversation(result);
    showToast(offer ? 'تم إرسال العرض الوظيفي' : 'تم فتح المحادثة');
    router.push('/messages');
  };

  if (loading) return <div className="py-24 text-center text-slate-500">جاري تحميل الملف الشخصي…</div>;
  if (!profile) return <div className="py-24 text-center text-slate-500">هذا الملف غير متاح أو تم حذفه.</div>;
  const isOwner = currentUser?.id === profile.id;

  return <div className="max-w-5xl mx-auto space-y-6">
    <section className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="h-44 sm:h-52 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent)]" />
      </div>
      <div className="px-6 sm:px-10 pb-8 pt-0 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 mb-5 gap-4">
          <div className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white ring-4 ring-white shadow-xl flex items-center justify-center text-3xl sm:text-4xl font-black">{profile.avatar || profile.name.slice(0, 2)}</div>
          {!isOwner && <div className="flex flex-wrap gap-2 shrink-0">
            <button onClick={follow} className="px-4 py-2.5 rounded-xl border border-blue-600 text-blue-700 font-bold text-sm flex gap-2 bg-white"><UserPlus className="w-4 h-4" />{profile.isFollowing ? 'إلغاء المتابعة' : 'متابعة'}</button>
            {userRole === 'employer' && <>
              <button disabled={sending} onClick={() => contact()} className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm flex gap-2 disabled:opacity-60"><MessageCircle className="w-4 h-4" />مراسلة</button>
              <button disabled={sending} onClick={() => contact(true)} className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm flex gap-2 disabled:opacity-60"><Send className="w-4 h-4" />تقديم عرض</button>
            </>}
          </div>}
        </div>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight truncate">{profile.name}</h1>
          <p className="text-xs sm:text-base text-slate-600 font-medium mt-2 truncate">{profile.headline || 'باحث عن عمل'}</p>
          {profile.location && <p className="text-xs text-slate-500 flex gap-1 items-center mt-3"><MapPin className="w-4 h-4 shrink-0" />{profile.location}</p>}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-100">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-center"><b className="text-lg text-blue-700 block">{profile.followersCount}</b><span className="text-xs text-slate-400 font-semibold">متابعون</span></div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-center"><b className="text-lg text-slate-900 block">{profile.followingCount}</b><span className="text-xs text-slate-400 font-semibold">يتابع</span></div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-center"><b className="text-lg text-slate-900 block">{profile.skills.length}</b><span className="text-xs text-slate-400 font-semibold">مهارات</span></div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-center"><b className="text-lg text-slate-900 block">{profile.experiences.length}</b><span className="text-xs text-slate-400 font-semibold">خبرات</span></div>
        </div>
      </div>
    </section>
    {profile.bio && <section className="bg-white rounded-2xl p-6 border border-slate-200"><h2 className="font-black mb-2">نبذة</h2><p className="text-slate-600 leading-7">{profile.bio}</p></section>}
    <section className="bg-white rounded-2xl p-6 border border-slate-200"><h2 className="font-black mb-4 flex gap-2"><Briefcase className="w-5 h-5 text-blue-600" />المهارات</h2><div className="flex flex-wrap gap-2">{profile.skills.length ? profile.skills.map(skill => <span key={skill.id} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">{skill.name} · {skill.level}</span>) : <span className="text-slate-500">لم يضف مهارات بعد.</span>}</div></section>
    <section className="bg-white rounded-2xl p-6 border border-slate-200"><h2 className="font-black mb-4 flex gap-2"><Users className="w-5 h-5 text-blue-600" />الخبرات</h2>{profile.experiences.length ? <div className="space-y-4">{profile.experiences.map(experience => <article key={experience.id} className="border-r-2 border-blue-500 pr-4"><h3 className="font-bold text-slate-900">{experience.role}</h3><p className="text-sm text-slate-600 mt-1">{experience.company} · {experience.location}</p><p className="text-xs text-blue-700 mt-1">{experience.period}</p>{experience.description && <p className="text-sm text-slate-500 mt-2 leading-6">{experience.description}</p>}</article>)}</div> : <span className="text-slate-500">لم يضف خبرات بعد.</span>}</section>
  </div>;
}

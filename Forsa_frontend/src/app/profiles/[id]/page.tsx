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
  const { currentUser, userRole, showToast } = useApp();
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
    showToast(offer ? 'تم إرسال العرض الوظيفي' : 'تم فتح المحادثة');
    router.push('/messages');
  };

  if (loading) return <div className="py-24 text-center text-slate-500">جاري تحميل الملف الشخصي…</div>;
  if (!profile) return <div className="py-24 text-center text-slate-500">هذا الملف غير متاح أو تم حذفه.</div>;
  const isOwner = currentUser?.id === profile.id;

  return <div className="max-w-4xl mx-auto space-y-6">
    <section className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="h-32 bg-gradient-to-l from-blue-700 to-indigo-700" />
      <div className="px-6 pb-6 -mt-12 flex flex-col sm:flex-row sm:items-end gap-4">
        <div className="w-24 h-24 rounded-3xl bg-white border-4 border-white shadow flex items-center justify-center text-3xl font-black text-blue-700">{profile.avatar || profile.name.slice(0, 2)}</div>
        <div className="flex-1"><h1 className="text-2xl font-black">{profile.name}</h1><p className="text-slate-600 mt-1">{profile.headline || 'باحث عن عمل'}</p>{profile.location && <p className="text-sm text-slate-500 flex gap-1 items-center mt-2"><MapPin className="w-4 h-4" />{profile.location}</p>}</div>
        {!isOwner && <div className="flex flex-wrap gap-2">
          <button onClick={follow} className="px-4 py-2 rounded-xl border border-blue-600 text-blue-700 font-bold text-sm flex gap-2"><UserPlus className="w-4 h-4" />{profile.isFollowing ? 'إلغاء المتابعة' : 'متابعة'}</button>
          <button disabled={sending} onClick={() => contact()} className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-sm flex gap-2"><MessageCircle className="w-4 h-4" />مراسلة</button>
          <button disabled={sending} onClick={() => contact(true)} className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-sm flex gap-2"><Send className="w-4 h-4" />تقديم عرض</button>
        </div>}
      </div>
      <div className="px-6 py-4 border-t grid grid-cols-2 gap-4 text-center"><div><b>{profile.followersCount}</b><span className="text-slate-500 mr-1">متابع</span></div><div><b>{profile.followingCount}</b><span className="text-slate-500 mr-1">يتابع</span></div></div>
    </section>
    {profile.bio && <section className="bg-white rounded-2xl p-6 border border-slate-200"><h2 className="font-black mb-2">نبذة</h2><p className="text-slate-600 leading-7">{profile.bio}</p></section>}
    <section className="bg-white rounded-2xl p-6 border border-slate-200"><h2 className="font-black mb-4 flex gap-2"><Briefcase className="w-5 h-5 text-blue-600" />المهارات</h2><div className="flex flex-wrap gap-2">{profile.skills.length ? profile.skills.map(skill => <span key={skill.id} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">{skill.name} · {skill.level}</span>) : <span className="text-slate-500">لم يضف مهارات بعد.</span>}</div></section>
  </div>;
}

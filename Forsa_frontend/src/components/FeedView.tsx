'use client';

import React, { useState } from 'react';
import { Post, Job, TabType } from '../types';
import { useApp } from '../context/AppContext';
import { 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  Sparkles, 
  Image as ImageIcon, 
  Send, 
  TrendingUp, 
  Briefcase
} from 'lucide-react';

interface FeedViewProps {
  posts: Post[];
  onAddPost: (post: Omit<Post, 'id' | 'likes' | 'comments' | 'timeAgo' | 'isLiked'>) => void;
  onLikePost: (postId: string) => void;
  recommendedJobs: Job[];
  onSelectJobForDetail: (job: Job) => void;
  onSelectJobForApply: (job: Job) => void;
  onNavigateTab: (tab: TabType) => void;
  applicationsCount: number;
}

export const FeedView: React.FC<FeedViewProps> = ({
  posts,
  onAddPost,
  onLikePost,
  recommendedJobs,
  onSelectJobForDetail,
  onSelectJobForApply,
  onNavigateTab,
  applicationsCount
}) => {
  const { currentUser } = useApp();
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState<'عام' | 'عرض مهارات' | 'إنجاز' | 'سؤال'>('عام');
  const [skillInput, setSkillInput] = useState('');
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  // 🔑 بيانات المستخدم الحالي (من الباك إند أو فاضية)
  const userName = currentUser?.name || 'مستخدم';
  const userHeadline = currentUser?.headline || '';
  const userAvatar = currentUser?.avatar || userName.charAt(0);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    onAddPost({
      authorName: userName,
      authorHeadline: userHeadline,
      authorAvatar: userAvatar,
      avatarColor: 'bg-blue-600',
      content: postContent.trim(),
      skills: skillsList,
      category: postCategory
    });

    setPostContent('');
    setSkillsList([]);
  };

  const addSkill = () => {
    if (skillInput.trim() && !skillsList.includes(skillInput.trim())) {
      setSkillsList([...skillsList, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkillsList(skillsList.filter(s => s !== skillToRemove));
  };

  const handleShare = (id: string) => {
    setCopiedPostId(id);
    setTimeout(() => setCopiedPostId(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Main Feed Column */}
      <div className="lg:col-span-8 space-y-5">
        
        {/* Header Banner */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>الرئيسية</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80">
                المنشورات والمجتمع المهني
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              شارك تجاربك وخبراتك المهنية، تواصل مع المحترفين، واكتشف مستجدات سوق العمل العربي.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('landing')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 text-xs font-bold border border-slate-200/80 transition-colors shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>شاشة البداية</span>
          </button>
        </div>

        {/* Create Post Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
              {userAvatar}
            </div>
            <div className="flex-1">
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="ما الذي تريد مشاركته اليوم مع مجتمع فرصة؟ (خبرة، استفسار، إنجاز جديد...)"
                rows={3}
                className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
              />
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-bold text-slate-500 ml-1">نوع المنشور:</span>
            {(['عام', 'عرض مهارات', 'إنجاز', 'سؤال'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setPostCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  postCategory === cat
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Skills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {skillsList.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100"
              >
                <span>#{skill}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="hover:text-red-500 text-blue-400 font-bold"
                >
                  ×
                </button>
              </span>
            ))}

            <div className="inline-flex items-center gap-1">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="+ وسم مهارة"
                className="px-2.5 py-1 rounded-md text-xs border border-slate-200 focus:outline-none focus:border-blue-500 w-24 bg-slate-50"
              />
              {skillInput && (
                <button
                  type="button"
                  onClick={addSkill}
                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded-md font-bold"
                >
                  إضافة
                </button>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                onClick={() => alert('ميزة إرفاق الصور متوفرة')}
              >
                <ImageIcon className="w-4 h-4 text-blue-600" />
                <span>صورة</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                onClick={() => setPostCategory('عرض مهارات')}
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>مهارات</span>
              </button>
            </div>

            <button
              onClick={handleCreatePost}
              disabled={!postContent.trim()}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white text-xs sm:text-sm font-bold shadow-xs shadow-blue-500/20 transition-all hover:scale-[1.01]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>نشر الآن</span>
            </button>
          </div>
        </div>

        {/* Posts Stream */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-10 text-center">
              <p className="text-slate-500 text-sm font-medium">
                لا توجد منشورات حتى الآن. كن أول من يشارك!
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-sm transition-shadow p-5 sm:p-6 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-full ${post.avatarColor} text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs`}>
                      {post.authorAvatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900 leading-none">
                          {post.authorName}
                        </h4>
                        {post.category && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                            {post.category}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 font-medium">
                        {post.authorHeadline}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        {post.timeAgo}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal">
                  {post.content}
                </p>

                {post.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200/60"
                      >
                        #{skill}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => onLikePost(post.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                        post.isLiked
                          ? 'text-blue-600 bg-blue-50 font-black'
                          : 'hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${post.isLiked ? 'fill-blue-600' : ''}`} />
                      <span>{post.likes}</span>
                      <span className="hidden sm:inline">أعجبني</span>
                    </button>

                    <button
                      onClick={() => alert('التعليقات مفتوحة قريباً')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments}</span>
                      <span className="hidden sm:inline">تعليق</span>
                    </button>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => handleShare(post.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="hidden sm:inline">مشاركة</span>
                    </button>
                    {copiedPostId === post.id && (
                      <span className="absolute left-0 -top-8 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap shadow-md">
                        تم نسخ الرابط!
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="lg:col-span-4 space-y-5">
        
        {/* User Mini Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 text-center space-y-4">
          <div className="relative inline-block mx-auto">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xl flex items-center justify-center shadow-md">
              {userAvatar}
            </div>
            {currentUser && (
              <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            )}
          </div>

          <div>
            <h3 className="font-bold text-base text-slate-900">{userName}</h3>
            <p className="text-xs text-slate-500 font-medium">{userHeadline || 'أكمل ملفك الشخصي'}</p>
          </div>

          <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center">
            <div>
              <span className="text-base font-black text-blue-700 block">{applicationsCount}</span>
              <span className="text-[11px] text-slate-400 font-medium">طلباتي</span>
            </div>
            <div className="border-x border-slate-100">
              <span className="text-base font-black text-slate-900 block">—</span>
              <span className="text-[11px] text-slate-400 font-medium">مشاهدات</span>
            </div>
            <div>
              <span className="text-base font-black text-slate-900 block">—</span>
              <span className="text-[11px] text-slate-400 font-medium">المتابعون</span>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('profile')}
            className="w-full py-2 px-3 rounded-xl border border-blue-200 text-blue-700 hover:bg-blue-50 text-xs font-bold transition-colors"
          >
            عرض ملفي الشخصي وسيرتي الذاتية
          </button>
        </div>

        {/* Recommended Jobs */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>وظائف موصى بها لك</span>
            </h3>
            <button
              onClick={() => onNavigateTab('jobs')}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold"
            >
              عرض الكل
            </button>
          </div>

          <div className="space-y-3 divide-y divide-slate-100">
            {recommendedJobs.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-3">لا توجد وظائف متاحة حالياً</p>
            ) : (
              recommendedJobs.slice(0, 3).map((job) => (
                <div key={job.id} className="pt-3 first:pt-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-base shrink-0">
                        {job.logo}
                      </span>
                      <div>
                        <h4 
                          onClick={() => onSelectJobForDetail(job)}
                          className="text-xs font-bold text-slate-900 hover:text-blue-600 cursor-pointer line-clamp-1"
                        >
                          {job.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium">{job.company} • {job.salary}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectJobForApply(job)}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-bold hover:bg-blue-700 shrink-0"
                    >
                      تقدم
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Trending Skills */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span>أكثر المهارات طلباً هذا الشهر</span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              { name: 'React.js', count: '+28%' },
              { name: 'Next.js', count: '+35%' },
              { name: 'TypeScript', count: '+40%' },
              { name: 'Node.js', count: '+15%' },
              { name: 'Figma', count: '+22%' },
              { name: 'AWS Cloud', count: '+30%' },
              { name: 'Docker', count: '+18%' },
              { name: 'Python AI', count: '+50%' },
            ].map((skill, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-semibold text-slate-700"
              >
                <span>{skill.name}</span>
                <span className="text-[10px] text-emerald-600 font-bold">{skill.count}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
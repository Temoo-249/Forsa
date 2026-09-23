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
  Briefcase,
  Trash2,
  Reply,
  X,
  Loader2,
  MoreHorizontal,
} from 'lucide-react';

type FeedComment = {
  id: string;
  postId: string;
  parentId?: string | null;
  userId?: string;
  authorName: string;
  authorAvatar: string;
  avatarColor?: string;
  content: string;
  createdAt: string;
};

interface FeedViewProps {
  posts: Post[];

  onAddPost: (
    post: Omit<Post, 'id' | 'likes' | 'comments' | 'timeAgo' | 'isLiked'>
  ) => Promise<void> | void;

  onLikePost: (postId: string) => Promise<void> | void;

  onDeletePost: (postId: string) => Promise<void> | void;

  onGetComments: (postId: string) => Promise<FeedComment[]>;

  onAddComment: (
    postId: string,
    content: string,
    parentId?: string | null
  ) => Promise<FeedComment>;

  onDeleteComment: (commentId: string) => Promise<void>;

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
  onDeletePost,
  onGetComments,
  onAddComment,
  onDeleteComment,
  recommendedJobs,
  onSelectJobForDetail,
  onSelectJobForApply,
  onNavigateTab,
  applicationsCount,
}) => {
  const { currentUser } = useApp();

  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] =
    useState<'عام' | 'عرض مهارات' | 'إنجاز' | 'سؤال'>('عام');

  const [skillInput, setSkillInput] = useState('');
  const [skillsList, setSkillsList] = useState<string[]>([]);

  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  const [openComments, setOpenComments] = useState<string | null>(null);

  const [comments, setComments] = useState<Record<string, FeedComment[]>>(
    {}
  );

  const [loadingComments, setLoadingComments] = useState<
    Record<string, boolean>
  >({});

  const [commentText, setCommentText] = useState<Record<string, string>>({});

  const [replyingTo, setReplyingTo] = useState<{
    postId: string;
    commentId: string;
    authorName: string;
  } | null>(null);

  const [sendingComment, setSendingComment] = useState<
    Record<string, boolean>
  >({});

  const [deletingComment, setDeletingComment] = useState<string | null>(null);

  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  const userName = currentUser?.name || 'مستخدم';
  const userHeadline = currentUser?.headline || '';
  const userAvatar = currentUser?.avatar || userName.charAt(0);

  const currentUserId = String(
    (currentUser as any)?.id ??
      (currentUser as any)?.userId ??
      ''
  );

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    const content = postContent.trim();

    if (!content) return;

    await onAddPost({
      authorName: userName,
      authorHeadline: userHeadline,
      authorAvatar: userAvatar,
      avatarColor: 'bg-blue-600',
      content,
      skills: [...skillsList],
      category: postCategory,
    });

    setPostContent('');
    setSkillInput('');
    setSkillsList([]);
    setPostCategory('عام');
  };

  const addSkill = () => {
    const value = skillInput.trim();

    if (!value) return;

    if (!skillsList.includes(value)) {
      setSkillsList((prev) => [...prev, value]);
    }

    setSkillInput('');
  };

  const removeSkill = (skillToRemove: string) => {
    setSkillsList((prev) =>
      prev.filter((skill) => skill !== skillToRemove)
    );
  };

  const handleShare = async (postId: string) => {
    const shareUrl = `${window.location.origin}/feed#post-${postId}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'منشور على فرصة',
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      setCopiedPostId(postId);

      window.setTimeout(() => {
        setCopiedPostId(null);
      }, 2000);
    } catch {
      // المستخدم أغلق نافذة المشاركة
    }
  };

  const toggleComments = async (postId: string) => {
    if (openComments === postId) {
      setOpenComments(null);
      return;
    }

    setOpenComments(postId);

    if (comments[postId]) {
      return;
    }

    setLoadingComments((prev) => ({
      ...prev,
      [postId]: true,
    }));

    try {
      const result = await onGetComments(postId);

      setComments((prev) => ({
        ...prev,
        [postId]: result,
      }));
    } finally {
      setLoadingComments((prev) => ({
        ...prev,
        [postId]: false,
      }));
    }
  };

  const handleSendComment = async (
    postId: string,
    parentId: string | null = null
  ) => {
    const text = (commentText[postId] || '').trim();

    if (!text) return;

    setSendingComment((prev) => ({
      ...prev,
      [postId]: true,
    }));

    try {
      const created = await onAddComment(
        postId,
        text,
        parentId
      );

      setComments((prev) => ({
        ...prev,
        [postId]: [
          ...(prev[postId] || []),
          created,
        ],
      }));

      setCommentText((prev) => ({
        ...prev,
        [postId]: '',
      }));

      setReplyingTo(null);
    } finally {
      setSendingComment((prev) => ({
        ...prev,
        [postId]: false,
      }));
    }
  };

  const handleDeleteComment = async (
    postId: string,
    commentId: string
  ) => {
    setDeletingComment(commentId);

    try {
      await onDeleteComment(commentId);

      setComments((prev) => ({
        ...prev,
        [postId]: (prev[postId] || []).filter(
          (comment) =>
            comment.id !== commentId &&
            comment.parentId !== commentId
        ),
      }));
    } finally {
      setDeletingComment(null);
    }
  };

  const handleDeletePost = async (postId: string) => {
    const confirmed = window.confirm(
      'هل أنت متأكد من حذف هذا المنشور؟ لا يمكن التراجع عن هذه العملية.'
    );

    if (!confirmed) return;

    setDeletingPostId(postId);

    try {
      await onDeletePost(postId);
    } finally {
      setDeletingPostId(null);
    }
  };

  const rootComments = (postId: string) =>
    (comments[postId] || []).filter(
      (comment) => !comment.parentId
    );

  const commentReplies = (
    postId: string,
    parentId: string
  ) =>
    (comments[postId] || []).filter(
      (comment) => comment.parentId === parentId
    );

  const isOwnPost = (post: Post) => {
    const authorId =
      (post as any).authorId ??
      (post as any).userId ??
      null;

    if (authorId !== null && currentUserId) {
      return String(authorId) === currentUserId;
    }

    return post.authorName === userName;
  };

  const isOwnComment = (comment: FeedComment) => {
    if (comment.userId && currentUserId) {
      return String(comment.userId) === currentUserId;
    }

    return comment.authorName === userName;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

      {/* =========================
          MAIN FEED
      ========================= */}
      <div className="lg:col-span-8 space-y-5">

        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>الرئيسية</span>

              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80">
                المنشورات والمجتمع المهني
              </span>
            </h1>

            <p className="text-xs text-slate-500 font-medium mt-1">
              شارك تجاربك وخبراتك المهنية وتواصل مع مجتمع فرصة.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('landing')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 text-xs font-bold border border-slate-200/80 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>شاشة البداية</span>
          </button>
        </div>

        {/* Create Post */}
        <form
          onSubmit={handleCreatePost}
          className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4"
        >
          <div className="flex items-start gap-3.5">

            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {userAvatar}
            </div>

            <div className="flex-1">
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="ما الذي تريد مشاركته اليوم مع مجتمع فرصة؟"
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(['عام', 'عرض مهارات', 'إنجاز', 'سؤال'] as const).map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setPostCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    postCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {skillsList.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100"
              >
                #{skill}

                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="text-blue-400 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}

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
              className="px-2.5 py-1 rounded-md text-xs border border-slate-200 focus:outline-none focus:border-blue-500 w-28 bg-slate-50"
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

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 text-xs font-semibold"
              >
                <ImageIcon className="w-4 h-4 text-blue-600" />
                صورة
              </button>

              <button
                type="button"
                onClick={() => setPostCategory('عرض مهارات')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 text-xs font-semibold"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                مهارات
              </button>
            </div>

            <button
              type="submit"
              disabled={!postContent.trim()}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs sm:text-sm font-bold"
            >
              <Send className="w-3.5 h-3.5" />
              نشر الآن
            </button>
          </div>
        </form>

        {/* =========================
            POSTS
        ========================= */}
        <div className="space-y-4">

          {posts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
              <p className="text-slate-500 text-sm font-medium">
                لا توجد منشورات حتى الآن.
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <article
                id={`post-${post.id}`}
                key={post.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-4"
              >

                {/* Post Header */}
                <div className="flex items-start justify-between">

                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-full ${
                        post.avatarColor || 'bg-blue-600'
                      } text-white font-bold text-sm flex items-center justify-center shrink-0`}
                    >
                      {post.authorAvatar}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900">
                          {post.authorName}
                        </h4>

                        {post.category && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700">
                            {post.category}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500 mt-1">
                        {post.authorHeadline}
                      </p>

                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        {post.timeAgo}
                      </span>
                    </div>
                  </div>

                  {/* Delete Post */}
                  {isOwnPost(post) && (
                    <button
                      type="button"
                      onClick={() => handleDeletePost(post.id)}
                      disabled={deletingPostId === post.id}
                      title="حذف المنشور"
                      className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      {deletingPostId === post.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>

                {/* Post Content */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>

                {/* Skills */}
                {post.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {post.skills.map((skill, idx) => (
                      <span
                        key={`${post.id}-${idx}`}
                        className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200/60"
                      >
                        #{skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">

                  <div className="flex items-center gap-2">

                    {/* Like */}
                    <button
                      type="button"
                      onClick={() => onLikePost(post.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        post.isLiked
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <ThumbsUp
                        className={`w-4 h-4 ${
                          post.isLiked ? 'fill-blue-600' : ''
                        }`}
                      />

                      <span>{post.likes}</span>
                      <span className="hidden sm:inline">أعجبني</span>
                    </button>

                    {/* Comments */}
                    <button
                      type="button"
                      onClick={() => toggleComments(post.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        openComments === post.id
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <MessageCircle className="w-4 h-4" />

                      <span>
                        {comments[post.id]?.length ?? post.comments}
                      </span>

                      <span className="hidden sm:inline">
                        تعليق
                      </span>
                    </button>
                  </div>

                  {/* Share */}
                  <button
                    type="button"
                    onClick={() => handleShare(post.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-600 text-xs font-bold"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline">مشاركة</span>
                  </button>
                </div>

                {copiedPostId === post.id && (
                  <div className="text-[11px] text-emerald-600 font-bold">
                    تم نسخ رابط المنشور.
                  </div>
                )}

                {/* =========================
                    COMMENTS
                ========================= */}
                {openComments === post.id && (
                  <div className="mt-2 pt-4 border-t border-slate-100 space-y-4">

                    {/* Add Comment */}
                    <div className="flex items-start gap-3">

                      <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {userAvatar}
                      </div>

                      <div className="flex-1">

                        {replyingTo?.postId === post.id && (
                          <div className="flex items-center justify-between mb-2 px-3 py-2 bg-blue-50 rounded-lg">
                            <span className="text-[11px] text-blue-700 font-semibold">
                              الرد على {replyingTo.authorName}
                            </span>

                            <button
                              type="button"
                              onClick={() => setReplyingTo(null)}
                              className="text-blue-500 hover:text-red-500"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        <div className="flex items-end gap-2">

                          <textarea
                            value={commentText[post.id] || ''}
                            onChange={(e) =>
                              setCommentText((prev) => ({
                                ...prev,
                                [post.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();

                                handleSendComment(
                                  post.id,
                                  replyingTo?.postId === post.id
                                    ? replyingTo.commentId
                                    : null
                                );
                              }
                            }}
                            rows={2}
                            placeholder={
                              replyingTo?.postId === post.id
                                ? 'اكتب ردك...'
                                : 'اكتب تعليقًا...'
                            }
                            className="flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                          />

                          <button
                            type="button"
                            disabled={
                              !(commentText[post.id] || '').trim() ||
                              sendingComment[post.id]
                            }
                            onClick={() =>
                              handleSendComment(
                                post.id,
                                replyingTo?.postId === post.id
                                  ? replyingTo.commentId
                                  : null
                              )
                            }
                            className="p-3 rounded-xl bg-blue-600 text-white disabled:opacity-40 hover:bg-blue-700"
                          >
                            {sendingComment[post.id] ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Send className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Loading */}
                    {loadingComments[post.id] && (
                      <div className="flex justify-center py-5">
                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                      </div>
                    )}

                    {/* Comments */}
                    {!loadingComments[post.id] &&
                      rootComments(post.id).length === 0 && (
                        <div className="text-center py-5">
                          <p className="text-xs text-slate-400">
                            لا توجد تعليقات حتى الآن.
                          </p>
                        </div>
                      )}

                    {!loadingComments[post.id] &&
                      rootComments(post.id).map((comment) => (
                        <div key={comment.id} className="space-y-2">

                          {/* Root Comment */}
                          <div className="flex items-start gap-3">

                            <div
                              className={`w-9 h-9 rounded-full ${
                                comment.avatarColor || 'bg-slate-600'
                              } text-white flex items-center justify-center text-xs font-bold shrink-0`}
                            >
                              {comment.authorAvatar}
                            </div>

                            <div className="flex-1 min-w-0">

                              <div className="bg-slate-50 rounded-xl p-3">

                                <div className="flex items-start justify-between gap-2">

                                  <div>
                                    <p className="text-xs font-bold text-slate-900">
                                      {comment.authorName}
                                    </p>

                                    <span className="text-[10px] text-slate-400">
                                      {comment.createdAt}
                                    </span>
                                  </div>

                                  {isOwnComment(comment) && (
                                    <button
                                      type="button"
                                      disabled={
                                        deletingComment === comment.id
                                      }
                                      onClick={() =>
                                        handleDeleteComment(
                                          post.id,
                                          comment.id
                                        )
                                      }
                                      className="text-slate-400 hover:text-red-600"
                                    >
                                      {deletingComment === comment.id ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      ) : (
                                        <Trash2 className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  )}
                                </div>

                                <p className="text-xs text-slate-700 leading-relaxed mt-2 whitespace-pre-line">
                                  {comment.content}
                                </p>
                              </div>

                              <div className="flex items-center gap-3 px-2">

                                <button
                                  type="button"
                                  onClick={() =>
                                    setReplyingTo({
                                      postId: post.id,
                                      commentId: comment.id,
                                      authorName: comment.authorName,
                                    })
                                  }
                                  className="text-[11px] font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1"
                                >
                                  <Reply className="w-3.5 h-3.5" />
                                  رد
                                </button>

                                {commentReplies(
                                  post.id,
                                  comment.id
                                ).length > 0 && (
                                  <span className="text-[10px] text-slate-400">
                                    {
                                      commentReplies(
                                        post.id,
                                        comment.id
                                      ).length
                                    }{' '}
                                    ردود
                                  </span>
                                )}
                              </div>

                              {/* Replies */}
                              {commentReplies(
                                post.id,
                                comment.id
                              ).length > 0 && (
                                <div className="mt-3 mr-8 space-y-3">
                                  {commentReplies(
                                    post.id,
                                    comment.id
                                  ).map((reply) => (
                                    <div
                                      key={reply.id}
                                      className="flex items-start gap-2"
                                    >
                                      <div
                                        className={`w-7 h-7 rounded-full ${
                                          reply.avatarColor ||
                                          'bg-indigo-600'
                                        } text-white flex items-center justify-center text-[10px] font-bold shrink-0`}
                                      >
                                        {reply.authorAvatar}
                                      </div>

                                      <div className="flex-1 bg-slate-50/80 rounded-xl p-3">

                                        <div className="flex items-start justify-between gap-2">

                                          <div>
                                            <p className="text-[11px] font-bold text-slate-900">
                                              {reply.authorName}
                                            </p>

                                            <span className="text-[9px] text-slate-400">
                                              {reply.createdAt}
                                            </span>
                                          </div>

                                          {isOwnComment(reply) && (
                                            <button
                                              type="button"
                                              disabled={
                                                deletingComment ===
                                                reply.id
                                              }
                                              onClick={() =>
                                                handleDeleteComment(
                                                  post.id,
                                                  reply.id
                                                )
                                              }
                                              className="text-slate-400 hover:text-red-600"
                                            >
                                              {deletingComment ===
                                              reply.id ? (
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                              ) : (
                                                <Trash2 className="w-3 h-3" />
                                              )}
                                            </button>
                                          )}
                                        </div>

                                        <p className="text-xs text-slate-700 mt-1.5 whitespace-pre-line">
                                          {reply.content}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </article>
            ))
          )}
        </div>
      </div>

      {/* =========================
          SIDEBAR
      ========================= */}
      <div className="lg:col-span-4 space-y-5">

        {/* Profile */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 text-center space-y-4">

          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xl flex items-center justify-center mx-auto">
            {userAvatar}
          </div>

          <div>
            <h3 className="font-bold text-base text-slate-900">
              {userName}
            </h3>

            <p className="text-xs text-slate-500">
              {userHeadline || 'أكمل ملفك الشخصي'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center">

            <div>
              <span className="text-base font-black text-blue-700 block">
                {applicationsCount}
              </span>
              <span className="text-[11px] text-slate-400">
                طلباتي
              </span>
            </div>

            <div className="border-x border-slate-100">
              <span className="text-base font-black text-slate-900 block">
                —
              </span>
              <span className="text-[11px] text-slate-400">
                مشاهدات
              </span>
            </div>

            <div>
              <span className="text-base font-black text-slate-900 block">
                —
              </span>
              <span className="text-[11px] text-slate-400">
                المتابعون
              </span>
            </div>

          </div>

          <button
            onClick={() => onNavigateTab('profile')}
            className="w-full py-2 px-3 rounded-xl border border-blue-200 text-blue-700 hover:bg-blue-50 text-xs font-bold"
          >
            عرض ملفي الشخصي
          </button>
        </div>

        {/* Recommended Jobs */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">

          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              وظائف موصى بها
            </h3>

            <button
              onClick={() => onNavigateTab('jobs')}
              className="text-xs text-blue-600 font-bold"
            >
              عرض الكل
            </button>
          </div>

          <div className="space-y-3">

            {recommendedJobs.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-3">
                لا توجد وظائف متاحة حالياً
              </p>
            ) : (
              recommendedJobs.slice(0, 3).map((job) => (
                <div
                  key={job.id}
                  className="pt-3 first:pt-0 border-t first:border-t-0 border-slate-100"
                >
                  <div className="flex items-start justify-between gap-2">

                    <div className="flex items-center gap-2.5">

                      <span className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-base">
                        {job.logo}
                      </span>

                      <div>
                        <h4
                          onClick={() =>
                            onSelectJobForDetail(job)
                          }
                          className="text-xs font-bold text-slate-900 hover:text-blue-600 cursor-pointer line-clamp-1"
                        >
                          {job.title}
                        </h4>

                        <p className="text-[11px] text-slate-500">
                          {job.company} • {job.salary}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        onSelectJobForApply(job)
                      }
                      className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-bold hover:bg-blue-700"
                    >
                      تقدم
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3">

          <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span>أكثر المهارات طلباً</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              'React.js',
              'Next.js',
              'TypeScript',
              'Node.js',
              'Figma',
              'AWS Cloud',
              'Docker',
              'Python AI',
            ].map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-semibold text-slate-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
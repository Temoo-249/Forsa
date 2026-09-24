import { 
  Job, 
  Application, 
  Post, 
  Conversation, 
  NotificationItem, 
  Company, 
  JobApplicant,
  AuthUser,
  PublicProfile
} from '../types';

// Vercel exposes only NEXT_PUBLIC_* values to the browser. The existing
// Railway deployment remains a safe fallback so a missing Vercel variable
// cannot make login silently target localhost in a user's browser.
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://believable-commitment-production-ed28.up.railway.app/api').replace(/\/$/, '');

function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('forsa_auth_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': 'Token ' + token } : {})
  };
}

function getUploadHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('forsa_auth_token') : null;
  return token ? { Authorization: `Token ${token}` } : {};
}

async function handleResponse<T>(res: Response, fallback: T): Promise<T> {
  if (!res.ok) {
    console.warn('API error: ' + res.status + ' ' + res.statusText);
    return fallback;
  }
  try {
    return await res.json();
  } catch (err) {
    console.warn('Failed to parse API JSON, returning fallback', err);
    return fallback;
  }
}

// 1. Auth & Profile APIs
export const authAPI = {
  async getCurrentUser(fallback: AuthUser | null): Promise<AuthUser | null> {
    try {
      const res = await fetch(API_BASE + '/auth/user/', { headers: getAuthHeaders() });
      if (!res.ok) return fallback;
      const data = await res.json();
      if (data.token && typeof window !== 'undefined') {
        localStorage.setItem('forsa_auth_token', data.token);
      }
      return data;
    } catch (e) {
      console.warn('Backend not reachable, using fallback user', e);
      return fallback;
    }
  },

  async login(credentials: { email: string; password?: string }): Promise<AuthUser | null> {
    try {
      const res = await fetch(API_BASE + '/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (data.token && typeof window !== 'undefined') {
        localStorage.setItem('forsa_auth_token', data.token);
      }
      return data;
    } catch (e) {
      console.error('Login error', e);
      return null;
    }
  },

  async register(userData: any): Promise<AuthUser | null> {
    try {
      const res = await fetch(API_BASE + '/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (data.token && typeof window !== 'undefined') {
        localStorage.setItem('forsa_auth_token', data.token);
      }
      return data;
    } catch (e) {
      console.error('Registration error', e);
      return null;
    }
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('forsa_auth_token');
    }
  },

  async addSkill(skill: { name: string; level: string; percentage: number }) {
    try {
      const res = await fetch(API_BASE + '/auth/skills/', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(skill)
      });
      return res.ok ? await res.json() : null;
    } catch (e) {
      console.error('Add skill error', e);
      return null;
    }
  },

  async addExperience(exp: { role: string; company: string; location: string; period: string; description: string }) {
    try {
      const res = await fetch(API_BASE + '/auth/experience/', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(exp)
      });
      return res.ok ? await res.json() : null;
    } catch (e) {
      console.error('Add experience error', e);
      return null;
    }
  },

  async uploadCV(file: File) {
    try {
      const body = new FormData();
      body.append('name', file.name);
      body.append('size', `${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      body.append('file', file);
      const res = await fetch(API_BASE + '/auth/resumes/', {
        method: 'POST',
        headers: getUploadHeaders(),
        body
      });
      return res.ok ? await res.json() : null;
    } catch (e) {
      console.error('Upload CV error', e);
      return null;
    }
  },

  async deleteCV(id: string | number) {
    try {
      const res = await fetch(API_BASE + '/auth/resumes/' + id + '/', {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return res.ok;
    } catch (e) {
      console.error('Delete CV error', e);
      return false;
    }
  },

  async setDefaultCV(id: string | number) {
    try {
      const res = await fetch(API_BASE + '/auth/resumes/' + id + '/', {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isDefault: true })
      });
      return res.ok ? await res.json() : null;
    } catch (e) {
      console.error('Set default CV error', e);
      return null;
    }
  },
  async updateProfile(profileData: any): Promise<AuthUser | null> {
  try {
    const res = await fetch(API_BASE + '/auth/user/', {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    return res.ok ? await res.json() : null;
   } catch (e) {
    console.error('Update profile error', e);
    return null;
   }
  }
};

// 2. Jobs APIs
export const jobsAPI = {
  async getJobs(params?: { search?: string; type?: string; domain?: string }, fallback: Job[] = []): Promise<Job[]> {
    try {
      const query = new URLSearchParams();
      if (params?.search) query.append('search', params.search);
      if (params?.type) query.append('type', params.type);
      if (params?.domain) query.append('domain', params.domain);

      const qs = query.toString() ? '?' + query.toString() : '';
      const res = await fetch(API_BASE + '/jobs/' + qs, { headers: getAuthHeaders() });
      return await handleResponse<Job[]>(res, fallback);
    } catch (e) {
      console.warn('Jobs API unreachable, using fallback', e);
      return fallback;
    }
  },

 async createJob(jobData: Partial<Job>): Promise<Job | null> {
  try {
    const res = await fetch(API_BASE + '/jobs/', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(jobData)
    });
    if (!res.ok) {
      console.error('Create job failed:', res.status, await res.text());
      return null;
    }
    return await res.json();
  } catch (e) {
    console.error('Failed to post job to backend', e);
    return null;
  }
},

  async deleteJob(jobId: string): Promise<boolean> {
    try {
      const res = await fetch(API_BASE + '/jobs/' + jobId + '/', {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return res.ok;
    } catch (e) {
      console.error('Failed to delete job', e);
      return false;
    }
  },

  async updateJobStatus(jobId: string, status: Job['status']): Promise<Job | null> {
    try {
      const res = await fetch(API_BASE + '/jobs/' + jobId + '/', {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      return res.ok ? await res.json() : null;
    } catch (e) {
      console.error('Failed to update job status', e);
      return null;
    }
  },

  async toggleSave(jobId: string): Promise<{ isSaved: boolean } | null> {
    try {
      const res = await fetch(API_BASE + '/jobs/' + jobId + '/save/', {
        method: 'POST',
        headers: getAuthHeaders()
      });
      return res.ok ? await res.json() : null;
    } catch (e) {
      console.error('Failed to toggle save job', e);
      return null;
    }
  },

  async apply(jobId: string, details: { resumeFileName?: string; coverNote?: string }): Promise<Application | null> {
    try {
      const res = await fetch(API_BASE + '/jobs/' + jobId + '/apply/', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(details)
      });
      return res.ok ? await res.json() : null;
    } catch (e) {
      console.error('Failed to apply for job', e);
      return null;
    }
  }
};

// 3. Applications APIs
export const applicationsAPI = {
  async getMyApplications(fallback: Application[] = []): Promise<Application[]> {
    try {
      const res = await fetch(API_BASE + '/jobs/applications/my/', { headers: getAuthHeaders() });
      return await handleResponse<Application[]>(res, fallback);
    } catch (e) {
      console.warn('Applications API unreachable, using fallback', e);
      return fallback;
    }
  },

  async getEmployerApplicants(fallback: JobApplicant[] = []): Promise<JobApplicant[]> {
    try {
      const res = await fetch(API_BASE + '/jobs/employer/applicants/', { headers: getAuthHeaders() });
      return await handleResponse<JobApplicant[]>(res, fallback);
    } catch (e) {
      console.warn('Employer applicants API unreachable, using fallback', e);
      return fallback;
    }
  },

  async updateApplicantStatus(applicantId: string, data: { status?: string; interviewDate?: string }): Promise<JobApplicant | null> {
    try {
      const res = await fetch(API_BASE + '/jobs/employer/applicants/' + applicantId + '/', {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      return res.ok ? await res.json() : null;
    } catch (e) {
      console.error('Failed to update applicant', e);
      return null;
    }
  }
};

// 4. Companies APIs
export const companiesAPI = {
  async getCompanies(fallback: Company[] = []): Promise<Company[]> {
    try {
      const res = await fetch(API_BASE + '/companies/', { headers: getAuthHeaders() });
      return await handleResponse<Company[]>(res, fallback);
    } catch (e) {
      console.warn('Companies API unreachable, using fallback', e);
      return fallback;
    }
  },
  async updateCompany(companyId: string, data: Partial<Company>): Promise<Company | null> {
  try {
    const res = await fetch(API_BASE + '/companies/' + companyId + '/', {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      console.error('Update company failed:', await res.text());
      return null;
    }
    return await res.json();
  } catch (e) {
    console.error('Failed to update company', e);
    return null;
  }
},
async createCompany(data: Partial<Company>): Promise<Company | null> {
  try {
    const res = await fetch(API_BASE + '/companies/', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      console.error('Create company failed:', await res.text());
      return null;
    }
    return await res.json();
  } catch (e) {
    console.error('Failed to create company', e);
    return null;
  }
},
};

// 5. Posts (Feed) APIs
export const postsAPI = {
  async getPosts(category?: string, fallback: Post[] = []): Promise<Post[]> {
    try {
      const qs = category && category !== 'الكل' ? '?category=' + encodeURIComponent(category) : '';
      const res = await fetch(API_BASE + '/posts/' + qs, { headers: getAuthHeaders() });
      return await handleResponse<Post[]>(res, fallback);
    } catch (e) {
      console.warn('Posts API unreachable, using fallback', e);
      return fallback;
    }
  },

  async createPost(postData: { content: string; skills: string[]; category: string; image?: string | null }): Promise<Post | null> {
    try {
      const res = await fetch(API_BASE + '/posts/', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(postData)
      });
      return res.ok ? await res.json() : null;
    } catch (e) {
      console.error('Failed to create post', e);
      return null;
    }
  },

  async toggleLike(postId: string): Promise<{ isLiked: boolean; likes: number } | null> {
    try {
      const res = await fetch(API_BASE + '/posts/' + postId + '/like/', {
        method: 'POST',
        headers: getAuthHeaders()
      });
      return res.ok ? await res.json() : null;
    } catch (e) {
      console.error('Failed to like post', e);
      return null;
    }
  },

  // حذف منشور: يعتمد على صلاحيات الـ Django Backend لتحديد صاحب المنشور.
  async deletePost(postId: string): Promise<void> {
    try {
      const res = await fetch(API_BASE + '/posts/' + postId + '/', {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!res.ok) {
        let detail = 'Failed to delete post';
        try {
          const data = await res.json();
          detail = data?.detail || detail;
        } catch {
          // بعض استجابات DELETE ترجع بدون JSON.
        }
        throw new Error(detail);
      }
    } catch (e) {
      console.error('Failed to delete post', e);
      throw e;
    }
  },

  // جلب تعليقات المنشور.
  async getComments(postId: string): Promise<any[]> {
    try {
      const res = await fetch(API_BASE + '/posts/' + postId + '/comments/', {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!res.ok) {
        throw new Error('Failed to load comments');
      }

      const data = await res.json();
      return Array.isArray(data) ? data : (Array.isArray(data?.results) ? data.results : []);
    } catch (e) {
      console.error('Failed to get comments', e);
      throw e;
    }
  },

  // إضافة تعليق أو رد على تعليق باستخدام parent_id.
  async addComment(postId: string, content: string, parentId?: string | null): Promise<any> {
    try {
      const res = await fetch(API_BASE + '/posts/' + postId + '/comments/', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          content: content.trim(),
          ...(parentId ? { parent_id: parentId } : {})
        })
      });

      if (!res.ok) {
        let detail = 'Failed to add comment';
        try {
          const data = await res.json();
          detail = data?.detail || detail;
        } catch {
          // تجاهل فشل قراءة JSON.
        }
        throw new Error(detail);
      }

      return await res.json();
    } catch (e) {
      console.error('Failed to add comment', e);
      throw e;
    }
  },

  // حذف تعليق. صلاحية الحذف يجب أن تُفرض أيضاً من Django.
  async deleteComment(commentId: string): Promise<void> {
  try {
    const res = await fetch(API_BASE + '/posts/comments/' + commentId + '/', {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      let detail = 'Failed to delete comment';
      try {
        const data = await res.json();
        detail = data?.detail || detail;
      } catch {}
      throw new Error(detail);
    }
  } catch (e) {
    console.error('Failed to delete comment', e);
    throw e;
  }
}
};

// 6. Chat & Conversations APIs
export const chatAPI = {
  async getConversations(fallback: Conversation[] = []): Promise<Conversation[]> {
    try {
      const res = await fetch(API_BASE + '/conversations/', { headers: getAuthHeaders() });
      return await handleResponse<Conversation[]>(res, fallback);
    } catch (e) {
      console.warn('Conversations API unreachable, using fallback', e);
      return fallback;
    }
  },

  async sendMessage(convId: string, message: { text: string; sender?: string }): Promise<any | null> {
    try {
      const res = await fetch(API_BASE + '/conversations/' + convId + '/messages/', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(message)
      });
      return res.ok ? await res.json() : null;
    } catch (e) {
      console.error('Failed to send message', e);
      return null;
    }
  },

  async respondOffer(convId: string, messageId: string, action: 'accept' | 'decline'): Promise<any | null> {
    try {
      const res = await fetch(API_BASE + '/conversations/' + convId + '/messages/' + messageId + '/respond/', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ action })
      });
      return res.ok ? await res.json() : null;
    } catch (e) {
      console.error('Failed to respond to offer', e);
      return null;
    }
  }
};

// 7. Notifications APIs
export const notificationsAPI = {
  async getNotifications(fallback: NotificationItem[] = []): Promise<NotificationItem[]> {
    try {
      const res = await fetch(API_BASE + '/notifications/', { headers: getAuthHeaders() });
      return await handleResponse<NotificationItem[]>(res, fallback);
    } catch (e) {
      console.warn('Notifications API unreachable, using fallback', e);
      return fallback;
    }
  },

  async markAllRead(): Promise<boolean> {
    try {
      const res = await fetch(API_BASE + '/notifications/mark-all-read/', {
        method: 'POST',
        headers: getAuthHeaders()
      });
      return res.ok;
    } catch (e) {
      console.error('Failed to mark notifications read', e);
      return false;
    }
  }
};

export const profilesAPI = {
  async getProfile(id: string): Promise<PublicProfile | null> {
    try {
      const res = await fetch(`${API_BASE}/auth/profiles/${id}/`, { headers: getAuthHeaders() });
      return res.ok ? await res.json() : null;
    } catch { return null; }
  },

  async toggleFollow(id: string): Promise<{ isFollowing: boolean; followersCount: number } | null> {
    try {
      const res = await fetch(`${API_BASE}/auth/profiles/${id}/follow/`, { method: 'POST', headers: getAuthHeaders() });
      return res.ok ? await res.json() : null;
    } catch { return null; }
  },
  async contact(id: string, offer?: { jobTitle: string; salary?: string; startDate?: string; message?: string }): Promise<Conversation | null> {
    try {
      const res = await fetch(`${API_BASE}/conversations/profiles/${id}/`, {
        method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(offer ? { offer } : {})
      });
      return res.ok ? await res.json() : null;
    } catch { return null; }
  }
};

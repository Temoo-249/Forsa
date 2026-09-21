import { 
  Job, 
  Application, 
  Post, 
  Conversation, 
  NotificationItem, 
  Company, 
  JobApplicant,
  AuthUser
} from '../types';

 const API_BASE = (typeof window !== 'undefined' && (window as any).__FORSA_API_BASE__) || 'https://believable-commitment-production-ed28.up.railway.app/api';

function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('forsa_auth_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': 'Token ' + token } : {})
  };
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

  async uploadCV(cv: { name: string; size?: string; isDefault?: boolean }) {
    try {
      const res = await fetch(API_BASE + '/auth/resumes/', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(cv)
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
      return res.ok ? await res.json() : null;
    } catch (e) {
      console.error('Failed to post job to backend', e);
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
  }
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

  async createPost(postData: { content: string; skills: string[]; category: string }): Promise<Post | null> {
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

// Normalize base URL: ensure it ends with /api (without duplicate or trailing slashes)
const rawBase = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').trim().replace(/\/+$/, '');
const API_BASE = rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`;

class ApiClient {
  getToken() {
    return localStorage.getItem('workpulse_access_token');
  }

  setToken(token) {
    if (token) {
      localStorage.setItem('workpulse_access_token', token);
    } else {
      localStorage.removeItem('workpulse_access_token');
    }
  }

  getActiveWorkspaceId() {
    return localStorage.getItem('workpulse_active_workspace_id');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const token = this.getToken();
    const wsId = this.getActiveWorkspaceId();

    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(wsId ? { 'X-Workspace-Id': wsId } : {}),
      ...options.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers });

      if (response.status === 204) {
        return null;
      }

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
          this.logout();
          localStorage.removeItem('workpulse_auth_session');
          // Dispatch auth event so UI redirects if needed
          window.dispatchEvent(new CustomEvent('workpulse_unauthorized'));
        }
        const errorMsg = data?.detail || `HTTP Error ${response.status}`;
        throw new Error(errorMsg);
      }

      return data;
    } catch (err) {
      console.warn(`[API] ${endpoint} request failed:`, err.message);
      throw err;
    }
  }

  // Auth Endpoints
  async login(email, password, rememberMe = true) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, remember_me: rememberMe }),
    });
    if (data?.access_token) {
      this.setToken(data.access_token);
    }
    return data;
  }

  async register(name, email, password) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    if (data?.access_token) {
      this.setToken(data.access_token);
    }
    return data;
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async updateProfile(updates) {
    return this.request('/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteAccount() {
    return this.request('/auth/me', {
      method: 'DELETE',
    });
  }

  async verifyEmail() {
    return this.request('/auth/verify-email', { method: 'POST' });
  }

  async forgotPassword(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(newPassword) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ new_password: newPassword }),
    });
  }

  logout() {
    this.setToken(null);
  }

  // Workspaces
  async getWorkspaces() {
    return this.request('/workspaces');
  }

  async createWorkspace(data) {
    return this.request('/workspaces', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateWorkspace(id, data) {
    return this.request(`/workspaces/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteWorkspace(id) {
    return this.request(`/workspaces/${id}`, {
      method: 'DELETE',
    });
  }

  // Tasks
  async getTasks(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/tasks${query ? `?${query}` : ''}`);
  }

  async createTask(data) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTask(id, data) {
    return this.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTask(id) {
    return this.request(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // Projects
  async getProjects() {
    return this.request('/projects');
  }

  async createProject(data) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProject(id, data) {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id) {
    return this.request(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Daily Logs
  async getDailyLogs() {
    return this.request('/daily-logs');
  }

  async createDailyLog(data) {
    return this.request('/daily-logs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDailyLog(id, data) {
    return this.request(`/daily-logs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDailyLog(id) {
    return this.request(`/daily-logs/${id}`, {
      method: 'DELETE',
    });
  }

  // Activities & Summary
  async getActivities() {
    return this.request('/activities');
  }

  async getDashboardSummary() {
    return this.request('/dashboard/summary');
  }

  async getAnalyticsSummary(days = 30) {
    return this.request(`/analytics/summary?days=${days}`);
  }
}

export const api = new ApiClient();


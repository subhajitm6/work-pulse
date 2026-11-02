const KEYS = {
  WORKSPACES: 'workpulse_workspaces',
  ACTIVE_WORKSPACE_ID: 'workpulse_active_workspace_id',
  PROJECTS: 'workpulse_projects',
  TASKS: 'workpulse_tasks',
  DAILY_LOGS: 'workpulse_daily_logs',
  THEME: 'workpulse_theme',
  USER: 'workpulse_user',
  ACTIVITIES: 'workpulse_activities',
};

export const storage = {
  getWorkspaces: () => {
    try {
      const data = localStorage.getItem(KEYS.WORKSPACES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveWorkspaces: (workspaces) => {
    localStorage.setItem(KEYS.WORKSPACES, JSON.stringify(workspaces || []));
  },

  getActiveWorkspaceId: (workspaces = []) => {
    try {
      const storedId = localStorage.getItem(KEYS.ACTIVE_WORKSPACE_ID);
      if (storedId && workspaces.some((w) => w.id === storedId)) {
        return storedId;
      }
      return workspaces.length > 0 ? workspaces[0].id : null;
    } catch {
      return null;
    }
  },
  saveActiveWorkspaceId: (id) => {
    if (id) {
      localStorage.setItem(KEYS.ACTIVE_WORKSPACE_ID, id);
    } else {
      localStorage.removeItem(KEYS.ACTIVE_WORKSPACE_ID);
    }
  },

  getProjects: () => {
    try {
      const data = localStorage.getItem(KEYS.PROJECTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveProjects: (projects) => {
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects || []));
  },

  getTasks: () => {
    try {
      const data = localStorage.getItem(KEYS.TASKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveTasks: (tasks) => {
    localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks || []));
  },

  getDailyLogs: () => {
    try {
      const data = localStorage.getItem(KEYS.DAILY_LOGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveDailyLogs: (logs) => {
    localStorage.setItem(KEYS.DAILY_LOGS, JSON.stringify(logs || []));
  },

  getActivities: () => {
    try {
      const data = localStorage.getItem(KEYS.ACTIVITIES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveActivities: (activities) => {
    localStorage.setItem(KEYS.ACTIVITIES, JSON.stringify(activities || []));
  },

  getUser: () => {
    try {
      const data = localStorage.getItem(KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  saveUser: (user) => {
    if (user) {
      localStorage.setItem(KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.USER);
    }
  },

  getTheme: () => {
    return localStorage.getItem(KEYS.THEME) || 'light';
  },
  saveTheme: (theme) => {
    localStorage.setItem(KEYS.THEME, theme);
  },

  clearAll: () => {
    localStorage.removeItem(KEYS.WORKSPACES);
    localStorage.removeItem(KEYS.ACTIVE_WORKSPACE_ID);
    localStorage.removeItem(KEYS.PROJECTS);
    localStorage.removeItem(KEYS.TASKS);
    localStorage.removeItem(KEYS.DAILY_LOGS);
    localStorage.removeItem(KEYS.ACTIVITIES);
    localStorage.removeItem(KEYS.USER);
  },
};

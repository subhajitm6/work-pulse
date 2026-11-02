import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { storage } from '../lib/storage';
import { api } from '../lib/api';
import { DEFAULT_WORKSPACE_ID } from '../data/initialData';
import { useAuth } from './AuthContext';

const AppContext = createContext();

export function AppProvider({ children }) {
  const { currentUser } = useAuth();

  // Workspaces State
  const [workspaces, setWorkspaces] = useState(() => storage.getWorkspaces());
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(() => storage.getActiveWorkspaceId(workspaces));

  // Active Workspace
  const activeWorkspace = useMemo(() => {
    const found = workspaces.find((w) => w.id === activeWorkspaceId);
    return found || workspaces[0] || { id: DEFAULT_WORKSPACE_ID, name: 'My Workspace', color: '#5B5FEF', icon: 'Briefcase' };
  }, [workspaces, activeWorkspaceId]);

  // Master Data Collections
  const [projects, setProjects] = useState(() => storage.getProjects(activeWorkspace.id));
  const [tasks, setTasks] = useState(() => storage.getTasks(activeWorkspace.id));
  const [dailyLogs, setDailyLogs] = useState(() => storage.getDailyLogs(activeWorkspace.id));
  const [activities, setActivities] = useState(() => storage.getActivities(activeWorkspace.id));
  const [user, setUser] = useState(() => storage.getUser() || currentUser || {
    name: 'User',
    email: 'user@workpulse.app',
    role: 'Product Engineer',
    avatar: '/avatars/avatar-1.svg',
    workspace: 'My Workspace'
  });

  // Sync user state whenever currentUser updates from AuthContext
  useEffect(() => {
    if (currentUser) {
      setUser((prev) => ({
        ...prev,
        ...currentUser,
        avatar: currentUser.avatar || prev?.avatar || '/avatars/avatar-1.svg',
      }));
    }
  }, [currentUser]);

  // UI States
  const [toasts, setToasts] = useState([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Toast notification helper
  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Synchronize with backend API whenever active workspace changes
  const refreshWorkspaceData = useCallback(async (wsId) => {
    try {
      // First ensure workspaces are loaded so we have a valid DB workspace
      const wsList = await api.getWorkspaces().catch(() => null);
      let currentWsId = wsId;

      if (Array.isArray(wsList) && wsList.length > 0) {
        setWorkspaces(wsList);
        if (!wsList.some((w) => w.id === currentWsId)) {
          currentWsId = wsList[0].id;
          setActiveWorkspaceId(currentWsId);
          storage.saveActiveWorkspaceId(currentWsId);
        }
      }

      const [backendTasks, backendProjects, backendLogs, backendActivities] = await Promise.allSettled([
        api.getTasks(),
        api.getProjects(),
        api.getDailyLogs(),
        api.getActivities(),
      ]);

      if (backendTasks.status === 'fulfilled' && Array.isArray(backendTasks.value)) {
        setTasks(backendTasks.value);
      }
      if (backendProjects.status === 'fulfilled' && Array.isArray(backendProjects.value)) {
        setProjects(backendProjects.value);
      }
      if (backendLogs.status === 'fulfilled' && Array.isArray(backendLogs.value)) {
        setDailyLogs(backendLogs.value);
      }
      if (backendActivities.status === 'fulfilled' && Array.isArray(backendActivities.value)) {
        setActivities(backendActivities.value);
      }
    } catch {
      // Backend error fallback
    }
  }, []);

  // Initial fetch and on workspace change or user auth change
  useEffect(() => {
    if (activeWorkspaceId) {
      storage.saveActiveWorkspaceId(activeWorkspaceId);
    }
    refreshWorkspaceData(activeWorkspaceId);
  }, [activeWorkspaceId, currentUser?.id, refreshWorkspaceData]);

  // Synchronize localStorage
  useEffect(() => {
    storage.saveWorkspaces(workspaces);
  }, [workspaces]);

  useEffect(() => {
    storage.saveActiveWorkspaceId(activeWorkspaceId);
  }, [activeWorkspaceId]);

  useEffect(() => {
    storage.saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    storage.saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    storage.saveDailyLogs(dailyLogs);
  }, [dailyLogs]);

  useEffect(() => {
    storage.saveActivities(activities);
  }, [activities]);

  useEffect(() => {
    storage.saveUser(user);
  }, [user]);

  // Activity helper
  const recordActivity = (type, title, target, wsId = activeWorkspace.id) => {
    const newAct = {
      id: 'act-' + Date.now(),
      workspaceId: wsId,
      type,
      title,
      timestamp: new Date().toISOString(),
      target,
    };
    setActivities((prev) => [newAct, ...prev.slice(0, 40)]);
  };

  // ================= WORKSPACE ACTIONS =================
  const selectWorkspace = (wsId) => {
    const target = workspaces.find((w) => w.id === wsId);
    if (!target) return;
    setActiveWorkspaceId(wsId);
    setUser((prev) => ({ ...prev, workspace: target.name }));
    addToast(`Switched to "${target.name}"`, 'info');
  };

  const addWorkspace = async ({ name, description = '', icon = 'Briefcase', color = '#5B5FEF' }) => {
    const trimmed = name.trim();
    if (workspaces.some((w) => w.name.toLowerCase() === trimmed.toLowerCase())) {
      throw new Error(`A workspace named "${trimmed}" already exists.`);
    }

    try {
      const created = await api.createWorkspace({ name: trimmed, description, icon, color });
      setWorkspaces((prev) => [...prev, created]);
      setActiveWorkspaceId(created.id);
      setUser((prev) => ({ ...prev, workspace: created.name }));
      addToast(`Workspace "${created.name}" created`);
      return created;
    } catch {
      // Local fallback
      const newWs = {
        id: 'ws-' + Date.now(),
        name: trimmed,
        description: description.trim(),
        icon,
        color,
        createdAt: new Date().toISOString(),
      };
      setWorkspaces((prev) => [...prev, newWs]);
      setActiveWorkspaceId(newWs.id);
      setUser((prev) => ({ ...prev, workspace: newWs.name }));
      addToast(`Workspace "${newWs.name}" created`);
      return newWs;
    }
  };

  const updateWorkspace = async (id, updates) => {
    if (updates.name) {
      const trimmed = updates.name.trim();
      if (workspaces.some((w) => w.id !== id && w.name.toLowerCase() === trimmed.toLowerCase())) {
        throw new Error(`Another workspace named "${trimmed}" already exists.`);
      }
      updates.name = trimmed;
    }

    try {
      const updated = await api.updateWorkspace(id, updates);
      setWorkspaces((prev) => prev.map((w) => (w.id === id ? { ...w, ...updated } : w)));
    } catch {
      setWorkspaces((prev) => prev.map((w) => (w.id === id ? { ...w, ...updates } : w)));
    }

    if (id === activeWorkspaceId && updates.name) {
      setUser((prev) => ({ ...prev, workspace: updates.name }));
    }
    addToast('Workspace updated');
  };

  const deleteWorkspace = async (id) => {
    if (id === DEFAULT_WORKSPACE_ID) {
      throw new Error('"My Workspace" is the default workspace and cannot be deleted.');
    }

    if (workspaces.length <= 1) {
      throw new Error('You cannot delete the only remaining workspace.');
    }

    const wsToDelete = workspaces.find((w) => w.id === id);
    const remaining = workspaces.filter((w) => w.id !== id);

    try {
      await api.deleteWorkspace(id);
    } catch {
      // local fallback
    }

    setWorkspaces(remaining);
    setProjects((prev) => prev.filter((p) => p.workspaceId !== id && p.workspace_id !== id));
    setTasks((prev) => prev.filter((t) => t.workspaceId !== id && t.workspace_id !== id));
    setDailyLogs((prev) => prev.filter((l) => l.workspaceId !== id && l.workspace_id !== id));
    setActivities((prev) => prev.filter((a) => a.workspaceId !== id && a.workspace_id !== id));

    if (activeWorkspaceId === id) {
      const nextWs = remaining.find((w) => w.id === DEFAULT_WORKSPACE_ID) || remaining[0];
      setActiveWorkspaceId(nextWs.id);
      setUser((prev) => ({ ...prev, workspace: nextWs.name }));
    }

    addToast(`Workspace "${wsToDelete?.name || ''}" and its records removed`, 'info');
  };

  // ================= SCOPED SELECTORS =================
  const activeWorkspaceTasks = useMemo(() => {
    return tasks.filter((t) => (t.workspaceId || t.workspace_id) === activeWorkspace.id);
  }, [tasks, activeWorkspace.id]);

  const activeWorkspaceProjects = useMemo(() => {
    return projects.filter((p) => (p.workspaceId || p.workspace_id) === activeWorkspace.id);
  }, [projects, activeWorkspace.id]);

  const activeWorkspaceDailyLogs = useMemo(() => {
    return dailyLogs.filter((l) => (l.workspaceId || l.workspace_id) === activeWorkspace.id);
  }, [dailyLogs, activeWorkspace.id]);

  const activeWorkspaceActivities = useMemo(() => {
    return activities.filter((a) => (a.workspaceId || a.workspace_id) === activeWorkspace.id);
  }, [activities, activeWorkspace.id]);

  // ================= TASK ACTIONS =================
  const addTask = async (taskData) => {
    const payload = {
      ...taskData,
      project_id: taskData.projectId || taskData.project_id || null,
      workspace_id: activeWorkspace.id,
      estimated_minutes: taskData.estimatedMinutes || taskData.estimated_minutes || 0,
      actual_minutes: taskData.actualMinutes || taskData.actual_minutes || 0,
    };

    try {
      const created = await api.createTask(payload);
      setTasks((prev) => [created, ...prev]);
      recordActivity('task_created', `Created task "${created.title}"`, created.id);
      addToast('Task created successfully');
      return created;
    } catch (err) {
      console.error('[addTask Error]', err);
      addToast(err.message || 'Failed to save task to database', 'error');
      throw err;
    }
  };

  const updateTask = async (id, updates) => {
    const payload = {
      ...updates,
      project_id: updates.projectId !== undefined ? updates.projectId : updates.project_id,
      estimated_minutes: updates.estimatedMinutes !== undefined ? updates.estimatedMinutes : updates.estimated_minutes,
      actual_minutes: updates.actualMinutes !== undefined ? updates.actualMinutes : updates.actual_minutes,
    };

    try {
      const updated = await api.updateTask(id, payload);
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
    } catch (err) {
      console.error('[updateTask Error]', err);
      addToast(err.message || 'Failed to update task in database', 'error');
      throw err;
    }

    const task = tasks.find((t) => t.id === id);
    if (updates.status === 'Done') {
      recordActivity('task_completed', `Completed "${task ? task.title : 'Task'}"`, id);
      addToast('Task marked complete');
    } else {
      const taskTitle = updates.title || (task ? task.title : 'Task');
      recordActivity('task_updated', `Updated task "${taskTitle}"`, id);
      addToast('Task updated');
    }
  };

  const deleteTask = async (id) => {
    const taskToDelete = tasks.find((t) => t.id === id);
    try {
      await api.deleteTask(id);
    } catch (err) {
      console.error('[deleteTask Error]', err);
      addToast(err.message || 'Failed to delete task in database', 'error');
      throw err;
    }

    setTasks((prev) => prev.filter((t) => t.id !== id));
    setDailyLogs((prev) =>
      prev.map((log) => ({
        ...log,
        taskIds: log.taskIds ? log.taskIds.filter((tid) => tid !== id) : [],
        task_ids: log.task_ids ? log.task_ids.filter((tid) => tid !== id) : [],
      }))
    );
    recordActivity('task_deleted', `Deleted task "${taskToDelete ? taskToDelete.title : id}"`, id);
    addToast('Task deleted', 'info');
  };

  const toggleTaskCompletion = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const nextStatus = task.status === 'Done' ? 'In Progress' : 'Done';
    updateTask(id, { status: nextStatus }).catch(() => {});
  };

  // ================= PROJECT ACTIONS =================
  const addProject = async (projectData) => {
    const payload = {
      ...projectData,
      start_date: projectData.startDate || projectData.start_date,
      workspace_id: activeWorkspace.id,
    };

    try {
      const created = await api.createProject(payload);
      setProjects((prev) => [created, ...prev]);
      recordActivity('project_created', `Created project "${created.name}"`, created.id);
      addToast('Project created successfully');
      return created;
    } catch (err) {
      console.error('[addProject Error]', err);
      addToast(err.message || 'Failed to save project to database', 'error');
      throw err;
    }
  };

  const updateProject = async (id, updates) => {
    const payload = {
      ...updates,
      start_date: updates.startDate !== undefined ? updates.startDate : updates.start_date,
    };

    try {
      const updated = await api.updateProject(id, payload);
      setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
    } catch (err) {
      console.error('[updateProject Error]', err);
      addToast(err.message || 'Failed to update project in database', 'error');
      throw err;
    }
    recordActivity('project_updated', `Updated project "${updates.name || 'details'}"`, id);
    addToast('Project updated');
  };

  const deleteProject = async (id) => {
    const proj = projects.find((p) => p.id === id);
    try {
      await api.deleteProject(id);
    } catch (err) {
      console.error('[deleteProject Error]', err);
      addToast(err.message || 'Failed to delete project from database', 'error');
      throw err;
    }

    // Cascade delete related tasks
    setTasks((prev) =>
      prev.filter((t) => t.projectId !== id && t.project_id !== id)
    );
    setProjects((prev) => prev.filter((p) => p.id !== id));
    recordActivity('project_deleted', `Deleted project "${proj ? proj.name : id}"`, id);
    addToast('Project and its related tasks deleted', 'info');
  };

  // ================= DAILY LOG ACTIONS =================
  const addDailyLog = async (logData) => {
    const payload = {
      ...logData,
      workspace_id: activeWorkspace.id,
      worked_on: logData.workedOn || logData.worked_on,
      notes_for_tomorrow: logData.notesForTomorrow || logData.notes_for_tomorrow,
      total_minutes: logData.totalMinutes || logData.total_minutes || 0,
      task_ids: logData.taskIds || logData.task_ids || [],
    };

    try {
      const created = await api.createDailyLog(payload);
      setDailyLogs((prev) => [created, ...prev]);
      recordActivity('log_added', `Logged daily entry for ${created.date}`, created.id);
      addToast('Daily log saved');
      return created;
    } catch (err) {
      console.error('[addDailyLog Error]', err);
      addToast(err.message || 'Failed to save daily log to database', 'error');
      throw err;
    }
  };

  const updateDailyLog = async (id, updates) => {
    const payload = {
      ...updates,
      worked_on: updates.workedOn !== undefined ? updates.workedOn : updates.worked_on,
      notes_for_tomorrow: updates.notesForTomorrow !== undefined ? updates.notesForTomorrow : updates.notes_for_tomorrow,
      total_minutes: updates.totalMinutes !== undefined ? updates.totalMinutes : updates.total_minutes,
      task_ids: updates.taskIds !== undefined ? updates.taskIds : updates.task_ids,
    };

    try {
      const updated = await api.updateDailyLog(id, payload);
      setDailyLogs((prev) => prev.map((l) => (l.id === id ? { ...l, ...updated } : l)));
    } catch (err) {
      console.error('[updateDailyLog Error]', err);
      addToast(err.message || 'Failed to update daily log in database', 'error');
      throw err;
    }
    addToast('Daily log updated');
  };

  const deleteDailyLog = async (id) => {
    try {
      await api.deleteDailyLog(id);
    } catch (err) {
      console.error('[deleteDailyLog Error]', err);
      addToast(err.message || 'Failed to delete daily log from database', 'error');
      throw err;
    }
    setDailyLogs((prev) => prev.filter((l) => l.id !== id));
    addToast('Daily log deleted', 'info');
  };

  // Quick Create Modal controller
  const openCreateTaskModal = (initialData = null) => {
    setEditingTask(initialData);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(false);
  };

  // Reset to empty / fresh workspace data from backend
  const resetDemoData = async () => {
    storage.clearAll();
    await refreshWorkspaceData(activeWorkspaceId);
    addToast('Data refreshed from database', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        workspaces,
        activeWorkspaceId,
        activeWorkspace,
        selectWorkspace,
        addWorkspace,
        updateWorkspace,
        deleteWorkspace,

        projects: activeWorkspaceProjects,
        tasks: activeWorkspaceTasks,
        dailyLogs: activeWorkspaceDailyLogs,
        activities: activeWorkspaceActivities,

        allProjects: projects,
        allTasks: tasks,

        user,
        toasts,
        isTaskModalOpen,
        editingTask,
        searchQuery,
        setSearchQuery,
        openCreateTaskModal,
        closeTaskModal,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        addProject,
        updateProject,
        deleteProject,
        addDailyLog,
        updateDailyLog,
        deleteDailyLog,
        addToast,
        removeToast,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

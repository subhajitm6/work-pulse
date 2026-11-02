import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, 
  List, 
  Columns, 
  Filter, 
  ArrowUpDown, 
  Search,
  CheckCircle2
} from 'lucide-react';
import { TaskRow, TaskCard } from '../components/tasks/TaskComponents';
import { EmptyState } from '../components/ui/Primitives';
import { isToday, isPastDate } from '../lib/utils';

export function TasksPage() {
  const { tasks, projects, openCreateTaskModal, searchQuery, setSearchQuery } = useApp();

  const [viewMode, setViewMode] = useState('list'); // 'list' | 'kanban'
  const [filterTab, setFilterTab] = useState('all'); // all, today, upcoming, overdue, completed
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate'); // dueDate, priority, title

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(q);
        const matchesDesc = (task.description || '').toLowerCase().includes(q);
        const matchesTag = (task.tags || []).some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesTag) return false;
      }

      // Tab filter
      if (filterTab === 'today') {
        if (!isToday(task.dueDate)) return false;
      } else if (filterTab === 'upcoming') {
        if (!task.dueDate || isPastDate(task.dueDate) || task.status === 'Done') return false;
      } else if (filterTab === 'overdue') {
        if (!task.dueDate || !isPastDate(task.dueDate) || isToday(task.dueDate) || task.status === 'Done') return false;
      } else if (filterTab === 'completed') {
        if (task.status !== 'Done') return false;
      }

      // Project filter
      if (selectedProject !== 'all') {
        if (task.projectId !== selectedProject) return false;
      }

      // Priority filter
      if (selectedPriority !== 'all') {
        if (task.priority !== selectedPriority) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (sortBy === 'priority') {
        const order = { Urgent: 0, High: 1, Medium: 2, Low: 3 };
        return order[a.priority] - order[b.priority];
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [tasks, searchQuery, filterTab, selectedProject, selectedPriority, sortBy]);

  // Kanban column buckets
  const todoTasks = filteredTasks.filter(t => t.status === 'To Do');
  const inProgressTasks = filteredTasks.filter(t => t.status === 'In Progress');
  const doneTasks = filteredTasks.filter(t => t.status === 'Done');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Tasks
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your daily workflow, sprint backlogs, and track statuses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Columns className="w-4 h-4" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
          </div>

          <button
            onClick={() => openCreateTaskModal()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {[
          { key: 'all', label: 'All Tasks' },
          { key: 'today', label: 'Today' },
          { key: 'upcoming', label: 'Upcoming' },
          { key: 'overdue', label: 'Overdue' },
          { key: 'completed', label: 'Completed' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilterTab(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
              filterTab === tab.key
                ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter Controls Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Project Selector */}
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="text-xs bg-white dark:bg-[#181A1F] border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="all">All Projects</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        {/* Priority Selector */}
        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          className="text-xs bg-white dark:bg-[#181A1F] border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="all">All Priorities</option>
          <option value="Urgent">Urgent</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        {/* Sort Selector */}
        <div className="flex items-center gap-1.5 ml-auto text-xs text-slate-500">
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs bg-white dark:bg-[#181A1F] border border-slate-200/80 dark:border-slate-800 rounded-xl px-2.5 py-1 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>

      {/* Views */}
      {viewMode === 'list' ? (
        <div className="space-y-2.5">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <TaskRow key={task.id} task={task} />
            ))
          ) : (
            <EmptyState
              icon={CheckCircle2}
              title="No tasks found"
              description="No tasks match the active filters or search terms."
              action={
                <button
                  onClick={() => openCreateTaskModal()}
                  className="mt-2 text-xs text-brand-500 font-medium hover:underline"
                >
                  Create a new task
                </button>
              }
            />
          )}
        </div>
      ) : (
        /* Kanban Board View */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* To Do Column */}
          <div className="space-y-3 bg-slate-50/70 dark:bg-slate-900/30 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                To Do ({todoTasks.length})
              </span>
              <button
                onClick={() => openCreateTaskModal({ status: 'To Do' })}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-3 min-h-[200px]">
              {todoTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="space-y-3 bg-slate-50/70 dark:bg-slate-900/30 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                In Progress ({inProgressTasks.length})
              </span>
              <button
                onClick={() => openCreateTaskModal({ status: 'In Progress' })}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-3 min-h-[200px]">
              {inProgressTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>

          {/* Done Column */}
          <div className="space-y-3 bg-slate-50/70 dark:bg-slate-900/30 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
                Done ({doneTasks.length})
              </span>
              <button
                onClick={() => openCreateTaskModal({ status: 'Done' })}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-3 min-h-[200px]">
              {doneTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


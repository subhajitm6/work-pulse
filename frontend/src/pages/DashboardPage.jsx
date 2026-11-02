import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Plus, 
  Calendar, 
  ArrowRight,
  FolderKanban,
  Activity
} from 'lucide-react';
import { calculateDashboardMetrics, calculateProjectProgress, generateDailyCompletedChart } from '../lib/analytics';
import { TaskRow } from '../components/tasks/TaskComponents';
import { ProgressBar, EmptyState } from '../components/ui/Primitives';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { isToday } from '../lib/utils';
import { useTheme } from '../context/ThemeContext';

export function DashboardPage() {
  const { user, tasks, projects, activities, openCreateTaskModal } = useApp();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const metrics = calculateDashboardMetrics(tasks);
  const chartData = generateDailyCompletedChart(tasks);

  // Today's priorities: tasks due today or high/urgent priority, not done first
  const todayPriorities = tasks
    .filter(t => (isToday(t.dueDate) || t.priority === 'High' || t.priority === 'Urgent'))
    .sort((a, b) => {
      if (a.status === 'Done' && b.status !== 'Done') return 1;
      if (a.status !== 'Done' && b.status === 'Done') return -1;
      return 0;
    })
    .slice(0, 5);

  const activeProjects = projects.filter(p => p.status !== 'Completed').slice(0, 4);

  const isDark = theme === 'dark';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#181A1F] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Good morning, {user.name.split(' ')[0]} 👋
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here's your work pulse and execution progress for today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => openCreateTaskModal()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white dark:bg-[#181A1F] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Active Tasks</span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-brand-500 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {metrics.activeTasksCount}
            </span>
            <span className="text-[11px] font-medium text-slate-400">In backlog & sprint</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-[#181A1F] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Completed (7d)</span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {metrics.completedThisWeekCount}
            </span>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">Shipped items</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-[#181A1F] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Overdue Tasks</span>
            <div className="p-2 bg-rose-50 dark:bg-rose-950/40 text-rose-500 rounded-xl">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {metrics.overdueCount}
            </span>
            <span className="text-[11px] font-medium text-rose-500">Needs review</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white dark:bg-[#181A1F] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Completion Rate</span>
            <div className="p-2 bg-purple-50 dark:bg-purple-950/40 text-purple-600 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {metrics.weeklyCompletionRate}%
            </span>
            <span className="text-[11px] font-medium text-purple-600 dark:text-purple-400">7-day efficiency</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Priorities & Active Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Priorities */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-500" />
              Today's Priorities
            </h3>
            <button
              onClick={() => navigate('/tasks')}
              className="text-xs font-medium text-brand-500 hover:text-brand-600 flex items-center gap-1 transition-colors"
            >
              View all tasks <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {todayPriorities.length > 0 ? (
              todayPriorities.map(task => (
                <TaskRow key={task.id} task={task} />
              ))
            ) : (
              <EmptyState
                icon={CheckCircle2}
                title="No urgent tasks due today"
                description="You are caught up on priority items. Pick tasks from your backlog or create a new one."
                action={
                  <button
                    onClick={() => openCreateTaskModal()}
                    className="mt-2 text-xs text-brand-500 font-medium hover:underline"
                  >
                    + Add a task
                  </button>
                }
              />
            )}
          </div>
        </div>

        {/* Right 1 Col: Active Projects Progress */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-emerald-500" />
              Project Progress
            </h3>
            <button
              onClick={() => navigate('/projects')}
              className="text-xs font-medium text-brand-500 hover:text-brand-600 flex items-center gap-1 transition-colors"
            >
              All projects <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white dark:bg-[#181A1F] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 space-y-4 shadow-xs">
            {activeProjects.map(proj => {
              const { total, completed, percentage } = calculateProjectProgress(proj.id, tasks);
              return (
                <div 
                  key={proj.id} 
                  onClick={() => navigate(`/projects/${proj.id}`)}
                  className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                      {proj.name}
                    </span>
                    <span className="font-medium text-slate-500 dark:text-slate-400">
                      {completed}/{total} ({percentage}%)
                    </span>
                  </div>
                  <ProgressBar progress={percentage} barColor={proj.color} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Weekly Activity Chart & Recent Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Weekly Completed Tasks Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#181A1F] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Weekly Task Velocity</h3>
              <p className="text-xs text-slate-400">Tasks completed per day over the last 7 days</p>
            </div>
            <button
              onClick={() => navigate('/analytics')}
              className="text-xs text-brand-500 hover:underline font-medium"
            >
              Detailed Analytics
            </button>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#2D3139' : '#F1F3F7'} vertical={false} />
                <XAxis 
                  dataKey="day" 
                  stroke={isDark ? '#9CA3AF' : '#737B89'} 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke={isDark ? '#9CA3AF' : '#737B89'} 
                  fontSize={11} 
                  allowDecimals={false} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
                  contentStyle={{
                    backgroundColor: isDark ? '#1C1E24' : '#FFFFFF',
                    borderColor: isDark ? '#2D3139' : '#E7EAF0',
                    borderRadius: '12px',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                  }}
                />
                <Bar dataKey="completed" fill="#5B5FEF" radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Recent Activity Stream */}
        <div className="bg-white dark:bg-[#181A1F] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-500" />
              Recent Activity
            </h3>
          </div>

          <div className="space-y-3.5 max-h-56 overflow-y-auto pr-1">
            {activities.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No recent activities yet.</p>
            ) : (
              activities.slice(0, 6).map(act => {
                const isCompleted = act.type === 'task_completed';
                const isUpdated = act.type === 'task_updated' || act.type === 'project_updated';
                const isDeleted = act.type?.includes('deleted');
                const dotColor = isCompleted
                  ? 'bg-emerald-500'
                  : isUpdated
                  ? 'bg-amber-500'
                  : isDeleted
                  ? 'bg-rose-500'
                  : 'bg-brand-500';

                return (
                  <div key={act.id} className="flex items-start gap-2.5 text-xs">
                    <div className={`w-2 h-2 rounded-full ${dotColor} mt-1.5 shrink-0`} />
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800 dark:text-slate-200 leading-snug truncate">
                        {act.title}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(act.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })} at{' '}
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, 
  Clock, 
  Target, 
  TrendingUp, 
  AlertCircle, 
  Sparkles,
  Calendar
} from 'lucide-react';
import { 
  calculateAnalyticsMetrics, 
  generateProductivityTrend, 
  generateEstimatedVsActual,
  getEfficiencyInsights
} from '../lib/analytics';
import { useTheme } from '../context/ThemeContext';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';

const STATUS_COLORS = {
  'To Do': '#94A3B8', // Slate
  'In Progress': '#5B5FEF', // Brand Indigo
  'Done': '#10B981', // Emerald
};

export function AnalyticsPage() {
  const { tasks } = useApp();
  const { theme } = useTheme();
  const [range, setRange] = useState(30); // 7, 30, 90 days

  const metrics = calculateAnalyticsMetrics(tasks, range);
  const trendData = generateProductivityTrend(tasks, range);
  const estVsActualData = generateEstimatedVsActual(tasks);
  const insights = getEfficiencyInsights(tasks);

  // Status distribution
  const statusCounts = [
    { name: 'To Do', value: tasks.filter(t => t.status === 'To Do').length },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'In Progress').length },
    { name: 'Done', value: tasks.filter(t => t.status === 'Done').length },
  ].filter(item => item.value > 0);

  const isDark = theme === 'dark';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header & Date Range Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Work Efficiency Analytics
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Evaluate output velocity, completion fidelity, and planning variance.
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto">
          {[
            { label: 'Last 7 Days', value: 7 },
            { label: 'Last 30 Days', value: 30 },
            { label: 'Last 90 Days', value: 90 },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setRange(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                range === opt.value
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white dark:bg-[#181A1F] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Tasks Completed</span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {metrics.tasksCompleted}
            </span>
            <span className="text-[11px] font-medium text-slate-400">In period</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white dark:bg-[#181A1F] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Task Completion Rate</span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-brand-500 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {metrics.completionRate !== '—' ? `${metrics.completionRate}%` : '—'}
            </span>
            <span className="text-[11px] font-medium text-brand-500">Shipped vs total</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white dark:bg-[#181A1F] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>On-Time Completion Rate</span>
            <div className="p-2 bg-purple-50 dark:bg-purple-950/40 text-purple-600 rounded-xl">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {metrics.onTimeRate !== '—' ? `${metrics.onTimeRate}%` : '—'}
            </span>
            <span className="text-[11px] font-medium text-purple-500">Met deadline</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white dark:bg-[#181A1F] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Avg Completion Time</span>
            <div className="p-2 bg-amber-50 dark:bg-amber-950/40 text-amber-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {metrics.avgCompletionMinutes !== '—' ? `${metrics.avgCompletionMinutes}m` : '—'}
            </span>
            <span className="text-[11px] font-medium text-amber-600">Per logged task</span>
          </div>
        </div>
      </div>

      {/* Row 1 Charts: Productivity Trend & Status Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Line */}
        <div className="lg:col-span-2 bg-white dark:bg-[#181A1F] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Productivity & Output Trend
          </h3>
          <p className="text-xs text-slate-400">Total completed tasks across consecutive time windows</p>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#2D3139' : '#F1F3F7'} vertical={false} />
                <XAxis dataKey="date" stroke={isDark ? '#9CA3AF' : '#737B89'} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={isDark ? '#9CA3AF' : '#737B89'} fontSize={11} allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDark ? '#1C1E24' : '#FFFFFF',
                    borderColor: isDark ? '#2D3139' : '#E7EAF0',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Line type="monotone" dataKey="completed" stroke="#5B5FEF" strokeWidth={3} dot={{ r: 4, fill: '#5B5FEF' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Donut */}
        <div className="bg-white dark:bg-[#181A1F] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Task Status Distribution
            </h3>
            <p className="text-xs text-slate-400">Current allocation across workflow columns</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusCounts}
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusCounts.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#5B5FEF'} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDark ? '#1C1E24' : '#FFFFFF',
                    borderColor: isDark ? '#2D3139' : '#E7EAF0',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs">
            {statusCounts.map(item => (
              <div key={item.name} className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[item.name] }} />
                <span className="text-slate-600 dark:text-slate-300">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Estimated vs Actual Hours & Efficiency Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Estimated vs Actual Bar */}
        <div className="lg:col-span-2 bg-white dark:bg-[#181A1F] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Estimated vs. Actual Duration (Hours)
          </h3>
          <p className="text-xs text-slate-400">Comparing expected sprint estimation against recorded time</p>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={estVsActualData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#2D3139' : '#F1F3F7'} vertical={false} />
                <XAxis dataKey="name" stroke={isDark ? '#9CA3AF' : '#737B89'} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={isDark ? '#9CA3AF' : '#737B89'} fontSize={11} tickLine={false} axisLine={false} unit="h" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDark ? '#1C1E24' : '#FFFFFF',
                    borderColor: isDark ? '#2D3139' : '#E7EAF0',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="estimated" name="Estimated Hours" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" name="Actual Hours" fill="#5B5FEF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rule-Based Efficiency Insights */}
        <div className="bg-white dark:bg-[#181A1F] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-500" />
            Efficiency Insights
          </h3>
          <p className="text-xs text-slate-400">Deterministic observations based on your task logs</p>

          <div className="space-y-3 pt-2">
            {insights.map((insight, idx) => (
              <div 
                key={idx}
                className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-xs text-slate-700 dark:text-slate-300 leading-relaxed"
              >
                {insight.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


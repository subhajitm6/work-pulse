import React from 'react';
import { cn } from '../../lib/utils';

export function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200/60 dark:border-slate-700',
    // Priority
    Low: 'bg-slate-100 text-slate-600 dark:bg-slate-800/80 dark:text-slate-300 border-slate-200/50 dark:border-slate-700',
    Medium: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200/60 dark:border-blue-900/40',
    High: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/60 dark:border-amber-900/40',
    Urgent: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200/60 dark:border-rose-900/40',
    // Status
    'To Do': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    'In Progress': 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900/40',
    'Done': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/40',
    'Completed': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/40',
    'Planning': 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-900/40',
    'On Hold': 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 border-orange-200 dark:border-orange-900/40',
  };

  const currentVariant = variants[variant] || variants.default;

  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border tracking-wide transition-colors',
      currentVariant,
      className
    )}>
      {children}
    </span>
  );
}

export function ProgressBar({ progress = 0, className, barColor }) {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <div className={cn('w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden', className)}>
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{
          width: `${clamped}%`,
          backgroundColor: barColor || '#5B5FEF'
        }}
      />
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#181A1F]/30">
      {Icon && (
        <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-xs border border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 mb-3">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">{title}</h4>
      {description && <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-4">{description}</p>}
      {action && action}
    </div>
  );
}


import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map(toast => {
        let icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
        let borderColor = 'border-emerald-500/20';

        if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
          borderColor = 'border-rose-500/20';
        } else if (toast.type === 'info') {
          icon = <Info className="w-5 h-5 text-brand-500 shrink-0" />;
          borderColor = 'border-brand-500/20';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-[#1E2025] rounded-xl border ${borderColor} shadow-lg shadow-black/5 dark:shadow-black/20 text-sm font-medium text-slate-800 dark:text-slate-100 transition-all duration-200 animate-in slide-in-from-bottom-2`}
          >
            <div className="flex items-center gap-2.5">
              {icon}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}


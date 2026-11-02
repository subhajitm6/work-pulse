import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion, Home } from 'lucide-react';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-4 text-slate-500">
        <FileQuestion className="w-10 h-10" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Page Not Found</h2>
      <p className="text-xs text-slate-500 max-w-sm mb-6">
        The page you are looking for doesn't exist or has been moved to another path.
      </p>
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </button>
    </div>
  );
}


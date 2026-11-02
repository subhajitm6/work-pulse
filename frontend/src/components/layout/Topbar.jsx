import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Plus, 
  Bell, 
  Menu, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/tasks': 'My Tasks',
  '/projects': 'Projects',
  '/analytics': 'Analytics',
  '/daily-log': 'Daily Work Log',
  '/settings': 'Settings',
};

export function Topbar({ onOpenMobileMenu }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, openCreateTaskModal, activities, user } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  // Derive title from pathname
  const currentTitle = PAGE_TITLES[location.pathname] || 
    (location.pathname.startsWith('/projects/') ? 'Project Details' : 'WorkPulse');

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-[#15171B]/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {currentTitle}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search input with shortcut hint */}
        <div className="relative hidden md:block w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks, projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-2xs font-mono pointer-events-none">
            ⌘K
          </kbd>
        </div>

        {/* Quick Create Button */}
        <button
          onClick={() => openCreateTaskModal()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Task</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            title="Notifications & Activity"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-brand-500 absolute top-1.5 right-1.5 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {showNotifications && (
            <div 
              className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[#181A1F] border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl py-3 z-30 animate-in fade-in-50 zoom-in-95"
              onMouseLeave={() => setShowNotifications(false)}
            >
              <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">Recent Notifications</span>
                <span className="text-[10px] text-slate-400">{activities.length} total</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                {activities.slice(0, 6).map((act) => (
                  <div key={act.id} className="px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                    <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-snug">{act.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User avatar */}
        <div 
          onClick={() => navigate('/settings')}
          className="cursor-pointer"
          title="Account settings"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-brand-500/30"
          />
        </div>
      </div>
    </header>
  );
}


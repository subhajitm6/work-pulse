import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { WorkspaceSwitcher } from '../workspaces/WorkspaceSwitcher';
import { 
  Activity, 
  LayoutDashboard, 
  CheckSquare, 
  FolderKanban, 
  BarChart2, 
  BookOpen, 
  Settings, 
  ChevronDown, 
  Moon, 
  Sun,
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'My Tasks', path: '/tasks', icon: CheckSquare },
  { name: 'Projects', path: '/projects', icon: FolderKanban },
  { name: 'Analytics', path: '/analytics', icon: BarChart2 },
  { name: 'Daily Log', path: '/daily-log', icon: BookOpen },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function Sidebar({ isCollapsed, setIsCollapsed }) {
  const { user, openCreateTaskModal } = useApp();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <aside className={`h-screen sticky top-0 flex flex-col justify-between border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#15171B] transition-all duration-300 z-30 select-none ${
      isCollapsed ? 'w-18' : 'w-64'
    }`}>
      {/* Top Section */}
      <div>
        {/* Branding header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800/80">
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 min-w-0 group cursor-pointer"
            title="Go to Dashboard"
          >
            {isCollapsed ? (
              <img
                src="/workpulse-icon.png"
                alt="WorkPulse"
                className="w-8 h-auto object-contain shrink-0 group-hover:scale-105 transition-transform"
              />
            ) : (
              <>
                <img
                  src="/workpulse-logo.png"
                  alt="WorkPulse"
                  className="h-8 w-auto object-contain dark:hidden group-hover:scale-102 transition-transform"
                />
                <img
                  src="/workpulse-logo-dark.png"
                  alt="WorkPulse"
                  className="h-8 w-auto object-contain hidden dark:block group-hover:scale-102 transition-transform"
                />
              </>
            )}
          </Link>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* Workspace selector */}
        <div className="px-3 py-2.5">
          <WorkspaceSwitcher isCollapsed={isCollapsed} />
        </div>

        {/* Quick Task Action */}
        <div className="px-3 mb-2">
          <button
            onClick={() => openCreateTaskModal()}
            className={`flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-xs transition-colors ${
              isCollapsed ? 'px-0' : ''
            }`}
            title="Create Task"
          >
            <Plus className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>New Task</span>}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
                title={item.name}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
        {/* Dark mode switch */}
        <button
          onClick={toggleTheme}
          className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              {!isCollapsed && <span>Light Mode</span>}
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-slate-500" />
              {!isCollapsed && <span>Dark Mode</span>}
            </>
          )}
        </button>

        {/* User Profile */}
        <div 
          onClick={() => navigate('/settings')}
          className={`flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-colors ${
            isCollapsed ? 'justify-center p-1' : ''
          }`}
          title="User profile settings"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
          />
          {!isCollapsed && (
            <div className="min-w-0 text-left">
              <p className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{user.role}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export function MobileDrawer({ isOpen, onClose }) {
  const { user, openCreateTaskModal } = useApp();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-72 bg-white dark:bg-[#15171B] h-full shadow-2xl flex flex-col justify-between p-4 z-10">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <Link
              to="/dashboard"
              onClick={onClose}
              className="flex items-center gap-2.5 group cursor-pointer"
              title="Go to Dashboard"
            >
              <img
                src="/workpulse-logo.png"
                alt="WorkPulse"
                className="h-8 w-auto object-contain dark:hidden group-hover:scale-102 transition-transform"
              />
              <img
                src="/workpulse-logo-dark.png"
                alt="WorkPulse"
                className="h-8 w-auto object-contain hidden dark:block group-hover:scale-102 transition-transform"
              />
            </Link>
          </div>

          <div className="pt-4 pb-2">
            <div className="mb-3">
              <WorkspaceSwitcher isCollapsed={false} />
            </div>
            <button
              onClick={() => {
                onClose();
                openCreateTaskModal();
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>
          </div>

          <nav className="space-y-1 mt-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 w-full px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <div 
            onClick={() => {
              onClose();
              navigate('/settings');
            }}
            className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{user.name}</p>
              <p className="text-[11px] text-slate-400 truncate">{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


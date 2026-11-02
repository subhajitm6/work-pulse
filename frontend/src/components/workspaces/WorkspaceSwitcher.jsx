import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ChevronDown, Check, Plus, Settings, Briefcase } from 'lucide-react';
import { getWorkspaceIconComponent } from './workspaceConstants';
import { WorkspaceModal } from './WorkspaceModal';
import { motion, AnimatePresence } from 'framer-motion';

export function WorkspaceSwitcher({ isCollapsed = false }) {
  const { workspaces, activeWorkspace, selectWorkspace } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const ActiveIcon = getWorkspaceIconComponent(activeWorkspace?.icon);

  return (
    <>
      <div ref={containerRef} className="relative w-full">
        {/* Switcher Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          className={`flex items-center justify-between w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/80 dark:bg-slate-900/60 dark:hover:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 font-medium transition-all group ${
            isCollapsed ? 'justify-center px-2' : ''
          }`}
          title={`Active Workspace: ${activeWorkspace?.name || 'Workspace'}`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-4 h-4 rounded-md flex items-center justify-center shrink-0 shadow-2xs text-white"
              style={{ backgroundColor: activeWorkspace?.color || '#5B5FEF' }}
            >
              <ActiveIcon className="w-2.5 h-2.5" />
            </div>
            {!isCollapsed && (
              <span className="truncate max-w-[130px] font-semibold text-slate-900 dark:text-slate-100">
                {activeWorkspace?.name || 'My Workspace'}
              </span>
            )}
          </div>

          {!isCollapsed && (
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          )}
        </button>

        {/* Dropdown Popover */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 top-full mt-1.5 w-60 bg-white dark:bg-[#181A1F] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl py-2 z-50 text-xs"
            >
              <div className="px-3 pb-1.5 mb-1 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
                  Switch Workspace
                </span>
              </div>

              {/* Workspaces List */}
              <div className="max-h-52 overflow-y-auto px-1 space-y-0.5">
                {workspaces.map((ws) => {
                  const IconComponent = getWorkspaceIconComponent(ws.icon);
                  const isCurrent = ws.id === activeWorkspace?.id;

                  return (
                    <button
                      key={ws.id}
                      type="button"
                      onClick={() => {
                        selectWorkspace(ws.id);
                        setIsOpen(false);
                      }}
                      className={`flex items-center justify-between w-full px-2.5 py-2 rounded-xl transition-colors ${
                        isCurrent
                          ? 'bg-brand-50/70 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-4 h-4 rounded-md flex items-center justify-center shrink-0 shadow-2xs text-white"
                          style={{ backgroundColor: ws.color }}
                        >
                          <IconComponent className="w-2.5 h-2.5" />
                        </div>
                        <span className="truncate">{ws.name}</span>
                      </div>

                      {isCurrent && <Check className="w-3.5 h-3.5 text-brand-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 mt-1 border-t border-slate-100 dark:border-slate-800/80 px-1 space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setIsCreateModalOpen(true);
                  }}
                  className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-slate-400" />
                  <span>Create workspace</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/settings#workspaces');
                  }}
                  className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Manage workspaces</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <WorkspaceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
}


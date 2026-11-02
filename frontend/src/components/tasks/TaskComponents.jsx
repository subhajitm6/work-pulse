import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Clock, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  Folder
} from 'lucide-react';
import { Badge } from '../ui/Primitives';
import { formatDate, formatDuration, isPastDate, isToday } from '../../lib/utils';
import { ConfirmDialog } from '../ui/Modal';

export function TaskRow({ task }) {
  const { toggleTaskCompletion, openCreateTaskModal, deleteTask, projects } = useApp();
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const isDone = task.status === 'Done';
  const project = projects.find(p => p.id === task.projectId);
  const isOverdue = !isDone && task.dueDate && isPastDate(task.dueDate) && !isToday(task.dueDate);

  return (
    <>
      <div className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border transition-all duration-150 ${
        isDone 
          ? 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-100 dark:border-slate-800/60 opacity-75' 
          : 'bg-white dark:bg-[#181A1F] border-slate-200/70 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
      }`}>
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <button
            onClick={() => toggleTaskCompletion(task.id)}
            className="mt-0.5 sm:mt-0 p-0.5 text-slate-400 hover:text-brand-500 transition-colors shrink-0"
            title={isDone ? 'Mark as in progress' : 'Mark as done'}
          >
            {isDone ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50 dark:fill-emerald-950/20" />
            ) : (
              <Circle className="w-5 h-5 text-slate-400 dark:text-slate-600 hover:text-brand-500" />
            )}
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-sm font-medium transition-all ${
                isDone 
                  ? 'line-through text-slate-400 dark:text-slate-500' 
                  : 'text-slate-900 dark:text-slate-100'
              }`}>
                {task.title}
              </span>
              {project && (
                <span 
                  className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: `${project.color}15`, color: project.color }}
                >
                  <Folder className="w-3 h-3" />
                  {project.name}
                </span>
              )}
            </div>

            {task.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                {task.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-end sm:self-center pl-8 sm:pl-0">
          {/* Priority */}
          <Badge variant={task.priority}>{task.priority}</Badge>

          {/* Status badge */}
          <Badge variant={task.status}>{task.status}</Badge>

          {/* Due date */}
          {task.dueDate && (
            <span className={`flex items-center gap-1 text-xs font-medium ${
              isOverdue ? 'text-rose-500 dark:text-rose-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
            }`}>
              <Calendar className="w-3.5 h-3.5" />
              {isToday(task.dueDate) ? 'Today' : formatDate(task.dueDate)}
            </span>
          )}

          {/* Duration */}
          {(task.estimatedMinutes > 0 || task.actualMinutes > 0) && (
            <span className="hidden md:flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              {task.actualMinutes > 0 ? formatDuration(task.actualMinutes) : formatDuration(task.estimatedMinutes)}
            </span>
          )}

          {/* Actions */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div 
                className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-[#1C1E24] border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-1 z-20 text-xs"
                onMouseLeave={() => setShowMenu(false)}
              >
                <button
                  onClick={() => {
                    setShowMenu(false);
                    openCreateTaskModal(task);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                  Edit Task
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowConfirmDelete(true);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={() => deleteTask(task.id)}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        confirmText="Delete Task"
      />
    </>
  );
}

export function TaskCard({ task }) {
  const { toggleTaskCompletion, openCreateTaskModal, deleteTask, updateTask, projects } = useApp();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const project = projects.find(p => p.id === task.projectId);
  const isDone = task.status === 'Done';
  const isOverdue = !isDone && task.dueDate && isPastDate(task.dueDate) && !isToday(task.dueDate);

  return (
    <>
      <div className="p-3.5 bg-white dark:bg-[#181A1F] rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2.5 min-w-0">
            <button
              onClick={() => toggleTaskCompletion(task.id)}
              className="mt-0.5 text-slate-400 hover:text-brand-500 transition-colors shrink-0"
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <Circle className="w-4 h-4 text-slate-400 dark:text-slate-600" />
              )}
            </button>
            <h5 
              onClick={() => openCreateTaskModal(task)}
              className={`text-xs font-medium cursor-pointer hover:text-brand-500 transition-colors leading-snug ${
                isDone ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'
              }`}
            >
              {task.title}
            </h5>
          </div>

          <button
            onClick={() => setShowConfirmDelete(true)}
            className="text-slate-300 hover:text-rose-500 transition-colors p-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {project && (
          <div 
            className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded font-medium"
            style={{ backgroundColor: `${project.color}15`, color: project.color }}
          >
            <Folder className="w-2.5 h-2.5" />
            {project.name}
          </div>
        )}

        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
          <div className="flex items-center gap-1.5">
            <Badge variant={task.priority} className="text-[10px] px-1.5 py-0">
              {task.priority}
            </Badge>

            {/* Quick status switch dropdown */}
            <select
              value={task.status}
              onChange={(e) => updateTask(task.id, { status: e.target.value })}
              className="text-[10px] bg-slate-100 dark:bg-slate-800 border-none rounded px-1.5 py-0.5 font-medium text-slate-600 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          {task.dueDate && (
            <span className={`flex items-center gap-1 ${
              isOverdue ? 'text-rose-500 font-semibold' : 'text-slate-400 dark:text-slate-500'
            }`}>
              <Calendar className="w-3 h-3" />
              {isToday(task.dueDate) ? 'Today' : formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={() => deleteTask(task.id)}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"?`}
      />
    </>
  );
}


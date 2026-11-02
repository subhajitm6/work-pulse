import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Folder, 
  Calendar, 
  CheckSquare, 
  MoreVertical, 
  Edit3, 
  Trash2,
  ArrowRight
} from 'lucide-react';
import { Badge, ProgressBar } from '../ui/Primitives';
import { formatDate, isPastDate } from '../../lib/utils';
import { calculateProjectProgress } from '../../lib/analytics';
import { ConfirmDialog } from '../ui/Modal';

export function ProjectCard({ project, onEdit }) {
  const navigate = useNavigate();
  const { tasks, deleteProject } = useApp();
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const { total, completed, percentage } = calculateProjectProgress(project.id, tasks);
  const isOverdue = project.status !== 'Completed' && project.deadline && isPastDate(project.deadline);

  return (
    <>
      <div 
        onClick={() => navigate(`/projects/${project.id}`)}
        className="group relative bg-white dark:bg-[#181A1F] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
      >
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div 
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                style={{ backgroundColor: `${project.color}20`, color: project.color }}
              >
                <Folder className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-brand-500 transition-colors">
                {project.name}
              </h3>
            </div>

            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              <Badge variant={project.status}>{project.status}</Badge>

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
                        onEdit(project);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                      Edit Project
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

          {/* Description */}
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            {project.description || 'No description provided.'}
          </p>
        </div>

        <div>
          {/* Progress Bar */}
          <div className="space-y-1.5 mb-4">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-500 dark:text-slate-400">Progress</span>
              <span className="text-slate-700 dark:text-slate-300 font-semibold">{percentage}%</span>
            </div>
            <ProgressBar progress={percentage} barColor={project.color} />
          </div>

          {/* Footer Metadata */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5" />
              {completed}/{total} tasks
            </span>

            {project.deadline && (
              <span className={`flex items-center gap-1 font-medium ${
                isOverdue ? 'text-rose-500 font-semibold' : ''
              }`}>
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(project.deadline)}
              </span>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={() => deleteProject(project.id)}
        title="Delete Project"
        message={`Are you sure you want to delete "${project.name}"? All tasks related to this project will also be deleted permanently.`}
      />
    </>
  );
}


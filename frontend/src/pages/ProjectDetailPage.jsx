import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  Calendar, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckSquare, 
  CheckCircle2 
} from 'lucide-react';
import { Badge, ProgressBar, EmptyState } from '../components/ui/Primitives';
import { TaskRow } from '../components/tasks/TaskComponents';
import { formatDate, isPastDate } from '../lib/utils';
import { calculateProjectProgress } from '../lib/analytics';
import { ProjectModal } from '../components/projects/ProjectModal';
import { ConfirmDialog } from '../components/ui/Modal';

export function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, tasks, deleteProject, openCreateTaskModal } = useApp();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="py-12 text-center space-y-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Project Not Found</h3>
        <p className="text-xs text-slate-500">The project you are looking for does not exist or was deleted.</p>
        <button
          onClick={() => navigate('/projects')}
          className="text-xs font-semibold text-brand-500 hover:underline"
        >
          ← Return to Projects
        </button>
      </div>
    );
  }

  const { total, completed, percentage } = calculateProjectProgress(project.id, tasks);
  const isOverdue = project.status !== 'Completed' && project.deadline && isPastDate(project.deadline);

  // Filter tasks belonging to this project
  const projectTasks = tasks.filter(t => {
    if (t.projectId !== project.id) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top back navigation */}
      <div>
        <button
          onClick={() => navigate('/projects')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Projects
        </button>
      </div>

      {/* Project Overview Card */}
      <div className="bg-white dark:bg-[#181A1F] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span 
                className="w-3.5 h-3.5 rounded-full" 
                style={{ backgroundColor: project.color }} 
              />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {project.name}
              </h2>
              <Badge variant={project.status}>{project.status}</Badge>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {project.description || 'No detailed description provided.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200/80 dark:border-slate-800"
              title="Edit Project"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors border border-slate-200/80 dark:border-slate-800"
              title="Delete Project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress and dates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-500">Progress</span>
              <span className="text-slate-900 dark:text-white font-bold">{percentage}%</span>
            </div>
            <ProgressBar progress={percentage} barColor={project.color} />
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
            <Calendar className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">Start Date</span>
              <span>{formatDate(project.startDate)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
            <Calendar className={`w-4 h-4 ${isOverdue ? 'text-rose-500' : 'text-slate-400'}`} />
            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">Target Deadline</span>
              <span className={isOverdue ? 'text-rose-500 font-bold' : ''}>
                {formatDate(project.deadline)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Project Tasks Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Project Tasks ({total})
            </h3>

            {/* Filter buttons */}
            <div className="flex items-center gap-1">
              {['all', 'To Do', 'In Progress', 'Done'].map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    statusFilter === s
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => openCreateTaskModal({ projectId: project.id })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task to Project</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {projectTasks.length > 0 ? (
            projectTasks.map(task => (
              <TaskRow key={task.id} task={task} />
            ))
          ) : (
            <EmptyState
              icon={CheckSquare}
              title="No tasks in this project"
              description="Start assigning tasks to track your milestone completion."
              action={
                <button
                  onClick={() => openCreateTaskModal({ projectId: project.id })}
                  className="mt-2 text-xs text-brand-500 font-medium hover:underline"
                >
                  + Add task now
                </button>
              }
            />
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <ProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        editingProject={project}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={() => {
          deleteProject(project.id);
          navigate('/projects');
        }}
        title="Delete Project"
        message={`Are you sure you want to delete "${project.name}"? All tasks related to this project will also be deleted permanently.`}
      />
    </div>
  );
}


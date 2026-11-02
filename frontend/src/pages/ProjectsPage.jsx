import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, 
  Folder, 
  LayoutGrid, 
  List, 
  Search,
  FolderKanban
} from 'lucide-react';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectModal } from '../components/projects/ProjectModal';
import { EmptyState } from '../components/ui/Primitives';

export function ProjectsPage() {
  const { projects } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = (p.description || '').toLowerCase().includes(q);
        if (!matchesName && !matchesDesc) return false;
      }
      return true;
    });
  }, [projects, statusFilter, searchTerm]);

  const handleOpenEdit = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Projects
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Organize roadmaps, team initiatives, and track milestone health.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Status filter buttons */}
          {['all', 'In Progress', 'Planning', 'On Hold', 'Completed'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>

        {/* Project search */}
        <div className="relative w-full sm:w-60">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-[#181A1F] border border-slate-200/80 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Grid of Projects */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onEdit={handleOpenEdit} 
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FolderKanban}
          title="No projects found"
          description="Try adjusting your status filter or create a new project."
          action={
            <button
              onClick={handleOpenCreate}
              className="mt-2 text-xs text-brand-500 font-medium hover:underline"
            >
              + Create Project
            </button>
          }
        />
      )}

      {/* Create / Edit Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingProject={editingProject}
      />
    </div>
  );
}


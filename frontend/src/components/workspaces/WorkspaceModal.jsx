import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { WORKSPACE_ICONS, WORKSPACE_COLORS } from './workspaceConstants';

export function WorkspaceModal({ isOpen, onClose, editingWorkspace = null }) {
  const { addWorkspace, updateWorkspace } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Briefcase');
  const [color, setColor] = useState(WORKSPACE_COLORS[0].hex);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingWorkspace) {
      setName(editingWorkspace.name || '');
      setDescription(editingWorkspace.description || '');
      setIcon(editingWorkspace.icon || 'Briefcase');
      setColor(editingWorkspace.color || WORKSPACE_COLORS[0].hex);
    } else {
      setName('');
      setDescription('');
      setIcon('Briefcase');
      setColor(WORKSPACE_COLORS[0].hex);
    }
    setError('');
  }, [editingWorkspace, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Workspace name is required');
      return;
    }

    try {
      if (editingWorkspace) {
        updateWorkspace(editingWorkspace.id, {
          name: name.trim(),
          description: description.trim(),
          icon,
          color,
        });
      } else {
        addWorkspace({
          name: name.trim(),
          description: description.trim(),
          icon,
          color,
        });
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save workspace');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingWorkspace ? 'Edit Workspace' : 'Create New Workspace'}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs rounded-xl">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Workspace Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Freelance, Side Projects"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Description (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="What kind of work will live in this workspace?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Color Indicator
          </label>
          <div className="flex items-center gap-2.5 pt-1">
            {WORKSPACE_COLORS.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => setColor(c.hex)}
                className={`w-7 h-7 rounded-xl transition-all ${
                  color === c.hex
                    ? 'scale-110 ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-[#181A1F]'
                    : 'hover:scale-105 opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Workspace Icon
          </label>
          <div className="grid grid-cols-4 gap-2 pt-1">
            {Object.entries(WORKSPACE_ICONS).map(([key, IconComp]) => {
              const isSelected = icon === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setIcon(key)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs transition-all ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold shadow-2xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <IconComp className="w-4 h-4 mb-1" />
                  <span className="text-[10px] truncate max-w-full">{key}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-sm font-medium rounded-xl bg-brand-500 hover:bg-brand-600 text-white shadow-sm transition-colors"
          >
            {editingWorkspace ? 'Save Changes' : 'Create Workspace'}
          </button>
        </div>
      </form>
    </Modal>
  );
}


import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BookOpen, 
  Plus, 
  Calendar, 
  Clock, 
  Trash2, 
  Edit3, 
  Folder, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { formatDate, formatDuration } from '../lib/utils';
import { Modal, ConfirmDialog } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/Primitives';

export function DailyLogPage() {
  const { dailyLogs, tasks, projects, addDailyLog, updateDailyLog, deleteDailyLog } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Form states
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [summary, setSummary] = useState('');
  const [workedOn, setWorkedOn] = useState('');
  const [accomplishments, setAccomplishments] = useState('');
  const [blockers, setBlockers] = useState('');
  const [notesForTomorrow, setNotesForTomorrow] = useState('');
  const [totalMinutes, setTotalMinutes] = useState('240');
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);

  // Weekly review calculations (last 7 days of logs)
  const now = new Date();
  const weekCutoff = new Date(now);
  weekCutoff.setDate(now.getDate() - 7);
  weekCutoff.setHours(0, 0, 0, 0);

  const recentLogs = dailyLogs.filter(l => new Date(l.date) >= weekCutoff);
  const weeklyRecordedTime = recentLogs.reduce((acc, l) => acc + (l.totalMinutes || 0), 0);
  
  // Weekly completed tasks linked or finished
  const weeklyLinkedTasks = Array.from(new Set(recentLogs.flatMap(l => l.taskIds || [])));
  const weeklyCompletedCount = tasks.filter(t => t.status === 'Done' && weeklyLinkedTasks.includes(t.id)).length;

  const handleOpenCreate = () => {
    setEditingLog(null);
    setLogDate(new Date().toISOString().split('T')[0]);
    setSummary('');
    setWorkedOn('');
    setAccomplishments('');
    setBlockers('');
    setNotesForTomorrow('');
    setTotalMinutes('240');
    setSelectedTaskIds([]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (log) => {
    setEditingLog(log);
    setLogDate(log.date || new Date().toISOString().split('T')[0]);
    setSummary(log.summary || '');
    setWorkedOn(log.workedOn || '');
    setAccomplishments(log.accomplishments || '');
    setBlockers(log.blockers || '');
    setNotesForTomorrow(log.notesForTomorrow || '');
    setTotalMinutes(log.totalMinutes ? String(log.totalMinutes) : '0');
    setSelectedTaskIds(log.taskIds || []);
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const payload = {
      date: logDate,
      summary: summary.trim(),
      workedOn: workedOn.trim(),
      accomplishments: accomplishments.trim(),
      blockers: blockers.trim(),
      notesForTomorrow: notesForTomorrow.trim(),
      totalMinutes: totalMinutes ? parseInt(totalMinutes, 10) : 0,
      taskIds: selectedTaskIds
    };

    if (editingLog && editingLog.id) {
      updateDailyLog(editingLog.id, payload);
    } else {
      addDailyLog(payload);
    }

    setIsModalOpen(false);
  };

  const toggleTaskLink = (taskId) => {
    setSelectedTaskIds(prev => 
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Daily Work Log
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Log time spent, accomplishments, blockers, and associate tasks completed.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Daily Entry</span>
        </button>
      </div>

      {/* Weekly Review Summary Card */}
      <div className="bg-white dark:bg-[#181A1F] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-500" />
            Weekly Summary (Last 7 Days)
          </h3>
          <span className="text-xs text-slate-400">{recentLogs.length} logs recorded</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
          <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500">Total Recorded Time</span>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              {formatDuration(weeklyRecordedTime)}
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500">Linked Completed Tasks</span>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {weeklyCompletedCount}
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500">Recent Highlights</span>
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-1 line-clamp-2">
              {recentLogs[0]?.accomplishments || 'Keep updating daily logs to trace achievements.'}
            </p>
          </div>
        </div>
      </div>

      {/* Chronological Daily Log Entries */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          History & Entries
        </h3>

        {dailyLogs.length > 0 ? (
          <div className="space-y-4">
            {dailyLogs.map(log => {
              const linkedTasks = tasks.filter(t => (log.taskIds || []).includes(t.id));

              return (
                <div 
                  key={log.id}
                  className="bg-white dark:bg-[#181A1F] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold rounded-lg flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(log.date)}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDuration(log.totalMinutes)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => handleOpenEdit(log)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Entry"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setDeletingId(log.id);
                          setShowConfirmDelete(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete Entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Summary */}
                  {log.summary && (
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {log.summary}
                    </p>
                  )}

                  {/* Log Content Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {log.workedOn && (
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/60">
                        <span className="font-semibold text-slate-500 block mb-1">What I Worked On:</span>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{log.workedOn}</p>
                      </div>
                    )}
                    {log.accomplishments && (
                      <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/60 dark:border-emerald-900/40">
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400 block mb-1">Accomplishments:</span>
                        <p className="text-emerald-900 dark:text-emerald-200 leading-relaxed">{log.accomplishments}</p>
                      </div>
                    )}
                    {log.blockers && (
                      <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100/60 dark:border-rose-900/40">
                        <span className="font-semibold text-rose-700 dark:text-rose-400 block mb-1">Blockers / Challenges:</span>
                        <p className="text-rose-900 dark:text-rose-200 leading-relaxed">{log.blockers}</p>
                      </div>
                    )}
                    {log.notesForTomorrow && (
                      <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/60 dark:border-indigo-900/40">
                        <span className="font-semibold text-indigo-700 dark:text-indigo-400 block mb-1">Notes for Tomorrow:</span>
                        <p className="text-indigo-900 dark:text-indigo-200 leading-relaxed">{log.notesForTomorrow}</p>
                      </div>
                    )}
                  </div>

                  {/* Linked Tasks */}
                  {linkedTasks.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[11px] font-semibold text-slate-400 block mb-2 uppercase tracking-wide">
                        Linked Tasks ({linkedTasks.length}):
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {linkedTasks.map(t => {
                          const proj = projects.find(p => p.id === t.projectId);
                          return (
                            <span 
                              key={t.id}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700"
                            >
                              {t.status === 'Done' ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                              )}
                              <span>{t.title}</span>
                              {proj && (
                                <span className="text-[10px] text-slate-400">({proj.name})</span>
                              )}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title="No daily logs yet"
            description="Take 2 minutes to summarize your work, victories, and plan for tomorrow."
            action={
              <button
                onClick={handleOpenCreate}
                className="mt-2 text-xs text-brand-500 font-medium hover:underline"
              >
                + Create first log
              </button>
            }
          />
        )}
      </div>

      {/* Create / Edit Daily Log Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingLog ? 'Edit Daily Work Log' : 'New Daily Work Log'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Log Date *
              </label>
              <input
                type="date"
                required
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Total Time Spent (minutes)
              </label>
              <input
                type="number"
                min="0"
                step="15"
                placeholder="e.g. 300"
                value={totalMinutes}
                onChange={(e) => setTotalMinutes(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Daily Summary
            </label>
            <input
              type="text"
              placeholder="High-level takeaway of your day"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              What I Worked On
            </label>
            <textarea
              rows={2}
              placeholder="Features worked on, bug investigations, meetings..."
              value={workedOn}
              onChange={(e) => setWorkedOn(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Key Accomplishments
              </label>
              <textarea
                rows={2}
                placeholder="Milestones hit, PRs merged, goals reached..."
                value={accomplishments}
                onChange={(e) => setAccomplishments(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Blockers or Challenges
              </label>
              <textarea
                rows={2}
                placeholder="What slowed you down or needs follow-up?"
                value={blockers}
                onChange={(e) => setBlockers(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Notes for Tomorrow
            </label>
            <textarea
              rows={2}
              placeholder="First priority to pick up in the morning..."
              value={notesForTomorrow}
              onChange={(e) => setNotesForTomorrow(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Associate Tasks */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Link Associated Tasks
            </label>
            <div className="max-h-36 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl p-2 space-y-1.5 bg-slate-50 dark:bg-slate-900">
              {tasks.map(t => {
                const isSelected = selectedTaskIds.includes(t.id);
                return (
                  <div
                    key={t.id}
                    onClick={() => toggleTaskLink(t.id)}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-xs transition-colors ${
                      isSelected 
                        ? 'bg-brand-50 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 font-medium' 
                        : 'hover:bg-slate-200/50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="rounded text-brand-500"
                    />
                    <span className="truncate">{t.title}</span>
                    <span className="text-[10px] text-slate-400 ml-auto shrink-0">{t.status}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium rounded-xl bg-brand-500 hover:bg-brand-600 text-white shadow-sm"
            >
              {editingLog ? 'Save Changes' : 'Save Daily Log'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={() => {
          if (deletingId) deleteDailyLog(deletingId);
        }}
        title="Delete Daily Log"
        message="Are you sure you want to delete this daily work log? This action cannot be undone."
      />
    </div>
  );
}


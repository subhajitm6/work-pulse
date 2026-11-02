import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  RotateCcw, 
  Moon, 
  Sun, 
  CheckCircle2, 
  Database, 
  ShieldCheck,
  Palette,
  LogOut,
  Briefcase,
  Plus,
  Edit3,
  Trash2,
  Check,
  Save,
  Sparkles
} from 'lucide-react';
import { ConfirmDialog } from '../components/ui/Modal';
import { WorkspaceModal } from '../components/workspaces/WorkspaceModal';
import { getWorkspaceIconComponent } from '../components/workspaces/workspaceConstants';
import { AVATAR_OPTIONS } from '../data/avatarOptions';
import { AvatarPickerModal } from '../components/profile/AvatarPickerModal';

export function SettingsPage() {
  const { 
    user, 
    workspaces, 
    activeWorkspace, 
    selectWorkspace, 
    deleteWorkspace,
    addToast
  } = useApp();
  const { theme, toggleTheme } = useTheme();
  const { logout, currentUser, updateProfile, deleteAccount } = useAuth();
  
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [showConfirmDeleteAccount, setShowConfirmDeleteAccount] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  
  // Workspace management state
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState(null);
  const [deletingWorkspace, setDeletingWorkspace] = useState(null);
  const [showConfirmDeleteWs, setShowConfirmDeleteWs] = useState(false);

  const displayUser = currentUser || user;

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [profileName, setProfileName] = useState(displayUser.name || '');
  const [profileRole, setProfileRole] = useState(displayUser.role || '');
  const [selectedAvatar, setSelectedAvatar] = useState(displayUser.avatar || AVATAR_OPTIONS[0].url);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const handleStartEdit = () => {
    setProfileName(displayUser.name || '');
    setProfileRole(displayUser.role || '');
    setSelectedAvatar(displayUser.avatar || AVATAR_OPTIONS[0].url);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profileName.trim()) {
      addToast('Name cannot be empty', 'error');
      return;
    }
    setIsSavingProfile(true);
    try {
      await updateProfile({
        name: profileName.trim(),
        role: profileRole.trim(),
        avatar: selectedAvatar,
      });
      setIsEditingProfile(false);
      addToast('Profile updated successfully!', 'success');
    } catch {
      addToast('Failed to update profile', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      await deleteAccount();
      addToast('Account deleted successfully.', 'info');
    } catch (err) {
      addToast(err.message || 'Failed to delete account', 'error');
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Settings
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your profile, chosen avatar, workspaces, and preferences.
        </p>
      </div>

      {/* User Profile Card */}
      <div className="bg-white dark:bg-[#181A1F] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <User className="w-4 h-4 text-brand-500" />
            Profile & Avatar
          </h3>

          <div className="flex items-center gap-2">
            {!isEditingProfile && (
              <button
                type="button"
                onClick={handleStartEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            )}

            <button
              onClick={() => setShowConfirmLogout(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {!isEditingProfile ? (
          <div className="flex items-center gap-4 pt-1">
            <div className="relative group cursor-pointer" onClick={() => setIsAvatarModalOpen(true)} title="Click to change avatar">
              <img
                src={displayUser.avatar || AVATAR_OPTIONS[0].url}
                alt={displayUser.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-500/20 bg-slate-100 dark:bg-slate-800 p-1 group-hover:opacity-85 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit3 className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{displayUser.name}</h4>
                <button
                  type="button"
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                >
                  Change Avatar
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{displayUser.email || 'user@workpulse.app'}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  {displayUser.role || 'Product Engineer'}
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Workspace: {displayUser.workspace || activeWorkspace?.name || 'My Workspace'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveProfile} className="space-y-4 pt-1">
            {/* Avatar Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                Choose an Avatar (8 options)
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
                {AVATAR_OPTIONS.map((avatar) => {
                  const isSelected = selectedAvatar === avatar.url;
                  return (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar.url)}
                      className={`relative p-1 rounded-2xl border-2 transition-all flex flex-col items-center group ${
                        isSelected
                          ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-500/10 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50'
                      }`}
                      title={avatar.label}
                    >
                      <img
                        src={avatar.url}
                        alt={avatar.label}
                        className="w-11 h-11 rounded-xl object-cover bg-white dark:bg-slate-800"
                      />
                      {isSelected && (
                        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-brand-500 text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-slate-100"
                  placeholder="e.g. Subhajit M"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Role / Title
                </label>
                <input
                  type="text"
                  value={profileRole}
                  onChange={(e) => setProfileRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-slate-100"
                  placeholder="e.g. Workspace Owner / Engineer"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingProfile}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSavingProfile ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Workspace Management Card */}
      <div id="workspaces" className="bg-white dark:bg-[#181A1F] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-brand-500" />
            Manage Workspaces
          </h3>
          <button
            type="button"
            onClick={() => {
              setEditingWorkspace(null);
              setIsWorkspaceModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Workspace</span>
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Workspaces strictly isolate your tasks, project roadmaps, daily work logs, and efficiency analytics.
        </p>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/80 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
          {workspaces.map((ws) => {
            const IconComp = getWorkspaceIconComponent(ws.icon);
            const isCurrent = ws.id === activeWorkspace?.id;

            return (
              <div
                key={ws.id}
                className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                  isCurrent ? 'bg-brand-50/40 dark:bg-brand-500/5' : 'hover:bg-slate-50/60 dark:hover:bg-slate-900/30'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white shadow-2xs"
                    style={{ backgroundColor: ws.color }}
                  >
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {ws.name}
                      </h4>
                      {isCurrent && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 shrink-0">
                          Active
                        </span>
                      )}
                    </div>
                    {ws.description && (
                      <p className="text-xs text-slate-400 truncate mt-0.5">{ws.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  {!isCurrent && (
                    <button
                      type="button"
                      onClick={() => selectWorkspace(ws.id)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      Switch
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setEditingWorkspace(ws);
                      setIsWorkspaceModalOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    title="Edit Workspace"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    disabled={workspaces.length <= 1}
                    onClick={() => {
                      setDeletingWorkspace(ws);
                      setShowConfirmDeleteWs(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title={workspaces.length <= 1 ? "Cannot delete the only workspace" : "Delete Workspace"}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Appearance Card */}
      <div className="bg-white dark:bg-[#181A1F] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Palette className="w-4 h-4 text-brand-500" />
          Appearance & Theme
        </h3>

        <div className="flex items-center justify-between pt-1">
          <div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Theme Mode</p>
            <p className="text-[11px] text-slate-400">
              Current active theme: <strong className="capitalize text-slate-700 dark:text-slate-300">{theme}</strong>
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-600" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Danger Zone: Delete Account */}
      <div className="bg-white dark:bg-[#181A1F] rounded-2xl border border-rose-200/80 dark:border-rose-900/50 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-rose-500" />
          Danger Zone
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Delete Account</p>
            <p className="text-[11px] text-slate-400">
              Permanently delete your profile, owned workspaces, tasks, projects, and work logs. This action cannot be undone.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowConfirmDeleteAccount(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto shrink-0"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

      {/* App Information Card */}
      <div className="bg-white dark:bg-[#181A1F] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-2 text-xs text-slate-500">
        <p className="font-semibold text-slate-700 dark:text-slate-300">WorkPulse v1.0.0</p>
        <p>Minimal work management & productivity dashboard connected to PostgreSQL.</p>
      </div>

      {/* Workspace Create/Edit Modal */}
      <WorkspaceModal
        isOpen={isWorkspaceModalOpen}
        onClose={() => {
          setIsWorkspaceModalOpen(false);
          setEditingWorkspace(null);
        }}
        workspace={editingWorkspace}
      />

      {/* Delete Workspace Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDeleteWs}
        onClose={() => {
          setShowConfirmDeleteWs(false);
          setDeletingWorkspace(null);
        }}
        onConfirm={async () => {
          if (deletingWorkspace) {
            await deleteWorkspace(deletingWorkspace.id);
            setDeletingWorkspace(null);
          }
        }}
        title="Delete Workspace"
        message={`Are you sure you want to delete "${deletingWorkspace?.name}"? All associated tasks, projects, and logs in this workspace will be removed.`}
        confirmText="Delete Workspace"
      />

      {/* Avatar Picker Modal */}
      <AvatarPickerModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
      />

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirmLogout}
        onClose={() => setShowConfirmLogout(false)}
        onConfirm={logout}
        title="Sign Out"
        message="Are you sure you want to sign out?"
        confirmText="Sign Out"
        isDestructive={false}
      />

      {/* Delete Account Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDeleteAccount}
        onClose={() => setShowConfirmDeleteAccount(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Your Account"
        message="Are you sure you want to permanently delete your account? All workspaces, projects, tasks, and daily work logs will be erased from the database forever."
        confirmText={isDeletingAccount ? "Deleting..." : "Permanently Delete"}
        isDestructive={true}
      />
    </div>
  );
}

import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { AVATAR_OPTIONS } from '../../data/avatarOptions';
import { Modal } from '../ui/Modal';
import { Check, Sparkles, UserCheck, Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';

export function AvatarPickerModal({ isOpen, onClose }) {
  const { currentUser, updateProfile } = useAuth();
  const { user, addToast } = useApp();
  const displayUser = currentUser || user;

  const [selectedAvatar, setSelectedAvatar] = useState(displayUser.avatar || AVATAR_OPTIONS[0].url);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  // Resize and compress uploaded image to a clean data URL
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 256;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/png', 0.9);
        setSelectedAvatar(dataUrl);
      };
      img.src = event.target?.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({ avatar: selectedAvatar });
      addToast('Profile picture updated successfully!', 'success');
      onClose();
    } catch {
      addToast('Failed to update avatar', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Profile Picture" size="md">
      <div className="space-y-5">
        {/* Current Preview Card */}
        <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <img
            src={selectedAvatar}
            alt="Preview"
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-500/30 p-1 bg-white dark:bg-slate-800 shrink-0"
          />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Current Selection</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Select one of the 8 curated avatars or upload your custom photo.
            </p>
          </div>
        </div>

        {/* Upload Custom Image Button */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-brand-300 dark:border-brand-500/40 bg-brand-50/40 dark:bg-brand-500/5 hover:bg-brand-50 dark:hover:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Your Own Photo / Image</span>
          </button>
          {uploadError && (
            <p className="flex items-center gap-1 text-[11px] text-rose-500 mt-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{uploadError}</span>
            </p>
          )}
        </div>

        {/* 8 Curated Avatars */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            Or Choose from 8 Curated Avatars
          </label>
          <div className="grid grid-cols-4 gap-2.5">
            {AVATAR_OPTIONS.map((avatar) => {
              const isSelected = selectedAvatar === avatar.url;
              return (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => {
                    setSelectedAvatar(avatar.url);
                    setUploadError('');
                  }}
                  className={`relative p-2 rounded-2xl border-2 transition-all flex flex-col items-center gap-1.5 group ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-500/10 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  <img
                    src={avatar.url}
                    alt={avatar.label}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 truncate w-full text-center">
                    {avatar.label}
                  </span>
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Updating...' : 'Set Profile Picture'}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}

import React from 'react';
import {
  Briefcase,
  FolderKanban,
  Layout,
  Code2,
  Sparkles,
  Rocket,
  Palette,
  Terminal,
} from 'lucide-react';

export const WORKSPACE_ICONS = {
  Briefcase,
  FolderKanban,
  Layout,
  Code2,
  Sparkles,
  Rocket,
  Palette,
  Terminal,
};

export const WORKSPACE_COLORS = [
  { name: 'Indigo', hex: '#5B5FEF' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Green', hex: '#10B981' },
  { name: 'Orange', hex: '#F97316' },
  { name: 'Purple', hex: '#8B5CF6' },
  { name: 'Slate', hex: '#64748B' },
];

export function getWorkspaceIconComponent(iconName) {
  return WORKSPACE_ICONS[iconName] || Briefcase;
}


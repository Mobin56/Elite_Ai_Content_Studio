'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useEditorStore } from '@/store/useEditorStore';
import {
  Home,
  Palette,
  Sparkles,
  FileText,
  Settings,
  ShieldAlert,
  Layers,
  PenTool,
} from 'lucide-react';

export default function Sidebar() {
  const { activeView, setView } = useAppStore();
  const { clearCanvas } = useEditorStore();

  const navigationItems = [
    { view: 'dashboard', name: 'Dashboard', icon: Home },
    { view: 'templates', name: 'Templates', icon: Layers },
    { view: 'editor', name: 'Design Editor', icon: PenTool },
    { view: 'ai-mcq', name: 'AI MCQ Generator', icon: Sparkles },
    { view: 'ai-copywriter', name: 'AI Copywriter', icon: FileText },
    { view: 'brandkit', name: 'Brand Kit', icon: Palette },
    { view: 'admin', name: 'Admin Panel', icon: ShieldAlert },
    { view: 'settings', name: 'Settings', icon: Settings },
  ] as const;

  const handleNavClick = (view: typeof navigationItems[number]['view']) => {
    if (view === 'editor' && activeView !== 'editor') {
      // Clear canvas when opening a fresh editor, so the user starts with empty or prompt selection
      clearCanvas();
    }
    setView(view);
  };

  return (
    <aside className="w-64 glass-panel border-r border-[var(--glass-border)] h-[calc(100vh-73px)] p-4 flex flex-col justify-between">
      <div className="space-y-1.5">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => handleNavClick(item.view)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'gradient-bg text-white shadow-lg shadow-indigo-500/20'
                  : 'text-muted-foreground hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              {item.name}
            </button>
          );
        })}
      </div>

      <div className="p-3.5 rounded-xl bg-slate-100/50 dark:bg-slate-900/50 border border-[var(--glass-border)] text-center">
        <p className="text-[11px] text-muted-foreground">Version 1.0.0 (Beta)</p>
        <p className="text-[9px] text-slate-400 mt-0.5">Optimized for Education</p>
      </div>
    </aside>
  );
}

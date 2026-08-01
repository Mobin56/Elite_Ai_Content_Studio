'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Sun, Moon, CreditCard, Sparkles } from 'lucide-react';

export default function Header() {
  const { theme, toggleTheme, aiCredits, activeView, currentMemberId, members, loginAsMember } = useAppStore();

  const activeMember = members.find(m => m.id === currentMemberId);
  const activeCredits = activeMember ? activeMember.credits : aiCredits;
  const activeName = activeMember ? activeMember.name : "Principal Admin";
  const activeEmail = activeMember ? activeMember.email : "admin@eliteschool.edu";
  const avatarInitials = activeName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const getViewTitle = () => {
    switch (activeView) {
      case 'dashboard':
        return 'Dashboard';
      case 'editor':
        return 'Design Studio Editor';
      case 'brandkit':
        return 'Brand Kit Customizer';
      case 'templates':
        return 'Templates Gallery';
      case 'ai-mcq':
        return 'AI MCQ Studio';
      case 'ai-copywriter':
        return 'AI Copywriter';
      case 'settings':
        return 'Studio Settings';
      case 'admin':
        return 'Administration Panel';
      default:
        return 'Elite AI Content Studio';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-[var(--glass-border)] px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center glow-primary">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold font-sans tracking-wide gradient-text">
            Elite AI Content Studio
          </h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
            {getViewTitle()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Credits counter */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-[var(--glass-border)]">
          <CreditCard className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-semibold text-muted-foreground">AI Credits:</span>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
            {activeCredits}
          </span>
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-[var(--glass-border)] text-foreground transition-all cursor-pointer"
          title="Toggle Theme"
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 text-slate-800" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>

        {/* Profile Switcher & Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[var(--glass-border)]">
          <div className="flex flex-col text-right">
            <select
              value={currentMemberId || 'admin'}
              onChange={(e) => {
                const val = e.target.value;
                loginAsMember(val === 'admin' ? null : val);
              }}
              className="bg-slate-900/60 dark:bg-slate-950/60 border border-[var(--glass-border)] rounded-lg px-2 py-0.5 text-[10px] font-bold text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="admin">Principal Admin</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
              ))}
            </select>
            <span className="text-[9px] text-muted-foreground font-mono mt-0.5 leading-none">{activeEmail}</span>
          </div>

          <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-xs font-bold text-white uppercase font-mono">
            {avatarInitials}
          </div>
        </div>
      </div>
    </header>
  );
}

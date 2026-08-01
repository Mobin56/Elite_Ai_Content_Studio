'use client';

import React, { useState } from 'react';
import { useAppStore, Project } from '@/store/useAppStore';
import { useEditorStore } from '@/store/useEditorStore';
import { useBrandStore } from '@/store/useBrandStore';
import { 
  PlusCircle, Sparkles, Layers, Palette, 
  Trash2, Copy, FileEdit, Download, ExternalLink, Calendar 
} from 'lucide-react';

export default function DashboardView() {
  const { projects, deleteProject, duplicateProject, renameProject, setView, setCurrentProject, aiCredits } = useAppStore();
  const { loadDesign, clearCanvas } = useEditorStore();
  const { brandKit } = useBrandStore();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  const stats = [
    { label: 'Saved Designs', value: projects.length, desc: 'Active draft projects' },
    { label: 'AI Credits Left', value: aiCredits, desc: 'Used for MCQ & illust.' },
    { label: 'Active Brand Kit', value: brandKit.brandName ? 'Configured' : 'Missing', desc: brandKit.brandName || 'Not setup' },
    { label: 'DPI Export Limit', value: '300 DPI', desc: 'Ultra-High Res PDF/PNG' }
  ];

  const handleCreateNew = (width = 800, height = 800, name = "Untitled Design") => {
    clearCanvas();
    const id = `project-${Date.now()}`;
    const newProj = {
      id,
      name,
      canvasWidth: width,
      canvasHeight: height,
      items: []
    };
    // Load into editor store
    loadDesign([], width, height);
    setCurrentProject(id);
    setView('editor');
  };

  const handleOpenProject = (project: Project) => {
    loadDesign(project.items, project.canvasWidth, project.canvasHeight);
    setCurrentProject(project.id);
    setView('editor');
  };

  const handleStartRename = (project: Project) => {
    setEditingId(project.id);
    setNewName(project.name);
  };

  const handleSaveRename = (id: string) => {
    if (newName.trim()) {
      renameProject(id, newName.trim());
      setEditingId(null);
    }
  };

  // Quick seed templates list
  const templates = [
    { name: "Daily MCQ Contest", width: 800, height: 800, color: "from-blue-600 to-indigo-600" },
    { name: "Admission Notice Banner", width: 1200, height: 630, color: "from-purple-600 to-pink-600" },
    { name: "YouTube Thumbnail", width: 1280, height: 720, color: "from-amber-500 to-red-600" },
    { name: "Certificate of Merit", width: 1123, height: 794, color: "from-emerald-500 to-teal-600" },
    { name: "Student ID Card", width: 638, height: 1012, color: "from-slate-700 to-slate-900" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome banner */}
      <div className="relative p-8 rounded-2xl overflow-hidden glass-card glow-primary flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="space-y-2 z-10">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Welcome back to <span className="gradient-text">{brandKit.brandName}</span> Workspace!
          </h2>
          <p className="text-muted-foreground text-sm max-w-lg">
            Generate custom educational content, MCQs, promotional banners, schedules, and certificates instantly with premium AI models.
          </p>
        </div>
        <button
          onClick={() => handleCreateNew()}
          className="z-10 gradient-bg text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-indigo-500/20 cursor-pointer"
        >
          <PlusCircle className="w-5 h-5" />
          Create Custom Canvas
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div key={idx} className="p-5 rounded-2xl glass-panel relative overflow-hidden">
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">{s.label}</p>
            <p className="text-3xl font-bold mt-2 font-sans tracking-tight">{s.value}</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setView('ai-mcq')}
            className="p-5 rounded-2xl bg-slate-900/10 hover:bg-indigo-500/10 dark:bg-slate-900/50 dark:hover:bg-indigo-500/10 border border-[var(--glass-border)] text-left flex flex-col justify-between h-36 transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">AI MCQ Generator</p>
              <p className="text-[11px] text-muted-foreground mt-1">Create syllabus questions in seconds</p>
            </div>
          </button>
          
          <button
            onClick={() => setView('templates')}
            className="p-5 rounded-2xl bg-slate-900/10 hover:bg-cyan-500/10 dark:bg-slate-900/50 dark:hover:bg-cyan-500/10 border border-[var(--glass-border)] text-left flex flex-col justify-between h-36 transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">Template Library</p>
              <p className="text-[11px] text-muted-foreground mt-1">Browse 30+ educational formats</p>
            </div>
          </button>

          <button
            onClick={() => setView('brandkit')}
            className="p-5 rounded-2xl bg-slate-900/10 hover:bg-pink-500/10 dark:bg-slate-900/50 dark:hover:bg-pink-500/10 border border-[var(--glass-border)] text-left flex flex-col justify-between h-36 transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">Configure Brand Kit</p>
              <p className="text-[11px] text-muted-foreground mt-1">Set logos, signatures, and palettes</p>
            </div>
          </button>

          <button
            onClick={() => setView('ai-copywriter')}
            className="p-5 rounded-2xl bg-slate-900/10 hover:bg-emerald-500/10 dark:bg-slate-900/50 dark:hover:bg-emerald-500/10 border border-[var(--glass-border)] text-left flex flex-col justify-between h-36 transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">AI Copywriter</p>
              <p className="text-[11px] text-muted-foreground mt-1">Write captions & SEO titles</p>
            </div>
          </button>
        </div>
      </div>

      {/* Starters */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">Quick Template Starters</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {templates.map((t, idx) => (
            <button
              key={idx}
              onClick={() => handleCreateNew(t.width, t.height, t.name)}
              className={`p-4 rounded-2xl bg-gradient-to-br ${t.color} text-white text-left h-28 flex flex-col justify-between shadow-sm hover:scale-[1.03] active:scale-[0.98] transition-transform cursor-pointer`}
            >
              <span className="text-[10px] uppercase font-bold bg-white/20 px-2 py-0.5 rounded-full w-max">
                {t.width} x {t.height}
              </span>
              <span className="font-semibold text-xs leading-tight">{t.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Projects */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">Recent Projects ({projects.length})</h3>
        {projects.length === 0 ? (
          <div className="text-center p-12 rounded-2xl border border-dashed border-[var(--glass-border)]">
            <Layers className="w-10 h-10 text-slate-500 mx-auto stroke-1" />
            <p className="font-medium text-sm mt-3">No designs created yet</p>
            <p className="text-xs text-muted-foreground mt-1">Start by selecting a template or creating a blank canvas</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((p) => (
              <div
                key={p.id}
                className="group rounded-2xl glass-card overflow-hidden border border-[var(--glass-border)] relative flex flex-col"
              >
                {/* Thumb placeholder */}
                <div 
                  onClick={() => handleOpenProject(p)}
                  className="h-36 bg-slate-200 dark:bg-slate-900 border-b border-[var(--glass-border)] flex items-center justify-center text-xs text-slate-500 font-semibold cursor-pointer select-none relative group-hover:opacity-95 transition-opacity"
                >
                  <div className="w-full h-full gradient-bg opacity-5 absolute inset-0" />
                  <div className="p-4 border border-[var(--glass-border)] rounded bg-background shadow-sm text-center">
                    <p className="text-[10px] text-muted-foreground uppercase font-mono">{p.canvasWidth}x{p.canvasHeight}</p>
                    <p className="font-bold text-foreground text-xs mt-1 truncate max-w-[120px]">{p.name}</p>
                  </div>
                </div>

                {/* Footer and controls */}
                <div className="p-4 flex-1 flex flex-col justify-between bg-slate-900/5 dark:bg-slate-900/20">
                  <div className="flex items-center justify-between">
                    {editingId === p.id ? (
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onBlur={() => handleSaveRename(p.id)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(p.id)}
                        className="bg-background border border-[var(--glass-border)] text-xs rounded px-2 py-1 focus:outline-none w-full text-foreground"
                        autoFocus
                      />
                    ) : (
                      <div className="truncate pr-2">
                        <p className="font-bold text-xs leading-none truncate">{p.name}</p>
                        <p className="text-[9px] text-muted-foreground mt-1 flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5" />
                          {new Date(p.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleStartRename(p)}
                        className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-foreground cursor-pointer"
                        title="Rename"
                      >
                        <FileEdit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => duplicateProject(p.id)}
                        className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-foreground cursor-pointer"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteProject(p.id)}
                        className="p-1.5 rounded hover:bg-red-500/20 hover:text-red-500 text-slate-500 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

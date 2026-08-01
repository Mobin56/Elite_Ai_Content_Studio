'use client';

import React, { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import Header from '@/components/shared/Header';
import Sidebar from '@/components/shared/Sidebar';

// Views
import DashboardView from '@/components/views/DashboardView';
import EditorView from '@/components/views/EditorView';
import BrandKitView from '@/components/views/BrandKitView';
import TemplatesView from '@/components/views/TemplatesView';
import AIMCQView from '@/components/views/AIMCQView';
import AICopywriterView from '@/components/views/AICopywriterView';
import AdminView from '@/components/views/AdminView';
import SettingsView from '@/components/views/SettingsView';

export default function Home() {
  const { activeView, theme } = useAppStore();

  // Apply dark mode class directly on document HTML
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'editor':
        return <EditorView />;
      case 'brandkit':
        return <BrandKitView />;
      case 'templates':
        return <TemplatesView />;
      case 'ai-mcq':
        return <AIMCQView />;
      case 'ai-copywriter':
        return <AICopywriterView />;
      case 'admin':
        return <AdminView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  const isEditor = activeView === 'editor';

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      <Header />
      
      <div className="flex flex-1 relative">
        <Sidebar />
        
        {/* Main Content Area */}
        <main className={`flex-1 overflow-y-auto ${isEditor ? 'p-0' : 'p-8 bg-slate-900/5 dark:bg-slate-900/10'}`}>
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}

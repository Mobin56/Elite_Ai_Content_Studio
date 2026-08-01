'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useBrandStore } from '@/store/useBrandStore';
import { Settings, Moon, Sun, Shield, Save, Cloud, Bell, HelpCircle } from 'lucide-react';

export default function SettingsView() {
  const { theme, toggleTheme, aiCredits, addCredits } = useAppStore();
  const { brandKit } = useBrandStore();

  const handleTopup = (amount: number) => {
    addCredits(amount);
    alert(`Success! Credited ${amount} credits to your account. Current balance: ${aiCredits + amount} credits.`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-[var(--glass-border)] pb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-500/10 flex items-center justify-center text-slate-400">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Studio Settings</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure default canvas workspace parameters, credit top-ups, and auto-backup integrations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Settings Column */}
        <div className="md:col-span-2 space-y-6">
          
          {/* General Workspace Options */}
          <div className="p-6 rounded-2xl glass-card space-y-4">
            <h3 className="font-bold text-sm border-b border-[var(--glass-border)] pb-2 flex items-center gap-2">
              <Save className="w-4 h-4 text-indigo-500" />
              Workspace Preferences
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold">Theme Mode</p>
                  <p className="text-[10px] text-muted-foreground">Toggle light or dark editor styling</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-900 border border-[var(--glass-border)] text-foreground flex items-center gap-2 cursor-pointer"
                >
                  {theme === 'light' ? (
                    <>
                      <Moon className="w-3.5 h-3.5" />
                      Switch Dark
                    </>
                  ) : (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      Switch Light
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-[var(--glass-border)] pt-4">
                <div>
                  <p className="text-xs font-semibold">Canvas Auto-Save</p>
                  <p className="text-[10px] text-muted-foreground">Automatically saves drafts every 30 seconds</p>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" id="auto-save" />
                  <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[var(--glass-border)] pt-4">
                <div>
                  <p className="text-xs font-semibold">Cloud Backup Integration</p>
                  <p className="text-[10px] text-muted-foreground">Keep designs synchronized with Firestore database</p>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" id="cloud-backup" />
                  <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[var(--glass-border)] pt-4">
                <div>
                  <p className="text-xs font-semibold">System Notifications</p>
                  <p className="text-[10px] text-muted-foreground">Alert when design exports are completed</p>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" id="notif-toggle" />
                  <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Security details */}
          <div className="p-6 rounded-2xl glass-card space-y-4">
            <h3 className="font-bold text-sm border-b border-[var(--glass-border)] pb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-500" />
              API Settings
            </h3>
            
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">OpenAI API Key (Optional)</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 text-xs rounded-lg glass-input text-foreground font-mono"
                  placeholder="sk-proj-................................"
                />
                <span className="text-[9px] text-muted-foreground block">
                  Add your OpenAI API key to replace the simulated mock data with real generative capabilities.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Credits Panel */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl glass-card space-y-4">
            <h3 className="font-bold text-sm border-b border-[var(--glass-border)] pb-2 flex items-center justify-between">
              <span>AI Credits Hub</span>
              <span className="text-xs font-bold text-indigo-400 font-mono">{aiCredits} Balance</span>
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              Credits are deducted whenever you generate dynamic educational MCQs (5 credits), write social copywriting (3 credits), or render illustration visuals.
            </p>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => handleTopup(100)}
                className="w-full py-2.5 rounded-xl border border-indigo-500/50 hover:bg-indigo-600 hover:text-white transition-all text-xs font-bold cursor-pointer text-indigo-400"
              >
                Topup 100 Credits ($4.99)
              </button>
              <button
                onClick={() => handleTopup(500)}
                className="w-full py-2.5 rounded-xl border border-indigo-500/50 hover:bg-indigo-600 hover:text-white transition-all text-xs font-bold cursor-pointer text-indigo-400"
              >
                Topup 500 Credits ($19.99)
              </button>
              <button
                onClick={() => handleTopup(1000)}
                className="w-full py-2.5 rounded-xl gradient-bg text-white font-bold hover:scale-[1.01] transition-transform cursor-pointer"
              >
                Topup 1000 Credits ($29.99)
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-card text-center space-y-2">
            <HelpCircle className="w-8 h-8 text-slate-500 mx-auto stroke-1" />
            <h4 className="font-bold text-xs">Need help?</h4>
            <p className="text-[10px] text-slate-400 leading-normal">
              Contact our academic customer desk at support@eliteacademic.edu for site licensing.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

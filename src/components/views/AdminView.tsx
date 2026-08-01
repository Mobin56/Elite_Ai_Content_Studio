'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { 
  Users, Layers, CreditCard, ShieldAlert, BarChart3, 
  UserPlus, Crown, Plus, CheckCircle, Database
} from 'lucide-react';
import { generateBarChartSVG, generatePieChartSVG } from '@/utils/canvas-helpers';

export default function AdminView() {
  const { adminStats, addCredits } = useAppStore();
  const [targetUserId, setTargetUserId] = useState('user-1');
  const [topupCredits, setTopupCredits] = useState(100);

  // Mock list of workspace users
  const [usersList, setUsersList] = useState([
    { id: 'user-1', name: 'Dr. Sarah Connor', email: 'sconnor@eliteschool.edu', role: 'Admin', plan: 'Enterprise', activeProjects: 24, lastActive: '2 mins ago' },
    { id: 'user-2', name: 'John Doe', email: 'jdoe@eliteschool.edu', role: 'Designer', plan: 'Professional', activeProjects: 12, lastActive: '1 hour ago' },
    { id: 'user-3', name: 'Professor Charles', email: 'charles@eliteschool.edu', role: 'Editor', plan: 'Professional', activeProjects: 5, lastActive: '1 day ago' },
    { id: 'user-4', name: 'Albert Einstein', email: 'albert@eliteschool.edu', role: 'Viewer', plan: 'Free', activeProjects: 2, lastActive: '3 days ago' },
  ]);

  const handleTopup = () => {
    addCredits(Number(topupCredits));
    const targetUser = usersList.find(u => u.id === targetUserId);
    alert(`Successfully topped up ${topupCredits} AI Credits for user ${targetUser?.name || 'Workspace Account'}!`);
  };

  // Compile monthly registration datasets
  const registrationData = [
    { label: 'Feb', value: 120 },
    { label: 'Mar', value: 240 },
    { label: 'Apr', value: 310 },
    { label: 'May', value: 450 },
    { label: 'Jun', value: 680 },
    { label: 'Jul', value: 920 }
  ];

  // Compile subscription distribution data
  const subscriptionData = [
    { label: 'Enterprise', value: 42 },
    { label: 'Professional', value: 180 },
    { label: 'Basic', value: 160 },
    { label: 'Free Trial', value: 538 }
  ];

  // Render SVG charts
  const registrationBarChart = generateBarChartSVG(registrationData, 500, 220, ['#6366f1']);
  const subscriptionPieChart = generatePieChartSVG(subscriptionData, 500, 220, ['#6366f1', '#22d3ee', '#fb7185', '#f59e0b']);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-[var(--glass-border)] pb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Administration & Analytics</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor workspace signups, system storage, user roles, and allocate credits.
          </p>
        </div>
      </div>

      {/* Admin stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl glass-panel flex items-center gap-4">
          <div className="p-3 bg-indigo-500/15 text-indigo-400 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Total Users</p>
            <p className="text-xl font-bold font-mono">{adminStats.totalUsers}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl glass-panel flex items-center gap-4">
          <div className="p-3 bg-cyan-500/15 text-cyan-400 rounded-lg">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Pro Subscriptions</p>
            <p className="text-xl font-bold font-mono">{adminStats.activeSubscriptions}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl glass-panel flex items-center gap-4">
          <div className="p-3 bg-emerald-500/15 text-emerald-400 rounded-lg">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Monthly Revenue</p>
            <p className="text-xl font-bold font-mono">${adminStats.monthlyRevenue}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl glass-panel flex items-center gap-4">
          <div className="p-3 bg-amber-500/15 text-amber-400 rounded-lg">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Storage Used</p>
            <p className="text-xl font-bold font-mono">
              {(adminStats.storageUsedBytes / (1024 * 1024 * 1024)).toFixed(1)} GB
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl glass-card space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-2 border-b border-[var(--glass-border)] pb-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            User Registration Growth (Last 6 Months)
          </h3>
          <div className="h-56 flex items-center justify-center bg-slate-900/30 rounded-xl p-2">
            <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: registrationBarChart }} />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-2 border-b border-[var(--glass-border)] pb-2">
            <Crown className="w-4 h-4 text-cyan-400" />
            Subscription Tier Distribution
          </h3>
          <div className="h-56 flex items-center justify-center bg-slate-900/30 rounded-xl p-2">
            <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: subscriptionPieChart }} />
          </div>
        </div>
      </div>

      {/* Grid listing users & credits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User list */}
        <div className="p-5 rounded-2xl glass-card md:col-span-2 space-y-4">
          <h3 className="text-sm font-bold border-b border-[var(--glass-border)] pb-2 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            Workspace Personnel & Roles
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[var(--glass-border)] text-slate-400 uppercase font-mono">
                  <th className="py-2.5">User</th>
                  <th className="py-2.5">Role</th>
                  <th className="py-2.5">Billing Tier</th>
                  <th className="py-2.5 text-center">Drafts</th>
                  <th className="py-2.5">Last Active</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((user) => (
                  <tr key={user.id} className="border-b border-[var(--glass-border)] hover:bg-slate-900/10">
                    <td className="py-3 font-semibold">
                      <p>{user.name}</p>
                      <p className="text-[10px] text-slate-500 font-normal">{user.email}</p>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-foreground font-medium">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 font-medium text-cyan-400">{user.plan}</td>
                    <td className="py-3 text-center font-mono">{user.activeProjects}</td>
                    <td className="py-3 text-slate-400">{user.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Credit Topup Panel */}
        <div className="p-5 rounded-2xl glass-card space-y-4 h-max">
          <h3 className="text-sm font-bold border-b border-[var(--glass-border)] pb-2 flex items-center gap-2">
            <Crown className="w-4 h-4 text-rose-400" />
            Allocate AI Credits
          </h3>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Target User Account</label>
              <select
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg glass-input text-foreground font-sans"
              >
                {usersList.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Amount of Credits</label>
              <input
                type="number"
                value={topupCredits}
                onChange={(e) => setTopupCredits(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg glass-input text-foreground font-mono"
                min="10"
                max="5000"
              />
            </div>

            <button
              onClick={handleTopup}
              className="w-full py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Credit Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { 
  Users, Crown, CreditCard, ShieldAlert, BarChart3, 
  Plus, Trash2, Key, UserPlus, Gift, Database
} from 'lucide-react';
import { generateBarChartSVG, generatePieChartSVG } from '@/utils/canvas-helpers';

export default function AdminView() {
  const { 
    adminStats, addCredits, members, addMember, 
    deleteMember, allocateCredits, adminPassword, changeAdminPassword 
  } = useAppStore();

  // Member addition inputs
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'Admin' | 'Designer' | 'Editor' | 'Viewer'>('Editor');

  // Credit allocation target state
  const [creditTargetId, setCreditTargetId] = useState('');
  const [creditAmount, setCreditAmount] = useState(50);

  // Password editing states
  const [editingPassword, setEditingPassword] = useState(false);
  const [tempPassword, setTempPassword] = useState(adminPassword);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim()) {
      alert("Please fill in both the member name and email.");
      return;
    }
    addMember(newMemberName.trim(), newMemberEmail.trim(), newMemberRole);
    alert(`Successfully registered ${newMemberName} as a ${newMemberRole}. 10 FREE credits have been credited to their account!`);
    setNewMemberName('');
    setNewMemberEmail('');
  };

  const handleAllocate = () => {
    if (!creditTargetId) {
      alert("Please select a target member first.");
      return;
    }
    allocateCredits(creditTargetId, Number(creditAmount));
    const target = members.find(m => m.id === creditTargetId);
    alert(`allocated ${creditAmount} credits to ${target?.name || 'User'}`);
  };

  const handleSavePassword = () => {
    if (!tempPassword.trim()) {
      alert("Password cannot be blank.");
      return;
    }
    changeAdminPassword(tempPassword.trim());
    setEditingPassword(false);
    alert("Super Admin password updated successfully!");
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
      <div className="border-b border-[var(--glass-border)] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Super Admin Panel</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Control system personnel roles, credit balances, auto-allocate policies, and access keys.
            </p>
          </div>
        </div>

        {/* Super Admin Password Manager */}
        <div className="p-3 rounded-xl glass-card flex items-center gap-3 bg-slate-900/40">
          <Key className="w-4 h-4 text-amber-400" />
          <div>
            <p className="text-[9px] uppercase font-bold text-slate-400 leading-none">Super Admin Key</p>
            {editingPassword ? (
              <div className="flex items-center gap-1.5 mt-1.5">
                <input
                  type="text"
                  value={tempPassword}
                  onChange={(e) => setTempPassword(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-xs text-foreground font-mono focus:outline-none w-28"
                />
                <button onClick={handleSavePassword} className="bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer">Save</button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-mono text-foreground font-bold tracking-wide">{adminPassword}</span>
                <button onClick={() => setEditingPassword(true)} className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold underline cursor-pointer">Change</button>
              </div>
            )}
          </div>
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
            <p className="text-xl font-bold font-mono">{members.length}</p>
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

      {/* Adding & Allocating Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Add Member Form */}
        <div className="p-5 rounded-2xl glass-card space-y-4 h-max">
          <h3 className="text-sm font-bold border-b border-[var(--glass-border)] pb-2 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-indigo-400" />
            Add New Member
          </h3>

          <form onSubmit={handleAddMember} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400">Full Name</label>
              <input
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                className="w-full p-2 glass-input text-foreground rounded text-xs"
                placeholder="e.g. Isaac Newton"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400">Email Address</label>
              <input
                type="email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                className="w-full p-2 glass-input text-foreground rounded text-xs"
                placeholder="newton@eliteschool.edu"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400">Workspace Role</label>
              <select
                value={newMemberRole}
                onChange={(e: any) => setNewMemberRole(e.target.value)}
                className="w-full p-2 glass-input text-foreground rounded text-xs"
              >
                <option value="Admin">Admin (Full Edit & Configs)</option>
                <option value="Designer">Designer (Canvas & Editor)</option>
                <option value="Editor">Editor (Text & Forms)</option>
                <option value="Viewer">Viewer (Read Only)</option>
              </select>
            </div>

            {/* Credit promotion banner */}
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center gap-2.5 text-[11px] text-indigo-300">
              <Gift className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Promo: Every new member automatically receives **10 credits** for free!</span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Register Member
            </button>
          </form>
        </div>

        {/* Allocate Credits Box */}
        <div className="p-5 rounded-2xl glass-card space-y-4 h-max">
          <h3 className="text-sm font-bold border-b border-[var(--glass-border)] pb-2 flex items-center gap-2">
            <Crown className="w-4 h-4 text-rose-400" />
            Allocate AI Credits
          </h3>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400">Select Member</label>
              <select
                value={creditTargetId}
                onChange={(e) => setCreditTargetId(e.target.value)}
                className="w-full p-2 glass-input text-foreground rounded text-xs font-sans"
              >
                <option value="">-- Choose Member --</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400">Amount of Credits</label>
              <input
                type="number"
                value={creditAmount}
                onChange={(e) => setCreditAmount(Number(e.target.value))}
                className="w-full p-2 glass-input text-foreground rounded text-xs font-mono"
                min="5"
                max="5000"
              />
            </div>

            <button
              onClick={handleAllocate}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer animate-pulse"
            >
              Grant Credits
            </button>
          </div>
        </div>

        {/* Storage status */}
        <div className="p-5 rounded-2xl glass-card space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold border-b border-[var(--glass-border)] pb-2">Workspace Cloud Storage</h3>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span>Storage Limit (100 GB)</span>
                <span className="font-mono">42.0%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[42%]" />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-4 leading-relaxed">
              Database files are automatically archived. High resolution SVG structures require less than 1KB. Background removed PNG uploads take approximately 1.2MB per file.
            </p>
          </div>

          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[10px] text-emerald-300 text-center">
            ✔ Auto Sync with Cloud Backup Active
          </div>
        </div>

      </div>

      {/* Personnel registry grid */}
      <div className="p-5 rounded-2xl glass-card space-y-4">
        <h3 className="text-sm font-bold border-b border-[var(--glass-border)] pb-2 flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-400" />
          Personnel Roster & AI Credit Limits
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[var(--glass-border)] text-slate-400 uppercase font-mono">
                <th className="py-2.5">User</th>
                <th className="py-2.5">Role</th>
                <th className="py-2.5 text-center">AI Credits</th>
                <th className="py-2.5 text-center">Active Drafts</th>
                <th className="py-2.5 text-center">Permission Status</th>
                <th className="py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((user) => (
                <tr key={user.id} className="border-b border-[var(--glass-border)] hover:bg-slate-900/10">
                  <td className="py-3 font-semibold">
                    <p>{user.name}</p>
                    <p className="text-[10px] text-slate-500 font-normal">{user.email}</p>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      user.role === 'Admin' ? 'bg-rose-500/20 text-rose-400' :
                      user.role === 'Designer' ? 'bg-cyan-500/20 text-cyan-400' :
                      user.role === 'Editor' ? 'bg-indigo-500/20 text-indigo-400' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 text-center font-bold font-mono text-indigo-400">{user.credits}</td>
                  <td className="py-3 text-center font-mono">{user.activeProjects}</td>
                  <td className="py-3 text-center">
                    {user.credits > 0 ? (
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                        Can Edit
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-bold bg-slate-800 px-2 py-0.5 rounded">
                        Needs Credits
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => {
                        if (confirm(`Remove ${user.name} from workspace?`)) {
                          deleteMember(user.id);
                        }
                      }}
                      className="p-1.5 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 cursor-pointer"
                      title="Revoke Member Access"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[var(--glass-border)] pt-6">
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
    </div>
  );
}

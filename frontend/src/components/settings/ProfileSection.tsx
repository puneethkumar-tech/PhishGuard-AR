'use client';

import React from 'react';
import { User, Shield, Building, Mail, RotateCcw, Check } from 'lucide-react';
import { PlatformSettings } from '@/types';

interface ProfileSectionProps {
  profile: PlatformSettings['profile'];
  onChange: (profile: PlatformSettings['profile']) => void;
  onReset: () => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  profile,
  onChange,
  onReset,
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur-xl shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100">Analyst Profile (Demo)</h3>
            <p className="text-xs text-slate-400">
              Frontend simulation identity for attribution and reports.
            </p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Profile</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1.5">
            Display Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={profile.displayName}
              onChange={(e) => onChange({ ...profile, displayName: e.target.value })}
              className="w-full pl-9 pr-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/50"
              placeholder="e.g. Lead Security Analyst"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="email"
              value={profile.email}
              onChange={(e) => onChange({ ...profile, email: e.target.value })}
              className="w-full pl-9 pr-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/50"
              placeholder="analyst@domain.internal"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1.5">
            Operational Role
          </label>
          <div className="relative">
            <Shield className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={profile.role}
              onChange={(e) => onChange({ ...profile, role: e.target.value })}
              className="w-full pl-9 pr-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/50"
              placeholder="e.g. SOC Threat Hunter"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1.5">
            Organization Unit
          </label>
          <div className="relative">
            <Building className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={profile.organization}
              onChange={(e) => onChange({ ...profile, organization: e.target.value })}
              className="w-full pl-9 pr-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/50"
              placeholder="e.g. Cyber Defense Command"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

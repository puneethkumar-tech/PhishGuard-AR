'use client';

import React from 'react';
import { Database, Trash2, ShieldCheck, HardDrive, AlertTriangle } from 'lucide-react';

interface PrivacyDataSectionProps {
  onClearHistory: () => void;
  onClearReports: () => void;
  onClearAlerts: () => void;
  onClearSettings: () => void;
  onClearAll: () => void;
}

export const PrivacyDataSection: React.FC<PrivacyDataSectionProps> = ({
  onClearHistory,
  onClearReports,
  onClearAlerts,
  onClearSettings,
  onClearAll,
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur-xl shadow-xl space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
          <Database className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-100">Privacy & Data Management</h3>
          <p className="text-xs text-slate-400">
            Local browser sandbox storage management. No remote cloud or backend database connected.
          </p>
        </div>
      </div>

      {/* Info Callout */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <span className="font-semibold text-cyan-300 block mb-1">
            Local Demo Storage Architecture
          </span>
          PhishGuard-AR stores all scan results, generated forensic reports, security alerts, and
          user preferences locally in this browser&apos;s localStorage sandbox. No telemetry or inputs are
          transmitted to external servers.
        </div>
      </div>

      {/* Granular Clear Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <button
          onClick={onClearHistory}
          className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 hover:bg-red-950/20 border border-slate-800 hover:border-red-500/40 text-left transition-all group"
        >
          <div>
            <span className="text-xs font-mono font-semibold text-slate-300 group-hover:text-red-300 block">
              Clear Scan History
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Wipe saved threat runs</span>
          </div>
          <Trash2 className="w-4 h-4 text-slate-500 group-hover:text-red-400" />
        </button>

        <button
          onClick={onClearReports}
          className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 hover:bg-red-950/20 border border-slate-800 hover:border-red-500/40 text-left transition-all group"
        >
          <div>
            <span className="text-xs font-mono font-semibold text-slate-300 group-hover:text-red-300 block">
              Clear Reports
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Remove generated dossiers</span>
          </div>
          <Trash2 className="w-4 h-4 text-slate-500 group-hover:text-red-400" />
        </button>

        <button
          onClick={onClearAlerts}
          className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 hover:bg-red-950/20 border border-slate-800 hover:border-red-500/40 text-left transition-all group"
        >
          <div>
            <span className="text-xs font-mono font-semibold text-slate-300 group-hover:text-red-300 block">
              Clear Security Alerts
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Flush incident feed</span>
          </div>
          <Trash2 className="w-4 h-4 text-slate-500 group-hover:text-red-400" />
        </button>

        <button
          onClick={onClearSettings}
          className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 hover:bg-red-950/20 border border-slate-800 hover:border-red-500/40 text-left transition-all group"
        >
          <div>
            <span className="text-xs font-mono font-semibold text-slate-300 group-hover:text-red-300 block">
              Clear Preferences
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Restore default flags</span>
          </div>
          <Trash2 className="w-4 h-4 text-slate-500 group-hover:text-red-400" />
        </button>

        <button
          onClick={onClearAll}
          className="sm:col-span-2 lg:col-span-2 flex items-center justify-between p-3.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-left transition-all group"
        >
          <div>
            <span className="text-xs font-mono font-bold text-red-300 block">
              Purge All Local Demo Data
            </span>
            <span className="text-[10px] text-red-400/80 mt-0.5 block">
              Erase history, reports, alerts, and custom configuration
            </span>
          </div>
          <Trash2 className="w-4 h-4 text-red-400" />
        </button>
      </div>
    </div>
  );
};

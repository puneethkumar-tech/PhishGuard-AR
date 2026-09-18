'use client';

import React from 'react';
import { PlayCircle, RotateCcw, Database, Shield, Zap, Sparkles, CheckCircle2 } from 'lucide-react';

interface DemoEnvironmentPanelProps {
  onSeedHistory: () => void;
  onSeedReports: () => void;
  onSeedAlerts: () => void;
  onResetAllDemoData: () => void;
}

export const DemoEnvironmentPanel: React.FC<DemoEnvironmentPanelProps> = ({
  onSeedHistory,
  onSeedReports,
  onSeedAlerts,
  onResetAllDemoData,
}) => {
  return (
    <div className="bg-gradient-to-br from-slate-900/80 via-cyan-950/20 to-slate-900/80 border border-cyan-500/30 rounded-xl p-6 backdrop-blur-xl shadow-2xl space-y-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-100">Demo Environment Controls</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                EVALUATION READY
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Deterministic seeding and rapid reset controls for reviewers and live demonstration.
            </p>
          </div>
        </div>

        <button
          onClick={onResetAllDemoData}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-semibold transition-all shadow-md"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restore Full Demo State</span>
        </button>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {[
          { label: 'DEMO MODE', desc: 'Active' },
          { label: 'SIMULATED ML', desc: 'Deterministic' },
          { label: 'LOCAL STORAGE', desc: 'Browser Only' },
          { label: 'NO BACKEND', desc: 'Frontend-Only' },
          { label: 'NO LIVE INTEL', desc: 'Safe Sandbox' },
        ].map((badge) => (
          <div
            key={badge.label}
            className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-center"
          >
            <div className="text-[10px] font-mono font-bold text-cyan-400">{badge.label}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{badge.desc}</div>
          </div>
        ))}
      </div>

      {/* Seed Actions */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
          Individual Seeding Actions
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={onSeedHistory}
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 hover:bg-cyan-950/30 border border-slate-800 hover:border-cyan-500/40 transition-all group text-left"
          >
            <div>
              <span className="text-xs font-mono font-semibold text-slate-200 group-hover:text-cyan-300 block">
                Seed Sample History
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">10 forensic scan logs</span>
            </div>
            <PlayCircle className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
          </button>

          <button
            onClick={onSeedReports}
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 hover:bg-cyan-950/30 border border-slate-800 hover:border-cyan-500/40 transition-all group text-left"
          >
            <div>
              <span className="text-xs font-mono font-semibold text-slate-200 group-hover:text-cyan-300 block">
                Seed Sample Reports
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">5 comprehensive dossiers</span>
            </div>
            <PlayCircle className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
          </button>

          <button
            onClick={onSeedAlerts}
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 hover:bg-cyan-950/30 border border-slate-800 hover:border-cyan-500/40 transition-all group text-left"
          >
            <div>
              <span className="text-xs font-mono font-semibold text-slate-200 group-hover:text-cyan-300 block">
                Seed Sample Alerts
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">6 SOC incident items</span>
            </div>
            <PlayCircle className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

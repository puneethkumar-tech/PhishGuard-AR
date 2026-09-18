'use client';

import React from 'react';
import {
  History,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Trash2,
  Lock,
} from 'lucide-react';
import { ThreatHistoryRecord } from '@/types';

interface HistoryHeaderProps {
  records: ThreatHistoryRecord[];
  onRefresh: () => void;
  onClear: () => void;
  onRestoreDefaults: () => void;
}

export const HistoryHeader: React.FC<HistoryHeaderProps> = ({
  records,
  onRefresh,
  onClear,
  onRestoreDefaults,
}) => {
  const totalScans = records.length;
  const threatsDetected = records.filter(
    (r) => r.verdict === 'PHISHING' || r.verdict === 'BLOCKED'
  ).length;
  const suspiciousCount = records.filter((r) => r.verdict === 'SUSPICIOUS').length;
  const adversarialCount = records.filter((r) => r.verdict === 'ADVERSARIAL').length;
  const safeCount = records.filter((r) => r.verdict === 'SAFE').length;

  return (
    <div className="space-y-4">
      {/* Top Banner & Actions */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-slate-950/90 p-5 backdrop-blur-xl shadow-[0_0_35px_rgba(6,182,212,0.08)]">
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/40 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <History className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-mono text-xl font-bold tracking-wider text-slate-100 uppercase sm:text-2xl">
                  Threat History & Audit Logs
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-cyan-300 uppercase shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                  Demo Environment
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                Review previous AI security analyses, adversarial tests, and multi-model threat decisions.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onRestoreDefaults}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 font-mono text-xs font-semibold tracking-wider text-slate-300 uppercase transition-all duration-200 hover:border-slate-600 hover:text-slate-100"
              title="Restore sample demo history"
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Seed Demo Data</span>
            </button>

            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 font-mono text-xs font-semibold tracking-wider text-slate-300 uppercase transition-all duration-200 hover:border-slate-600 hover:text-slate-100"
              title="Refresh timeline records"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 font-mono text-xs font-semibold tracking-wider text-rose-300 uppercase transition-all duration-200 hover:bg-rose-500/20 hover:border-rose-400"
              title="Clear all stored demo history"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 font-mono text-xs">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5 backdrop-blur-md">
          <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase">
            <span>Total Scans</span>
            <History className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <div className="mt-1.5 text-2xl font-bold text-slate-100">{totalScans}</div>
          <div className="mt-1 text-[9px] text-slate-500">Evaluated Payloads</div>
        </div>

        <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3.5 backdrop-blur-md">
          <div className="flex items-center justify-between text-[10px] text-rose-400 uppercase">
            <span>Threats Flagged</span>
            <ShieldAlert className="h-3.5 w-3.5" />
          </div>
          <div className="mt-1.5 text-2xl font-bold text-rose-400">{threatsDetected}</div>
          <div className="mt-1 text-[9px] text-rose-400/70">Phishing & Blocked</div>
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5 backdrop-blur-md">
          <div className="flex items-center justify-between text-[10px] text-amber-400 uppercase">
            <span>Suspicious</span>
            <AlertTriangle className="h-3.5 w-3.5" />
          </div>
          <div className="mt-1.5 text-2xl font-bold text-amber-400">{suspiciousCount}</div>
          <div className="mt-1 text-[9px] text-amber-400/70">Moderate Risk</div>
        </div>

        <div className="rounded-xl border border-violet-500/30 bg-violet-950/20 p-3.5 backdrop-blur-md">
          <div className="flex items-center justify-between text-[10px] text-violet-400 uppercase">
            <span>Adversarial</span>
            <Lock className="h-3.5 w-3.5" />
          </div>
          <div className="mt-1.5 text-2xl font-bold text-violet-400">{adversarialCount}</div>
          <div className="mt-1 text-[9px] text-violet-400/70">Evasion Mutations</div>
        </div>

        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 backdrop-blur-md col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-[10px] text-emerald-400 uppercase">
            <span>Safe Inputs</span>
            <ShieldCheck className="h-3.5 w-3.5" />
          </div>
          <div className="mt-1.5 text-2xl font-bold text-emerald-400">{safeCount}</div>
          <div className="mt-1 text-[9px] text-emerald-400/70">Verified Clean</div>
        </div>
      </div>
    </div>
  );
};

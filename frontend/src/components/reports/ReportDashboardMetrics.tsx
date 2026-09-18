'use client';

import React from 'react';
import {
  FileText,
  ShieldAlert,
  ShieldCheck,
  FlaskConical,
  Clock,
  Sparkles,
  Plus,
} from 'lucide-react';
import { ReportRecord } from '@/types';

interface ReportDashboardMetricsProps {
  reports: ReportRecord[];
  onOpenGenerator: () => void;
  onSeedDefaults: () => void;
}

export const ReportDashboardMetrics: React.FC<ReportDashboardMetricsProps> = ({
  reports,
  onOpenGenerator,
  onSeedDefaults,
}) => {
  const totalReports = reports.length;
  const threatReports = reports.filter(
    (r) => r.verdict === 'PHISHING' || r.verdict === 'BLOCKED' || r.verdict === 'ADVERSARIAL'
  ).length;
  const robustnessReports = reports.filter(
    (r) => r.reportType === 'ROBUSTNESS_ASSESSMENT'
  ).length;
  const safeReports = reports.filter((r) => r.verdict === 'SAFE').length;

  return (
    <div className="space-y-4">
      {/* Top Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-slate-950/90 p-5 backdrop-blur-xl shadow-[0_0_35px_rgba(6,182,212,0.08)]">
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-pink-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/40 bg-gradient-to-br from-cyan-500/20 to-pink-600/20 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-mono text-xl font-bold tracking-wider text-slate-100 uppercase sm:text-2xl">
                  Security Analysis Reports
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-cyan-300 uppercase shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                  Simulated Reports
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                Generate, review, and export simulated forensic dossiers, robustness briefs, and STIX/JSON export bundles.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onSeedDefaults}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 font-mono text-xs font-semibold tracking-wider text-slate-300 uppercase transition-all duration-200 hover:border-slate-600 hover:text-slate-100"
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Seed Demo Reports</span>
            </button>

            <button
              type="button"
              onClick={onOpenGenerator}
              className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400 bg-gradient-to-r from-cyan-500 to-blue-600 px-3.5 py-1.5 font-mono text-xs font-bold tracking-wider text-slate-950 uppercase shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:scale-105 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Generate New Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 font-mono text-xs">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5 backdrop-blur-md">
          <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase">
            <span>Total Reports</span>
            <FileText className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <div className="mt-1.5 text-2xl font-bold text-slate-100">{totalReports}</div>
          <div className="mt-1 text-[9px] text-slate-500">Compiled Dossiers</div>
        </div>

        <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3.5 backdrop-blur-md">
          <div className="flex items-center justify-between text-[10px] text-rose-400 uppercase">
            <span>Threat Analyses</span>
            <ShieldAlert className="h-3.5 w-3.5" />
          </div>
          <div className="mt-1.5 text-2xl font-bold text-rose-400">{threatReports}</div>
          <div className="mt-1 text-[9px] text-rose-400/70">Phishing & High-Risk</div>
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5 backdrop-blur-md">
          <div className="flex items-center justify-between text-[10px] text-amber-400 uppercase">
            <span>Robustness Briefs</span>
            <FlaskConical className="h-3.5 w-3.5" />
          </div>
          <div className="mt-1.5 text-2xl font-bold text-amber-400">{robustnessReports}</div>
          <div className="mt-1 text-[9px] text-amber-400/70">Perturbation Tests</div>
        </div>

        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 backdrop-blur-md">
          <div className="flex items-center justify-between text-[10px] text-emerald-400 uppercase">
            <span>Safe Controls</span>
            <ShieldCheck className="h-3.5 w-3.5" />
          </div>
          <div className="mt-1.5 text-2xl font-bold text-emerald-400">{safeReports}</div>
          <div className="mt-1 text-[9px] text-emerald-400/70">Baseline Verification</div>
        </div>
      </div>
    </div>
  );
};

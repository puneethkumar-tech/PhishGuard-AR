'use client';

import React from 'react';
import {
  GitMerge,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  Activity,
} from 'lucide-react';
import { SignalFusionItemData } from '@/types';
import { AIHolographicPanel } from './AIHolographicPanel';

interface SignalFusionCoreProps {
  signals: SignalFusionItemData[];
  threatScore: number;
  verdict: 'SAFE' | 'SUSPICIOUS' | 'PHISHING' | 'ADVERSARIAL' | 'BLOCKED';
  isSimulating: boolean;
}

export const SignalFusionCore: React.FC<SignalFusionCoreProps> = ({
  signals,
  threatScore,
  verdict,
  isSimulating,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CRITICAL':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'WARNING':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'ELEVATED':
        return 'text-violet-400 bg-violet-500/10 border-violet-500/30';
      case 'NOMINAL':
      default:
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
  };

  const getVerdictBadge = () => {
    switch (verdict) {
      case 'SAFE':
        return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]';
      case 'SUSPICIOUS':
        return 'text-amber-400 bg-amber-500/20 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.3)]';
      case 'ADVERSARIAL':
        return 'text-violet-400 bg-violet-500/20 border-violet-500/40 shadow-[0_0_20px_rgba(139,92,246,0.3)]';
      case 'BLOCKED':
      case 'PHISHING':
      default:
        return 'text-rose-400 bg-rose-500/20 border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.3)]';
    }
  };

  return (
    <AIHolographicPanel
      title="Multi-Modal Signal Fusion Core"
      subtitle="Dynamic convergence of 8 independent conceptual signals into calibrated threat score"
      icon={GitMerge}
      badge="SIMULATED FUSION MATRIX"
      badgeColor="emerald"
    >
      <div className="font-mono text-xs">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-center">
          {/* Left: 8 Converging Signals (col-span-7) */}
          <div className="lg:col-span-7 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 uppercase pb-1 border-b border-cyan-500/15">
              <span>Input Threat Signal ({signals.length})</span>
              <span>Strength / Status</span>
            </div>

            {signals.map((sig) => {
              const strengthPercent = Math.round(sig.simulatedStrength * 100);

              return (
                <div
                  key={sig.id}
                  className="rounded-lg border border-slate-800 bg-slate-900/50 p-2.5 transition-all hover:border-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: sig.color }}
                      />
                      <span className="font-bold text-slate-100">{sig.name}</span>
                      <span className="text-[9px] text-slate-400">({sig.category})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded border px-1.5 py-0.2 text-[9px] font-bold uppercase ${getStatusBadge(
                          sig.status
                        )}`}
                      >
                        {sig.status}
                      </span>
                      <span className="font-bold text-slate-100 min-w-[36px] text-right">
                        {strengthPercent}%
                      </span>
                    </div>
                  </div>

                  {/* Animated Progress Bar */}
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${strengthPercent}%`,
                        backgroundColor: sig.color,
                        boxShadow: `0 0 8px ${sig.color}80`,
                      }}
                    />
                  </div>

                  <p className="mt-1 text-[9px] text-slate-400 truncate">{sig.description}</p>
                </div>
              );
            })}
          </div>

          {/* Center Connector Arrow / Animation (col-span-1) */}
          <div className="hidden lg:flex lg:col-span-1 flex-col items-center justify-center text-cyan-400">
            <ArrowRight className="h-6 w-6 animate-pulse" />
            <span className="text-[8px] uppercase tracking-widest text-slate-500 mt-1">FUSE</span>
          </div>

          {/* Right: Fusion Core Synthesis Result (col-span-4) */}
          <div className="lg:col-span-4 rounded-xl border border-cyan-500/40 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40 p-5 text-center shadow-[0_0_30px_rgba(6,182,212,0.15)] relative overflow-hidden">
            {/* Background Glow */}
            <div className="pointer-events-none absolute inset-0 bg-cyan-500/5 blur-xl" />

            <div className="relative z-10">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)] mb-3">
                <GitMerge className="h-5 w-5 animate-spin" style={{ animationDuration: '10s' }} />
              </div>

              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Calibrated Output Threat Score
              </div>

              <div className="mt-2 text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]">
                {(threatScore * 100).toFixed(1)}%
              </div>

              <div className="mt-3">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1 text-xs font-bold uppercase tracking-wider ${getVerdictBadge()}`}
                >
                  <ShieldAlert className="h-4 w-4" />
                  <span>{verdict}</span>
                </span>
              </div>

              <div className="mt-4 border-t border-cyan-500/20 pt-3 text-[10px] text-slate-400 space-y-1 text-left">
                <div className="flex justify-between">
                  <span>Concordance Index:</span>
                  <span className="text-cyan-400 font-semibold">98.2%</span>
                </div>
                <div className="flex justify-between">
                  <span>Uncertainty Margin:</span>
                  <span className="text-slate-300">±1.4%</span>
                </div>
                <div className="flex justify-between">
                  <span>Cross-Validation:</span>
                  <span className="text-emerald-400 font-semibold">PASSED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AIHolographicPanel>
  );
};

'use client';

import React from 'react';
import { Network, ArrowRight, ShieldCheck, Cpu, Brain, GitMerge, CheckCircle } from 'lucide-react';
import { AIHolographicPanel } from './AIHolographicPanel';

export const IntelligenceMap: React.FC = () => {
  const nodes = [
    { title: 'INPUT STREAM', subtitle: 'Raw Ingestion', icon: Cpu, color: 'text-cyan-400 border-cyan-500/30' },
    { title: '8 THREAT SIGNALS', subtitle: 'Feature Vectors', icon: Network, color: 'text-blue-400 border-blue-500/30' },
    { title: 'HYBRID MODELS', subtitle: 'SVM & Transformer', icon: Brain, color: 'text-pink-400 border-pink-500/30' },
    { title: 'ROBUSTNESS ENGINE', subtitle: 'Adversarial Defense', icon: ShieldCheck, color: 'text-amber-400 border-amber-500/30' },
    { title: 'SIGNAL FUSION', subtitle: 'Bayesian Synthesis', icon: GitMerge, color: 'text-emerald-400 border-emerald-500/30' },
    { title: 'THREAT VERDICT', subtitle: 'Calibrated Decision', icon: CheckCircle, color: 'text-rose-400 border-rose-500/30' },
  ];

  return (
    <AIHolographicPanel
      title="Conceptual AI Intelligence Map"
      subtitle="High-level architectural entity relationship from raw ingestion to calibrated verdict"
      icon={Network}
      badge="CONCEPTUAL MAP"
      badgeColor="cyan"
    >
      <div className="font-mono text-xs">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 items-center">
          {nodes.map((n, idx) => {
            const Icon = n.icon;
            return (
              <div
                key={n.title}
                className={`flex flex-col items-center rounded-xl border bg-slate-900/60 p-3 text-center transition-all duration-200 hover:scale-105 ${n.color}`}
              >
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg border border-current bg-current/10">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="text-[11px] font-bold text-slate-100 uppercase">{n.title}</div>
                <div className="text-[9px] text-slate-400 mt-0.5">{n.subtitle}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 text-center text-[9px] text-slate-400">
          ● Conceptual architecture map. No geographic telemetry implied.
        </div>
      </div>
    </AIHolographicPanel>
  );
};

'use client';

import React from 'react';
import {
  HelpCircle,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  FileSearch,
  CheckCircle2,
} from 'lucide-react';
import { AIExplainabilityNodeData } from '@/types';
import { AIHolographicPanel } from './AIHolographicPanel';

interface ExplainabilityGraphProps {
  nodes: AIExplainabilityNodeData[];
  verdict: 'SAFE' | 'SUSPICIOUS' | 'PHISHING' | 'ADVERSARIAL' | 'BLOCKED';
  confidenceScore: number;
}

export const ExplainabilityGraph: React.FC<ExplainabilityGraphProps> = ({
  nodes,
  verdict,
  confidenceScore,
}) => {
  return (
    <AIHolographicPanel
      title="Simulated Explainability Graph"
      subtitle="Visual evidence attribution connecting detected input signals to the simulated threat verdict"
      icon={HelpCircle}
      badge="SIMULATED ATTRIBUTION"
      badgeColor="rose"
    >
      <div className="font-mono text-xs">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {nodes.map((node, index) => {
            const contributionPct = Math.round(node.simulatedContribution * 100);

            return (
              <div
                key={node.id}
                className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 transition-all duration-200 hover:border-cyan-500/40 hover:bg-slate-900/90"
              >
                {/* Top: Category & Contribution */}
                <div className="flex items-center justify-between text-[10px]">
                  <span className="rounded border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-cyan-300 uppercase font-semibold">
                    {node.category}
                  </span>
                  <span className="font-bold text-slate-100">
                    Contribution: {contributionPct}%
                  </span>
                </div>

                {/* Node Title */}
                <h5 className="mt-2 text-xs font-bold text-slate-100 uppercase leading-snug">
                  {node.label}
                </h5>

                {/* Description */}
                <p className="mt-1.5 text-[10px] text-slate-400 leading-relaxed">
                  {node.description}
                </p>

                {/* Contribution Bar */}
                <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-rose-500"
                    style={{ width: `${contributionPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Verdict Summary */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-lg border border-cyan-500/20 bg-slate-900/50 p-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span className="text-slate-300 text-xs">
              Simulated multi-signal evidence converges on{' '}
              <strong className="text-slate-100">{verdict}</strong> with{' '}
              <strong className="text-cyan-400">{(confidenceScore * 100).toFixed(1)}%</strong> calibrated confidence.
            </span>
          </div>
          <span className="text-[9px] text-slate-400 uppercase">
            Model Signal Contributions (Conceptual)
          </span>
        </div>
      </div>
    </AIHolographicPanel>
  );
};

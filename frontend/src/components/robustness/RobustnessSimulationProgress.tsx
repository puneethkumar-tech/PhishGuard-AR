'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { CheckCircle2, Loader2, Sparkles, Shield, Zap, RefreshCw } from 'lucide-react';

interface RobustnessSimulationProgressProps {
  currentStep: number; // 1 to 5
}

const STEPS = [
  { id: 1, label: 'Input Ingested', sub: 'Payload normalized & tokenized' },
  { id: 2, label: 'Baseline Established', sub: 'Unperturbed classifier benchmark' },
  { id: 3, label: 'Perturbation Injected', sub: 'Adversarial transformations applied' },
  { id: 4, label: 'Model Response Analyzed', sub: 'Signal degradation & delta evaluated' },
  { id: 5, label: 'AR Defense Hardened', sub: 'Synthesizing resilience metrics' },
];

export const RobustnessSimulationProgress: React.FC<RobustnessSimulationProgressProps> = ({
  currentStep,
}) => {
  return (
    <GlassCard className="p-5 sm:p-6 space-y-4 border-cyber-cyan/40 shadow-cyan-glow/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 text-cyber-cyan animate-spin" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-text">
            Simulating Adversarial Stress-Test Pipeline
          </h4>
        </div>
        <span className="text-[11px] font-mono text-cyber-cyan font-bold">
          Step {currentStep} of 5
        </span>
      </div>

      {/* Pipeline Visual Track */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 pt-2">
        {STEPS.map((s) => {
          const isDone = currentStep > s.id;
          const isActive = currentStep === s.id;

          return (
            <div
              key={s.id}
              className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between ${
                isDone
                  ? 'bg-cyber-success/15 border-cyber-success/40 text-cyber-success'
                  : isActive
                  ? 'bg-cyber-cyan/15 border-cyber-cyan/60 text-cyber-cyan shadow-cyan-glow/30'
                  : 'bg-surface-2/40 border-border/50 text-text-muted opacity-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold">0{s.id}</span>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyber-success" />
                ) : isActive ? (
                  <Loader2 className="w-3.5 h-3.5 text-cyber-cyan animate-spin" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-border" />
                )}
              </div>

              <div>
                <span className="text-xs font-bold block leading-tight font-mono">
                  {s.label}
                </span>
                <span className="text-[10px] text-text-muted block mt-0.5 leading-snug">
                  {s.sub}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};

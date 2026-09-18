'use client';

import React from 'react';
import { Clock, CheckCircle2, Activity, Zap } from 'lucide-react';
import { InferenceTimelineStep } from '@/types';
import { AIHolographicPanel } from './AIHolographicPanel';

interface AIInferenceTimelineProps {
  steps: InferenceTimelineStep[];
  isSimulating: boolean;
}

export const AIInferenceTimeline: React.FC<AIInferenceTimelineProps> = ({
  steps,
  isSimulating,
}) => {
  return (
    <AIHolographicPanel
      title="Simulated Inference Execution Timeline"
      subtitle="Deterministic timecodes and stage durations during simulated reasoning"
      icon={Clock}
      badge="SIMULATED TIMELINE"
      badgeColor="cyan"
    >
      <div className="font-mono text-xs">
        <div className="space-y-2">
          {steps.map((step) => {
            const isCompleted = step.status === 'COMPLETED';
            const isActive = step.status === 'ACTIVE';

            return (
              <div
                key={step.stepNumber}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border p-2.5 transition-all duration-300 ${
                  isActive
                    ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : isCompleted
                    ? 'border-emerald-500/30 bg-emerald-950/20'
                    : 'border-slate-800 bg-slate-900/40 opacity-60'
                }`}
              >
                {/* Left: Timecode & Step title */}
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                      isActive
                        ? 'bg-cyan-400 text-slate-950'
                        : isCompleted
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {step.timecode}
                  </span>

                  <div>
                    <div className="font-bold text-slate-100 text-[11px] uppercase">
                      {step.title}
                    </div>
                    <div className="text-[9px] text-slate-400">{step.layer}</div>
                  </div>
                </div>

                {/* Right: Description & Status */}
                <div className="flex items-center gap-3">
                  <span className="hidden md:inline text-[10px] text-slate-400 max-w-xs truncate">
                    {step.description}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[9px] font-bold uppercase ${
                      isActive
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 animate-pulse'
                        : isCompleted
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    ) : isActive ? (
                      <Activity className="h-3 w-3 text-cyan-400 animate-spin" />
                    ) : null}
                    <span>{step.status}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AIHolographicPanel>
  );
};

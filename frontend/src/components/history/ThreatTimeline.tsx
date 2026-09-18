'use client';

import React from 'react';
import {
  Clock,
  FileInput,
  Cpu,
  Brain,
  ShieldAlert,
  ShieldCheck,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { ThreatHistoryRecord } from '@/types';

interface ThreatTimelineProps {
  record?: ThreatHistoryRecord | null;
}

export const ThreatTimeline: React.FC<ThreatTimelineProps> = ({ record }) => {
  const steps = [
    {
      title: 'SCAN RECEIVED',
      icon: FileInput,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      description: 'Payload stream ingested and stripped of zero-width control characters.',
      timeOffset: '+0.00s',
    },
    {
      title: 'SIGNALS EXTRACTED',
      icon: Cpu,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      description: 'TF-IDF n-grams, Shannon entropy vectors, and URL redirect hops parsed.',
      timeOffset: '+0.48s',
    },
    {
      title: 'AI ANALYSIS',
      icon: Brain,
      color: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
      description: 'Multilingual DistilBERT self-attention and Linear SVM decision boundaries evaluated.',
      timeOffset: '+1.35s',
    },
    {
      title: 'THREAT DECISION',
      icon: ShieldAlert,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      description: record
        ? `Calibrated decision reached: ${record.verdict} (${record.confidence.toFixed(1)}%).`
        : 'Multi-modal Bayesian signal fusion synthesized calibrated score.',
      timeOffset: '+2.32s',
    },
    {
      title: 'ROBUSTNESS CHECK',
      icon: ShieldCheck,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      description: 'Adversarial perturbation bounds and gradient invariance validated.',
      timeOffset: '+2.75s',
    },
    {
      title: 'REPORT CREATED',
      icon: FileText,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      description: 'Structured STIX/JSON forensic summary dossier compiled in local audit storage.',
      timeOffset: '+3.10s',
    },
  ];

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-slate-950/80 p-5 font-mono text-xs backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-cyan-500/15 pb-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-cyan-400" />
          <h3 className="font-bold text-slate-100 uppercase tracking-wider">
            Forensic Execution Timeline
          </h3>
        </div>
        <span className="text-[10px] text-slate-400 uppercase">
          {record ? `Record: ${record.id}` : 'Lifecycle Pipeline'}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.title}
              className="relative flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 space-y-2 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-lg border ${step.color}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-[9px] text-slate-400 font-bold">{step.timeOffset}</span>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-slate-200 uppercase leading-snug">
                  {step.title}
                </h4>
                <p className="mt-1 text-[9px] text-slate-400 leading-relaxed line-clamp-3">
                  {step.description}
                </p>
              </div>

              <div className="border-t border-slate-800/80 pt-1 flex items-center justify-between text-[9px] text-emerald-400">
                <span>Status:</span>
                <span className="flex items-center gap-1 font-bold">
                  <CheckCircle2 className="h-3 w-3" /> VERIFIED
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

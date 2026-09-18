'use client';

import React from 'react';
import {
  FileInput,
  Cpu,
  Binary,
  Globe2,
  GitMerge,
  ShieldCheck,
  AlertTriangle,
  FileText,
  ChevronRight,
  CheckCircle2,
  Clock,
  Zap,
} from 'lucide-react';
import { InferenceSimulationStage } from '@/types';
import { AIHolographicPanel } from './AIHolographicPanel';

interface PipelineStepConfig {
  number: string;
  name: string;
  shortDesc: string;
  icon: React.ComponentType<{ className?: string }>;
  stageKey: InferenceSimulationStage;
  metric: string;
}

const PIPELINE_STEPS: PipelineStepConfig[] = [
  {
    number: '01',
    name: 'INPUT INGESTION',
    shortDesc: 'UTF-8 sanitization & raw stream parsing',
    icon: FileInput,
    stageKey: 'INGESTING',
    metric: '350ms',
  },
  {
    number: '02',
    name: 'FEATURE EXTRACTION',
    shortDesc: 'N-grams, entropy & homoglyph extraction',
    icon: Cpu,
    stageKey: 'FEATURE_EXTRACTION',
    metric: '400ms',
  },
  {
    number: '03',
    name: 'TF-IDF + SVM',
    shortDesc: 'Lexical frequency & linear decision boundary',
    icon: Binary,
    stageKey: 'SVM_ANALYSIS',
    metric: '94.2% Mal',
  },
  {
    number: '04',
    name: 'DISTILBERT AR',
    shortDesc: 'Multilingual transformer contextual embeddings',
    icon: Globe2,
    stageKey: 'DISTILBERT_ANALYSIS',
    metric: '96.1% Mal',
  },
  {
    number: '05',
    name: 'SIGNAL FUSION',
    shortDesc: 'Cross-model Bayesian multi-signal synthesis',
    icon: GitMerge,
    stageKey: 'SIGNAL_FUSION',
    metric: '8 Signals',
  },
  {
    number: '06',
    name: 'ROBUSTNESS ENGINE',
    shortDesc: 'Adversarial perturbation invariance validation',
    icon: ShieldCheck,
    stageKey: 'ROBUSTNESS_CHECK',
    metric: '92% Robust',
  },
  {
    number: '07',
    name: 'THREAT DECISION',
    shortDesc: 'Final calibrated threat verdict classification',
    icon: AlertTriangle,
    stageKey: 'DECISION',
    metric: '96.4% Phish',
  },
  {
    number: '08',
    name: 'EXPLANATION GRAPH',
    shortDesc: 'Simulated evidence contribution decomposition',
    icon: FileText,
    stageKey: 'EXPLANATION',
    metric: 'Ready',
  },
];

interface AIInferencePipelineProps {
  currentStage: InferenceSimulationStage;
  isSimulating: boolean;
  onSelectStage?: (stage: InferenceSimulationStage) => void;
}

export const AIInferencePipeline: React.FC<AIInferencePipelineProps> = ({
  currentStage,
  isSimulating,
  onSelectStage,
}) => {
  const getStageStatus = (stepStage: InferenceSimulationStage) => {
    const stageOrder: InferenceSimulationStage[] = [
      'INGESTING',
      'FEATURE_EXTRACTION',
      'SVM_ANALYSIS',
      'DISTILBERT_ANALYSIS',
      'SIGNAL_FUSION',
      'ROBUSTNESS_CHECK',
      'DECISION',
      'EXPLANATION',
      'COMPLETE',
    ];

    if (currentStage === 'COMPLETE') return 'COMPLETED';
    if (currentStage === 'READY') return 'READY';

    const currentIndex = stageOrder.indexOf(currentStage);
    const stepIndex = stageOrder.indexOf(stepStage);

    if (currentIndex > stepIndex) return 'COMPLETED';
    if (currentIndex === stepIndex) return 'ACTIVE';
    return 'READY';
  };

  return (
    <AIHolographicPanel
      title="AI Detection & Robustness Pipeline"
      subtitle="Step-by-step conceptual workflow from raw payload input to calibrated threat verdict"
      icon={Zap}
      badge="SIMULATED AI WORKFLOW"
      badgeColor="cyan"
    >
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
        {PIPELINE_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const status = getStageStatus(step.stageKey);
          const isActive = status === 'ACTIVE';
          const isCompleted = status === 'COMPLETED';

          return (
            <div
              key={step.number}
              onClick={() => onSelectStage?.(step.stageKey)}
              className={`group relative flex flex-col justify-between rounded-xl border p-3 font-mono transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.3)] scale-[1.02]'
                  : isCompleted
                  ? 'border-emerald-500/40 bg-emerald-500/10 hover:border-emerald-400'
                  : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
              }`}
            >
              {/* Step Number & Status Indicator */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold ${
                    isActive
                      ? 'text-cyan-300'
                      : isCompleted
                      ? 'text-emerald-400'
                      : 'text-slate-400'
                  }`}
                >
                  {step.number}
                </span>

                {isCompleted ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                ) : isActive ? (
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                ) : (
                  <Clock className="h-3 w-3 text-slate-400" />
                )}
              </div>

              {/* Icon & Title */}
              <div className="my-2.5">
                <div
                  className={`mb-1.5 flex h-7 w-7 items-center justify-center rounded-lg border ${
                    isActive
                      ? 'border-cyan-400/60 bg-cyan-500/30 text-cyan-300'
                      : isCompleted
                      ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                      : 'border-slate-700 bg-slate-800 text-slate-400'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <h5 className="text-[11px] font-bold text-slate-100 leading-tight uppercase">
                  {step.name}
                </h5>
                <p className="mt-1 text-[9px] text-slate-400 line-clamp-2 leading-relaxed">
                  {step.shortDesc}
                </p>
              </div>

              {/* Metric Tag */}
              <div className="mt-1 flex items-center justify-between border-t border-slate-800/80 pt-1.5 text-[9px]">
                <span className="text-slate-400">Value:</span>
                <span
                  className={`font-semibold ${
                    isActive
                      ? 'text-cyan-300'
                      : isCompleted
                      ? 'text-emerald-300'
                      : 'text-slate-300'
                  }`}
                >
                  {step.metric}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </AIHolographicPanel>
  );
};

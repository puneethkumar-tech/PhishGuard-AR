'use client';

import React from 'react';
import {
  Brain,
  Play,
  RotateCcw,
  Box,
  Layers,
  Sparkles,
  GitMerge,
  Network,
  HelpCircle,
  Activity,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { AIVisualizationMode, InferenceSimulationStage } from '@/types';

interface AIIntelligenceHeaderProps {
  activeMode: AIVisualizationMode;
  onModeChange: (mode: AIVisualizationMode) => void;
  is3DView: boolean;
  onToggle3DView: () => void;
  inferenceStage: InferenceSimulationStage;
  isSimulating: boolean;
  onRunSimulation: () => void;
  onReset: () => void;
}

export const AIIntelligenceHeader: React.FC<AIIntelligenceHeaderProps> = ({
  activeMode,
  onModeChange,
  is3DView,
  onToggle3DView,
  inferenceStage,
  isSimulating,
  onRunSimulation,
  onReset,
}) => {
  const modes: { id: AIVisualizationMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'PIPELINE', label: 'Pipeline', icon: Layers },
    { id: 'NEURAL_NETWORK', label: 'Neural Network', icon: Brain },
    { id: 'SIGNAL_FUSION', label: 'Signal Fusion', icon: GitMerge },
    { id: 'THREAT_CONSTELLATION', label: 'Threat Constellation', icon: Network },
    { id: 'EXPLAINABILITY', label: 'Explainability', icon: HelpCircle },
  ];

  const getStageDisplay = (stage: InferenceSimulationStage) => {
    switch (stage) {
      case 'READY':
        return { label: 'SYSTEM READY', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' };
      case 'INGESTING':
        return { label: 'INGESTING PAYLOAD', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
      case 'FEATURE_EXTRACTION':
        return { label: 'EXTRACTING SIGNALS', color: 'text-violet-400 bg-violet-500/10 border-violet-500/30' };
      case 'SVM_ANALYSIS':
        return { label: 'SVM LEXICAL INFERENCE', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' };
      case 'DISTILBERT_ANALYSIS':
        return { label: 'TRANSFORMER ATTENTION', color: 'text-pink-400 bg-pink-500/10 border-pink-500/30' };
      case 'SIGNAL_FUSION':
        return { label: 'BAYESIAN FUSION', color: 'text-teal-400 bg-teal-500/10 border-teal-500/30' };
      case 'ROBUSTNESS_CHECK':
        return { label: 'ROBUSTNESS CHECK', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
      case 'DECISION':
        return { label: 'SYNTHESIZING VERDICT', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
      case 'EXPLANATION':
        return { label: 'ATTRIBUTION GRAPH', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' };
      case 'COMPLETE':
        return { label: 'ANALYSIS COMPLETE', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
      default:
        return { label: 'SYSTEM READY', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' };
    }
  };

  const currentStageInfo = getStageDisplay(inferenceStage);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-slate-950/90 p-5 backdrop-blur-xl shadow-[0_0_40px_rgba(6,182,212,0.08)]">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

      {/* Top row: Title, Subtitle, Simulation Badge, Action buttons */}
      <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/40 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Brain className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="font-mono text-xl font-bold tracking-wider text-slate-100 uppercase sm:text-2xl">
                  AI Intelligence Core
                </h2>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 font-mono text-[10px] font-semibold tracking-wider text-cyan-300 uppercase shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                  Simulated AI Environment
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                Interactive visualization of the PhishGuard-AR detection and adversarial robustness pipeline
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Indicator */}
          <div
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider ${currentStageInfo.color}`}
          >
            {isSimulating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : inferenceStage === 'COMPLETE' ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
              <Activity className="h-3.5 w-3.5" />
            )}
            <span>{currentStageInfo.label}</span>
          </div>

          {/* 2D / 3D Toggle */}
          <button
            type="button"
            onClick={onToggle3DView}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
              is3DView
                ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                : 'border-slate-700 bg-slate-900/80 text-slate-300 hover:border-slate-600'
            }`}
          >
            <Box className="h-3.5 w-3.5" />
            <span>{is3DView ? '3D View' : '2D View'}</span>
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={onReset}
            disabled={isSimulating}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 font-mono text-xs font-semibold tracking-wider text-slate-300 uppercase transition-all duration-200 hover:border-slate-600 hover:text-slate-100 disabled:opacity-50"
            title="Reset AI Intelligence to default state"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>

          {/* Run Simulated Inference */}
          <button
            type="button"
            onClick={onRunSimulation}
            disabled={isSimulating}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg border border-cyan-400 bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-1.5 font-mono text-xs font-bold tracking-wider text-slate-950 uppercase shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all duration-200 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] active:scale-95 disabled:opacity-50"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            {isSimulating ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-950" />
                <span>Simulating...</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-slate-950 text-slate-950" />
                <span>Run Simulated Inference</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className="relative z-10 mt-5 flex items-center gap-1.5 overflow-x-auto border-t border-cyan-500/15 pt-4 no-scrollbar">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = activeMode === mode.id;

          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => onModeChange(mode.id)}
              className={`inline-flex items-center gap-2 whitespace-nowrap rounded-lg border px-3.5 py-2 font-mono text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                isActive
                  ? 'border-cyan-400/60 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                  : 'border-transparent text-slate-400 hover:border-slate-800 hover:bg-slate-900/60 hover:text-slate-200'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{mode.label}</span>
              {isActive && (
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

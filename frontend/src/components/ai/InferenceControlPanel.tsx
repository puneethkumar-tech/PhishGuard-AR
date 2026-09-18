'use client';

import React from 'react';
import {
  Sparkles,
  Gauge,
  Sliders,
  Terminal,
  ShieldAlert,
  Clock,
  Cpu,
  Layers,
  CheckCircle,
} from 'lucide-react';
import { AIDemoScenarioData, InferenceSimulationStage } from '@/types';
import { AI_DEMO_SCENARIOS } from '@/lib/ai-visualization-demo-data';

interface InferenceControlPanelProps {
  selectedScenarioId: string;
  onSelectScenario: (scenarioId: string) => void;
  speed: 'slow' | 'normal' | 'fast';
  onSpeedChange: (speed: 'slow' | 'normal' | 'fast') => void;
  inferenceStage: InferenceSimulationStage;
  isSimulating: boolean;
  elapsedMs: number;
}

export const InferenceControlPanel: React.FC<InferenceControlPanelProps> = ({
  selectedScenarioId,
  onSelectScenario,
  speed,
  onSpeedChange,
  inferenceStage,
  isSimulating,
  elapsedMs,
}) => {
  const currentScenario =
    AI_DEMO_SCENARIOS.find((s) => s.id === selectedScenarioId) || AI_DEMO_SCENARIOS[0];

  const getActiveLayerName = (stage: InferenceSimulationStage): string => {
    switch (stage) {
      case 'INGESTING':
        return 'Layer 0: Input Signals';
      case 'FEATURE_EXTRACTION':
        return 'Layer 1: Text & Token Features';
      case 'SVM_ANALYSIS':
        return 'Layer 2: Structural Features';
      case 'DISTILBERT_ANALYSIS':
        return 'Layer 3: Semantic Representation';
      case 'ROBUSTNESS_CHECK':
        return 'Layer 4: Robustness Analysis';
      case 'SIGNAL_FUSION':
        return 'Layer 5: Signal Fusion';
      case 'DECISION':
      case 'EXPLANATION':
      case 'COMPLETE':
        return 'Layer 6: Threat Decision Core';
      case 'READY':
      default:
        return 'Idle / Standby';
    }
  };

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-slate-950/70 p-4 backdrop-blur-md">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Scenario Selector (col-span-5) */}
        <div className="lg:col-span-5">
          <label
            htmlFor="scenario-select"
            className="mb-1.5 flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-slate-300"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>Select Demo Scenario</span>
          </label>
          <select
            id="scenario-select"
            value={selectedScenarioId}
            onChange={(e) => onSelectScenario(e.target.value)}
            disabled={isSimulating}
            className="w-full rounded-lg border border-cyan-500/30 bg-slate-900/90 px-3 py-2 font-mono text-xs text-slate-200 shadow-inner transition-colors focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 disabled:opacity-50"
          >
            {AI_DEMO_SCENARIOS.map((sc) => (
              <option key={sc.id} value={sc.id}>
                {sc.name} [{sc.category}]
              </option>
            ))}
          </select>

          {/* Sample Input Preview */}
          <div className="mt-2.5 rounded-lg border border-slate-800 bg-slate-900/50 p-2.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase">
              <span className="flex items-center gap-1">
                <Terminal className="h-3 w-3 text-cyan-400" /> Simulated Payload
              </span>
              <span className="text-cyan-400 font-semibold">{currentScenario.category}</span>
            </div>
            <p className="mt-1 line-clamp-2 text-xs font-mono text-slate-300">
              &ldquo;{currentScenario.sampleInput}&rdquo;
            </p>
          </div>
        </div>

        {/* Speed Controls (col-span-3) */}
        <div className="lg:col-span-3 flex flex-col justify-between">
          <div>
            <span className="mb-1.5 flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-slate-300">
              <Gauge className="h-3.5 w-3.5 text-cyan-400" />
              <span>Simulation Speed</span>
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {(['slow', 'normal', 'fast'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onSpeedChange(s)}
                  className={`rounded-lg border px-2 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider transition-all duration-200 ${
                    speed === s
                      ? 'border-cyan-400/60 bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {s === 'slow' ? '0.5x' : s === 'normal' ? '1.0x' : '2.0x'}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-2 text-[10px] font-mono text-slate-400 flex items-center gap-1">
            <Sliders className="h-3 w-3 text-cyan-400" /> Deterministic visual rate
          </div>
        </div>

        {/* Live Simulation Telemetry Status (col-span-4) */}
        <div className="lg:col-span-4 rounded-lg border border-cyan-500/20 bg-slate-900/40 p-3">
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div>
              <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase">
                <Layers className="h-3 w-3 text-cyan-400" /> Active Layer
              </div>
              <div className="mt-0.5 truncate text-xs font-semibold text-slate-200">
                {getActiveLayerName(inferenceStage)}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase">
                <Clock className="h-3 w-3 text-cyan-400" /> Sim Duration
              </div>
              <div className="mt-0.5 text-xs font-semibold text-cyan-400">
                {(elapsedMs / 1000).toFixed(2)}s
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase">
                <Cpu className="h-3 w-3 text-cyan-400" /> Signal Status
              </div>
              <div className="mt-0.5 text-xs font-semibold text-slate-200">
                {isSimulating ? 'Processing 8/8' : inferenceStage === 'COMPLETE' ? '8 Calibrated' : 'Standby'}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase">
                <ShieldAlert className="h-3 w-3 text-cyan-400" /> Target Verdict
              </div>
              <div className="mt-0.5 text-xs font-semibold text-slate-200">
                {currentScenario.verdict} ({Math.round(currentScenario.confidenceScore * 100)}%)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

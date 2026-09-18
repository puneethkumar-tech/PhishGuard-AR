'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { RobustnessAttackStrength } from '@/types';
import { Sliders, Zap, Shield, Sparkles, Check, Play } from 'lucide-react';

interface PerturbationControlsProps {
  attackStrength: RobustnessAttackStrength;
  onChangeStrength: (strength: RobustnessAttackStrength) => void;
  intensity: number;
  onChangeIntensity: (val: number) => void;
  mutationCount: number;
  onChangeMutationCount: (val: number) => void;
  preserveSemantics: boolean;
  onToggleSemantics: () => void;
  preserveUrlStructure: boolean;
  onToggleUrlStructure: () => void;
  onRunSimulation: () => void;
  isSimulating: boolean;
}

export const PerturbationControls: React.FC<PerturbationControlsProps> = ({
  attackStrength,
  onChangeStrength,
  intensity,
  onChangeIntensity,
  mutationCount,
  onChangeMutationCount,
  preserveSemantics,
  onToggleSemantics,
  preserveUrlStructure,
  onToggleUrlStructure,
  onRunSimulation,
  isSimulating,
}) => {
  return (
    <GlassCard className="p-5 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyber-violet/20 text-purple-300">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text uppercase tracking-wider font-mono">
              3. Perturbation & Calibration Controls
            </h3>
            <p className="text-[11px] text-text-muted">
              Configure deterministic parameters to modulate simulated attack severity.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-purple-300 bg-cyber-violet/20 px-2 py-0.5 rounded border border-cyber-violet/40">
          SIMULATED CALIBRATION
        </span>
      </div>

      {/* Main Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-end">
        {/* Control 1: Attack Strength Tabs */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-text-muted flex justify-between">
            <span>Attack Strength:</span>
            <span
              className={`font-bold ${
                attackStrength === 'HIGH'
                  ? 'text-cyber-danger'
                  : attackStrength === 'MEDIUM'
                  ? 'text-cyber-warning'
                  : 'text-cyber-cyan'
              }`}
            >
              {attackStrength}
            </span>
          </label>

          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-surface-2 border border-border">
            {(['LOW', 'MEDIUM', 'HIGH'] as RobustnessAttackStrength[]).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => onChangeStrength(st)}
                className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  attackStrength === st
                    ? st === 'HIGH'
                      ? 'bg-cyber-danger text-white shadow-danger-glow'
                      : st === 'MEDIUM'
                      ? 'bg-cyber-warning text-black font-extrabold shadow-glass'
                      : 'bg-cyber-cyan text-black font-extrabold shadow-glass'
                    : 'text-text-muted hover:text-text hover:bg-surface-3'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Control 2: Perturbation Intensity Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-text-muted">Perturbation Intensity:</span>
            <span className="text-cyber-cyan font-bold">{intensity}%</span>
          </div>

          <div className="space-y-1">
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={intensity}
              onChange={(e) => onChangeIntensity(Number(e.target.value))}
              className="w-full accent-cyber-cyan bg-surface-2 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] font-mono text-text-muted">
              <span>10% (Subtle)</span>
              <span>50% (Standard)</span>
              <span>100% (Aggressive)</span>
            </div>
          </div>
        </div>

        {/* Control 3: Mutation Count Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-text-muted">Mutation Count:</span>
            <span className="text-purple-300 font-bold">{mutationCount} mutations</span>
          </div>

          <div className="space-y-1">
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={mutationCount}
              onChange={(e) => onChangeMutationCount(Number(e.target.value))}
              className="w-full accent-purple-400 bg-surface-2 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] font-mono text-text-muted">
              <span>1 token</span>
              <span>5 tokens</span>
              <span>10 tokens</span>
            </div>
          </div>
        </div>

        {/* Control 4: Toggles */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-text-muted block">
            Constraint Toggles:
          </label>

          <div className="space-y-1.5">
            <button
              type="button"
              onClick={onToggleSemantics}
              className={`w-full py-1.5 px-2.5 rounded-lg border text-[11px] font-mono flex items-center justify-between transition-all ${
                preserveSemantics
                  ? 'bg-cyber-cyan/15 border-cyber-cyan/40 text-cyber-cyan'
                  : 'bg-surface-2 border-border text-text-muted'
              }`}
            >
              <span>Preserve Semantics</span>
              <span className={`text-[10px] font-bold ${preserveSemantics ? 'text-cyber-cyan' : 'text-text-muted'}`}>
                {preserveSemantics ? 'ON' : 'OFF'}
              </span>
            </button>

            <button
              type="button"
              onClick={onToggleUrlStructure}
              className={`w-full py-1.5 px-2.5 rounded-lg border text-[11px] font-mono flex items-center justify-between transition-all ${
                preserveUrlStructure
                  ? 'bg-purple-500/15 border-purple-400/40 text-purple-300'
                  : 'bg-surface-2 border-border text-text-muted'
              }`}
            >
              <span>Preserve URL Format</span>
              <span className={`text-[10px] font-bold ${preserveUrlStructure ? 'text-purple-300' : 'text-text-muted'}`}>
                {preserveUrlStructure ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Trigger Button */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border/70">
        <p className="text-[11px] font-mono text-text-muted">
          All calculations are deterministic simulated model responses.
        </p>

        <GlowButton
          variant="danger"
          size="lg"
          onClick={onRunSimulation}
          isLoading={isSimulating}
          className="w-full sm:w-auto shadow-danger-glow"
          leftIcon={<Play className="w-4 h-4 fill-current" />}
        >
          {isSimulating ? 'Simulating Perturbation Pipeline...' : 'Simulate Adversarial Attack'}
        </GlowButton>
      </div>
    </GlassCard>
  );
};

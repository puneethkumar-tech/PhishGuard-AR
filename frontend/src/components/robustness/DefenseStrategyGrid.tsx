'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { GlowButton } from '@/components/ui/GlowButton';
import { ROBUSTNESS_DEFENSE_STRATEGIES } from '@/lib/robustness-demo-data';
import { RobustnessDefenseType, RobustnessDefenseStrategy } from '@/types';
import {
  ShieldCheck,
  CheckCircle2,
  Globe,
  Cpu,
  Sparkles,
  Sliders,
  RefreshCw,
  Zap,
} from 'lucide-react';

interface DefenseStrategyGridProps {
  activeDefense: RobustnessDefenseType;
  onSelectDefense: (strategy: RobustnessDefenseType) => void;
  onRunHardening: () => void;
  isHardening: boolean;
}

export const DefenseStrategyGrid: React.FC<DefenseStrategyGridProps> = ({
  activeDefense,
  onSelectDefense,
  onRunHardening,
  isHardening,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'CheckCircle2':
        return <CheckCircle2 className="w-4 h-4 text-cyber-success" />;
      case 'Globe':
        return <Globe className="w-4 h-4 text-cyber-cyan" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4 text-purple-300" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-amber-300" />;
      case 'Sliders':
        return <Sliders className="w-4 h-4 text-blue-300" />;
      case 'ShieldCheck':
      default:
        return <ShieldCheck className="w-4 h-4 text-cyber-success" />;
    }
  };

  return (
    <GlassCard className="p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyber-success/20 text-cyber-success">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text uppercase tracking-wider font-mono">
              Defensive Hardening Strategies
            </h3>
            <p className="text-[11px] text-text-muted">
              Select an adversarial countermeasure to simulate feature recovery and confidence restoration.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" size="sm">
            READY TO SIMULATE
          </Badge>
        </div>
      </div>

      {/* Grid of 6 Defense Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {ROBUSTNESS_DEFENSE_STRATEGIES.map((strat) => {
          const isSelected = activeDefense === strat.id;

          return (
            <div
              key={strat.id}
              onClick={() => onSelectDefense(strat.id)}
              className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-b from-cyber-success/15 to-surface-2/90 border-cyber-success/70 shadow-glass-glow ring-1 ring-cyber-success/40'
                  : 'bg-surface-2/60 hover:bg-surface-2/90 border-border text-text-muted hover:text-text'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-surface-3">
                      {getIcon(strat.icon)}
                    </div>
                    <span className="text-xs font-bold text-text font-mono">
                      {strat.name}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-cyber-success/20 text-cyber-success border border-cyber-success/40">
                    {strat.status}
                  </span>
                </div>

                <p className="text-[11px] text-text-muted leading-relaxed mb-3">
                  {strat.purpose}
                </p>
              </div>

              <div className="pt-2 border-t border-border/60 space-y-2">
                <p className="text-[10px] text-cyber-cyan italic leading-snug">
                  <span className="font-semibold text-text">Expected Effect: </span>
                  {strat.expectedEffect}
                </p>

                <button
                  type="button"
                  className={`w-full py-1.5 px-2.5 rounded-lg text-[11px] font-mono font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-cyber-success text-black font-extrabold shadow-glass-glow'
                      : 'bg-surface-3 hover:bg-surface-2 text-text-muted hover:text-text border border-border'
                  }`}
                >
                  {isSelected ? 'Active Countermeasure' : 'Select Countermeasure'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Workflow Trigger */}
      <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border/70">
        <p className="text-[11px] font-mono text-text-muted">
          Does not execute live model retraining; simulates mathematical defense recovery.
        </p>

        <GlowButton
          variant="primary"
          size="lg"
          onClick={onRunHardening}
          isLoading={isHardening}
          leftIcon={<RefreshCw className="w-4 h-4" />}
          className="shadow-glass-glow"
        >
          {isHardening ? 'Hardening Model Pipeline...' : 'Run Hardening Simulation'}
        </GlowButton>
      </div>
    </GlassCard>
  );
};

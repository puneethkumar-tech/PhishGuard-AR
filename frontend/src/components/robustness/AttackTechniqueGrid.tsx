'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { GlowButton } from '@/components/ui/GlowButton';
import { ROBUSTNESS_ATTACK_STRATEGIES } from '@/lib/robustness-demo-data';
import { RobustnessAttackType, RobustnessAttackStrategy } from '@/types';
import {
  Type,
  Globe,
  RefreshCw,
  AlertTriangle,
  Sliders,
  PlusCircle,
  ShieldAlert,
  Zap,
  CheckCircle2,
} from 'lucide-react';

interface AttackTechniqueGridProps {
  selectedAttack: RobustnessAttackType;
  onSelectAttack: (attackType: RobustnessAttackType) => void;
  disabled?: boolean;
}

export const AttackTechniqueGrid: React.FC<AttackTechniqueGridProps> = ({
  selectedAttack,
  onSelectAttack,
  disabled = false,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Type':
        return <Type className="w-4 h-4" />;
      case 'Globe':
        return <Globe className="w-4 h-4" />;
      case 'RefreshCw':
        return <RefreshCw className="w-4 h-4" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-4 h-4" />;
      case 'Sliders':
        return <Sliders className="w-4 h-4" />;
      case 'PlusCircle':
        return <PlusCircle className="w-4 h-4" />;
      case 'ShieldAlert':
      default:
        return <ShieldAlert className="w-4 h-4" />;
    }
  };

  const getRiskVariant = (risk: string): 'danger' | 'warning' | 'cyan' => {
    switch (risk) {
      case 'CRITICAL':
      case 'HIGH':
        return 'danger';
      case 'MEDIUM':
        return 'warning';
      default:
        return 'cyan';
    }
  };

  return (
    <GlassCard className="p-5 sm:p-6 space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyber-danger/20 text-cyber-danger">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text uppercase tracking-wider font-mono">
              2. Attack Configuration & Strategies
            </h3>
            <p className="text-[11px] text-text-muted">
              Select an adversarial transformation vector to evaluate classifier resilience.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-cyber-danger font-bold uppercase">
          7 SIMULATED STRATEGIES
        </span>
      </div>

      {/* Grid of Attack Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {ROBUSTNESS_ATTACK_STRATEGIES.map((strat, index) => {
          const isSelected = selectedAttack === strat.id;

          return (
            <div
              key={strat.id}
              onClick={() => !disabled && onSelectAttack(strat.id)}
              className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-b from-cyber-danger/15 to-surface-2/90 border-cyber-danger/70 shadow-danger-glow/30 ring-1 ring-cyber-danger/40'
                  : 'bg-surface-2/60 hover:bg-surface-2/90 border-border text-text-muted hover:text-text'
              } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {/* Card Top */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-text-muted">
                      0{index + 1}
                    </span>
                    <div
                      className={`p-1.5 rounded-lg ${
                        isSelected
                          ? 'bg-cyber-danger/20 text-cyber-danger'
                          : 'bg-surface-3 text-text-muted'
                      }`}
                    >
                      {getIcon(strat.icon)}
                    </div>
                  </div>

                  <Badge variant={getRiskVariant(strat.riskLevel)} size="sm">
                    {strat.riskLevel}
                  </Badge>
                </div>

                <h4 className="text-xs font-bold text-text uppercase tracking-wide font-mono mb-1">
                  {strat.name}
                </h4>

                <span className="text-[10px] font-mono text-cyber-cyan block mb-2 font-semibold">
                  {strat.tag}
                </span>

                <p className="text-[11px] text-text-muted leading-relaxed mb-3">
                  {strat.description}
                </p>
              </div>

              {/* Card Bottom Meta */}
              <div className="pt-2 border-t border-border/60 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-text-muted">Simulated Strength:</span>
                  <span
                    className={`font-bold ${
                      strat.simulatedStrength === 'HIGH'
                        ? 'text-cyber-danger'
                        : strat.simulatedStrength === 'MEDIUM'
                        ? 'text-cyber-warning'
                        : 'text-cyber-cyan'
                    }`}
                  >
                    {strat.simulatedStrength}
                  </span>
                </div>

                <p className="text-[10px] text-text-muted italic leading-snug line-clamp-2">
                  <span className="font-semibold text-text">Effect: </span>
                  {strat.expectedEffect}
                </p>

                <div className="pt-1">
                  <button
                    type="button"
                    disabled={disabled}
                    className={`w-full py-1.5 px-2.5 rounded-lg text-[11px] font-mono font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-cyber-danger text-white shadow-danger-glow'
                        : 'bg-surface-3 hover:bg-surface-2 text-text-muted hover:text-text border border-border'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Selected Strategy
                      </>
                    ) : (
                      'Apply Simulation'
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};

'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { DefenseEffectivenessStat } from '@/types';
import { ShieldCheck, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';

interface DefenseEffectivenessPanelProps {
  defenses: DefenseEffectivenessStat[];
}

export const DefenseEffectivenessPanel: React.FC<DefenseEffectivenessPanelProps> = ({ defenses }) => {
  const getRatingVariant = (rating: string) => {
    switch (rating) {
      case 'EXCELLENT':
        return 'success';
      case 'HIGH':
        return 'cyan';
      default:
        return 'warning';
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
              Defense Countermeasure Effectiveness
            </h3>
            <p className="text-[11px] text-text-muted">
              Simulated confidence restoration and feature integrity per hardening mechanism.
            </p>
          </div>
        </div>

        <Badge variant="success" size="sm">
          SIMULATED DEFENSE EVALUATION
        </Badge>
      </div>

      {/* Grid of 6 Defenses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {defenses.map((def) => (
          <div
            key={def.id}
            className="p-4 rounded-xl bg-surface-2/70 border border-border space-y-3 hover:border-cyber-success/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="text-xs font-bold text-text font-mono leading-snug">
                  {def.name}
                </span>
                <Badge variant={getRatingVariant(def.effectivenessRating)} size="sm">
                  {def.effectivenessRating}
                </Badge>
              </div>

              <span className="text-[10px] font-mono text-cyber-success block mb-2 font-semibold">
                ● Status: {def.status}
              </span>
            </div>

            <div className="space-y-2 pt-2 border-t border-border/60">
              {/* Recovery Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-text-muted">Confidence Recovery:</span>
                  <span className="text-cyber-success font-bold">+{def.recoveryRate}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-surface-3 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-cyber-success transition-all duration-700"
                    style={{ width: `${def.recoveryRate}%` }}
                  />
                </div>
              </div>

              {/* Signal Preservation Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-text-muted">Signal Preservation:</span>
                  <span className="text-purple-300 font-bold">{def.signalPreservation}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-surface-3 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-purple-400 transition-all duration-700"
                    style={{ width: `${def.signalPreservation}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

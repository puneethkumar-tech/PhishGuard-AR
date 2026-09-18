'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, Award, Info, CheckCircle2 } from 'lucide-react';

interface RobustnessVerdictProps {
  verdict: {
    resilience: 'HIGH' | 'MODERATE' | 'LOW';
    recovery: 'STRONG' | 'MODERATE' | 'LOW';
    signalPreservation: 'HIGH' | 'MODERATE' | 'LOW';
    status: string;
    interpretation: string;
  };
}

export const RobustnessVerdict: React.FC<RobustnessVerdictProps> = ({ verdict }) => {
  const getBadgeVariant = (val: string) => {
    switch (val) {
      case 'HIGH':
      case 'STRONG':
        return 'success';
      case 'MODERATE':
        return 'warning';
      default:
        return 'danger';
    }
  };

  return (
    <GlassCard className="p-5 sm:p-6 space-y-4 border-cyber-success/30 shadow-glass-glow">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyber-success/20 text-cyber-success">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text uppercase tracking-wider font-mono">
              Final Robustness Assessment & Verdict
            </h3>
            <p className="text-[11px] text-text-muted">
              Holistic simulated resilience evaluation for security and ML engineering teams.
            </p>
          </div>
        </div>

        <Badge variant="success" size="sm">
          {verdict.status}
        </Badge>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
        <div className="p-3.5 rounded-xl bg-surface-2/80 border border-border space-y-1">
          <span className="text-[10px] font-mono text-text-muted uppercase block">
            Overall Resilience
          </span>
          <div className="flex justify-center pt-1">
            <Badge variant={getBadgeVariant(verdict.resilience)} size="sm">
              {verdict.resilience}
            </Badge>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-2/80 border border-border space-y-1">
          <span className="text-[10px] font-mono text-text-muted uppercase block">
            Confidence Recovery
          </span>
          <div className="flex justify-center pt-1">
            <Badge variant={getBadgeVariant(verdict.recovery)} size="sm">
              {verdict.recovery}
            </Badge>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-2/80 border border-border space-y-1">
          <span className="text-[10px] font-mono text-text-muted uppercase block">
            Signal Preservation
          </span>
          <div className="flex justify-center pt-1">
            <Badge variant={getBadgeVariant(verdict.signalPreservation)} size="sm">
              {verdict.signalPreservation}
            </Badge>
          </div>
        </div>
      </div>

      {/* Interpretation Box */}
      <div className="p-4 rounded-xl bg-surface-3/90 border border-border space-y-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-primary-bright" />
          <span className="text-xs font-mono font-bold uppercase text-text">
            Analytical Interpretation
          </span>
        </div>
        <p className="text-xs text-text-muted leading-relaxed font-sans">
          {verdict.interpretation}
        </p>
      </div>
    </GlassCard>
  );
};

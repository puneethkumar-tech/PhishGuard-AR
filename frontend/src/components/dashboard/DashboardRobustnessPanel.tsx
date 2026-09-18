'use client';

import React from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { GlowButton } from '@/components/ui/GlowButton';
import { DashboardRobustnessSummary } from '@/types';
import {
  FlaskConical,
  ArrowRight,
  Shield,
  Zap,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

interface DashboardRobustnessPanelProps {
  robustness: DashboardRobustnessSummary;
}

export const DashboardRobustnessPanel: React.FC<DashboardRobustnessPanelProps> = ({ robustness }) => {
  return (
    <GlassCard className="p-5 sm:p-6 space-y-4 border-cyber-violet/30">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyber-violet/20 text-purple-300">
            <FlaskConical className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text uppercase tracking-wider font-mono">
              Adversarial Robustness Overview
            </h3>
            <p className="text-[11px] text-text-muted">
              Model resilience and automated hardening countermeasure efficiency.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="violet" size="sm">
            {robustness.status} RESILIENCE
          </Badge>
        </div>
      </div>

      {/* Mini Original ➔ Perturbed ➔ Hardened 3-Panel Visual */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
        {/* Baseline */}
        <div className="p-3.5 rounded-xl bg-surface-2/70 border border-border space-y-1">
          <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-text-muted uppercase">
            <Shield className="w-3 h-3 text-primary-bright" />
            <span>01. Baseline</span>
          </div>
          <span className="text-2xl font-extrabold font-mono text-primary-bright block">
            {robustness.baselineStability}%
          </span>
          <span className="text-[10px] text-cyber-success font-mono">Unperturbed Stable</span>
        </div>

        {/* Under Attack */}
        <div className="p-3.5 rounded-xl bg-cyber-danger/10 border border-cyber-danger/30 space-y-1">
          <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-cyber-danger uppercase font-bold">
            <Zap className="w-3 h-3 text-cyber-danger" />
            <span>02. Under Attack</span>
          </div>
          <span className="text-2xl font-extrabold font-mono text-red-300 block">
            {robustness.underAttackStability}%
          </span>
          <span className="text-[10px] text-cyber-danger font-mono">
            {(robustness.underAttackStability - robustness.baselineStability).toFixed(1)}% drop
          </span>
        </div>

        {/* Hardened Defense */}
        <div className="p-3.5 rounded-xl bg-cyber-success/15 border border-cyber-success/40 space-y-1 shadow-glass">
          <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-cyber-success uppercase font-bold">
            <RefreshCw className="w-3 h-3 text-cyber-success" />
            <span>03. Hardened Defense</span>
          </div>
          <span className="text-2xl font-extrabold font-mono text-green-300 block">
            {robustness.recoveryRate}%
          </span>
          <span className="text-[10px] text-cyber-success font-mono">
            Recovered Accuracy
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/60 text-xs font-mono">
        <div className="p-2.5 rounded-lg bg-surface-2 border border-border">
          <span className="text-[10px] text-text-muted block">Confidence Retention</span>
          <span className="text-sm font-bold text-text">{robustness.confidenceRetention}%</span>
        </div>

        <div className="p-2.5 rounded-lg bg-surface-2 border border-border">
          <span className="text-[10px] text-text-muted block">Signal Preservation</span>
          <span className="text-sm font-bold text-text">{robustness.signalPreservation}%</span>
        </div>

        <div className="p-2.5 rounded-lg bg-surface-2 border border-border">
          <span className="text-[10px] text-text-muted block">Defense Recovery Rate</span>
          <span className="text-sm font-bold text-cyber-success">{robustness.recoveryRate}%</span>
        </div>

        <div className="p-2.5 rounded-lg bg-surface-2 border border-border">
          <span className="text-[10px] text-text-muted block">Composite AR Score</span>
          <span className="text-sm font-bold text-purple-300">{robustness.compositeRobustnessScore}/100</span>
        </div>
      </div>

      {/* Navigation link to Phase 6 */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border/70">
        <span className="text-[11px] font-mono text-text-muted">
          Active Defense: <span className="text-purple-300 font-semibold">{robustness.activeHardeningTechnique}</span>
        </span>

        <Link href="/robustness">
          <GlowButton
            variant="secondary"
            size="sm"
            rightIcon={<ArrowRight className="w-3.5 h-3.5 ml-1" />}
          >
            Open Full Robustness Lab →
          </GlowButton>
        </Link>
      </div>
    </GlassCard>
  );
};

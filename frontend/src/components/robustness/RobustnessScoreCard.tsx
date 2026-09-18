'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, Activity, Award, BarChart3 } from 'lucide-react';

interface RobustnessScoreCardProps {
  robustnessScore: number;
  stabilityScore: 'LOW' | 'MODERATE' | 'HIGH' | 'ROBUST';
  confidenceRetention: number;
  signalPreservation: number;
  recoveryRate: number;
}

export const RobustnessScoreCard: React.FC<RobustnessScoreCardProps> = ({
  robustnessScore,
  stabilityScore,
  confidenceRetention,
  signalPreservation,
  recoveryRate,
}) => {
  const getBadgeVariant = (score: string) => {
    switch (score) {
      case 'ROBUST':
        return 'success';
      case 'HIGH':
        return 'cyan';
      case 'MODERATE':
        return 'warning';
      default:
        return 'danger';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-cyber-success';
    if (score >= 65) return 'text-cyber-cyan';
    if (score >= 50) return 'text-cyber-warning';
    return 'text-cyber-danger';
  };

  return (
    <GlassCard className="p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyber-cyan/20 text-cyber-cyan">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text uppercase tracking-wider font-mono">
              Robustness Score & Resilience Index
            </h3>
            <p className="text-[11px] text-text-muted">
              Evaluated on retention, preservation, and defense recovery metrics.
            </p>
          </div>
        </div>

        <Badge variant={getBadgeVariant(stabilityScore)} size="sm">
          {stabilityScore} RESILIENCE
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Score Gauge Circle */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-xl bg-surface-2/70 border border-border text-center relative overflow-hidden">
          <div className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-1">
            Simulated Score
          </div>

          <div className="flex items-baseline justify-center gap-1">
            <span className={`text-4xl sm:text-5xl font-extrabold font-mono ${getScoreColor(robustnessScore)}`}>
              {robustnessScore}
            </span>
            <span className="text-base font-mono text-text-muted">/ 100</span>
          </div>

          {/* Low - Moderate - High - Robust Scale */}
          <div className="w-full mt-3 space-y-1">
            <div className="flex justify-between text-[9px] font-mono text-text-muted uppercase">
              <span className={robustnessScore < 50 ? 'text-cyber-danger font-bold' : ''}>Low</span>
              <span className={robustnessScore >= 50 && robustnessScore < 70 ? 'text-cyber-warning font-bold' : ''}>Moderate</span>
              <span className={robustnessScore >= 70 && robustnessScore < 85 ? 'text-cyber-cyan font-bold' : ''}>High</span>
              <span className={robustnessScore >= 85 ? 'text-cyber-success font-bold' : ''}>Robust</span>
            </div>

            <div className="w-full h-2 rounded-full bg-surface-3 relative overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyber-danger via-cyber-warning to-cyber-success transition-all duration-700"
                style={{ width: `${robustnessScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Supporting Metric Bars */}
        <div className="md:col-span-7 space-y-3">
          {/* Metric 1: Confidence Retention */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-text-muted">Confidence Retention</span>
              <span className="text-text font-bold">{confidenceRetention}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-cyber-cyan transition-all duration-700"
                style={{ width: `${confidenceRetention}%` }}
              />
            </div>
          </div>

          {/* Metric 2: Signal Preservation */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-text-muted">Signal Preservation</span>
              <span className="text-text font-bold">{signalPreservation}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-purple-400 transition-all duration-700"
                style={{ width: `${signalPreservation}%` }}
              />
            </div>
          </div>

          {/* Metric 3: Recovery Rate */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-text-muted">Recovery Rate (After Defense)</span>
              <span className="text-cyber-success font-bold">{recoveryRate}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-cyber-success transition-all duration-700"
                style={{ width: `${recoveryRate}%` }}
              />
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-text-muted">
            <span>● Deterministic calculation</span>
            <span>SIMULATED METRICS</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

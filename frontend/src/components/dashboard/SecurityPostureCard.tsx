'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, Award, TrendingUp, Sparkles, Activity } from 'lucide-react';

interface SecurityPostureCardProps {
  score: number;
  rating: string;
  subMetrics: {
    threatDetection: number;
    modelStability: number;
    adversarialResilience: number;
    defenseRecovery: number;
    signalIntegrity: number;
  };
}

export const SecurityPostureCard: React.FC<SecurityPostureCardProps> = ({
  score,
  rating,
  subMetrics,
}) => {
  // Calculate SVG circle progress
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (val: number) => {
    if (val >= 80) return 'text-cyber-success';
    if (val >= 65) return 'text-cyber-cyan';
    if (val >= 50) return 'text-cyber-warning';
    return 'text-cyber-danger';
  };

  const getStrokeColor = (val: number) => {
    if (val >= 80) return '#10b981';
    if (val >= 65) return '#06b6d4';
    if (val >= 50) return '#eab308';
    return '#ef4444';
  };

  return (
    <GlassCard className="p-6 space-y-5 border-t-2 border-t-cyber-cyan shadow-glass relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-cyber-cyan/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyber-cyan/20 text-cyber-cyan">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text uppercase tracking-wider font-mono">
              Simulated Security Posture
            </h3>
            <p className="text-[11px] text-text-muted">
              Composite score derived from simulated detection, robustness, and defense metrics.
            </p>
          </div>
        </div>

        <Badge variant="cyan" size="sm">
          {rating}
        </Badge>
      </div>

      {/* Hero Radial Gauge & Sub-metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Circular Gauge */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-3">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              {/* Background Track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="text-surface-3"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Progress Arc */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={getStrokeColor(score)}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]"
              />
            </svg>

            {/* Inner Score Label */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className={`text-4xl font-extrabold font-mono ${getScoreColor(score)}`}>
                {score}
              </span>
              <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
                out of 100
              </span>
            </div>
          </div>

          <div className="mt-2 text-xs font-mono font-semibold text-text flex items-center gap-1.5 justify-center">
            <ShieldCheck className="w-4 h-4 text-cyber-success" />
            <span>Resilient Security Model</span>
          </div>
        </div>

        {/* Right: 5 Sub-metric Bars */}
        <div className="md:col-span-8 space-y-3.5">
          {/* Submetric 1 */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-text-muted">Threat Detection Accuracy</span>
              <span className="text-text font-bold">{subMetrics.threatDetection}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary-bright transition-all duration-700"
                style={{ width: `${subMetrics.threatDetection}%` }}
              />
            </div>
          </div>

          {/* Submetric 2 */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-text-muted">Model Baseline Stability</span>
              <span className="text-text font-bold">{subMetrics.modelStability}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-cyber-cyan transition-all duration-700"
                style={{ width: `${subMetrics.modelStability}%` }}
              />
            </div>
          </div>

          {/* Submetric 3 */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-text-muted">Adversarial Evasion Resilience</span>
              <span className="text-purple-300 font-bold">{subMetrics.adversarialResilience}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-cyber-violet transition-all duration-700"
                style={{ width: `${subMetrics.adversarialResilience}%` }}
              />
            </div>
          </div>

          {/* Submetric 4 */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-text-muted">Defense Hardening Recovery</span>
              <span className="text-cyber-success font-bold">{subMetrics.defenseRecovery}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-cyber-success transition-all duration-700"
                style={{ width: `${subMetrics.defenseRecovery}%` }}
              />
            </div>
          </div>

          {/* Submetric 5 */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-text-muted">Signal Preservation Margin</span>
              <span className="text-text font-bold">{subMetrics.signalIntegrity}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-sky-400 transition-all duration-700"
                style={{ width: `${subMetrics.signalIntegrity}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

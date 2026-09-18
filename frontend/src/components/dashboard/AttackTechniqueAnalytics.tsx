'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { AttackTechniqueStat } from '@/types';
import { Zap, ShieldAlert, ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface AttackTechniqueAnalyticsProps {
  attacks: AttackTechniqueStat[];
}

export const AttackTechniqueAnalytics: React.FC<AttackTechniqueAnalyticsProps> = ({ attacks }) => {
  const getRiskVariant = (risk: string) => {
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyber-danger/20 text-cyber-danger">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text uppercase tracking-wider font-mono">
              Adversarial Attack Technique Analytics
            </h3>
            <p className="text-[11px] text-text-muted">
              Simulated frequency, classifier degradation, and defense recovery across attack types.
            </p>
          </div>
        </div>

        <Badge variant="danger" size="sm">
          7 ATTACK VECTORS
        </Badge>
      </div>

      {/* Table / Cards Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-border/70 text-text-muted text-[10px] uppercase">
              <th className="py-2.5 px-3">Attack Strategy</th>
              <th className="py-2.5 px-3">Risk Tier</th>
              <th className="py-2.5 px-3">Simulated Attempts</th>
              <th className="py-2.5 px-3">Avg Confidence Drop</th>
              <th className="py-2.5 px-3 text-right">Recovery Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {attacks.map((atk) => (
              <tr key={atk.id} className="hover:bg-surface-2/60 transition-colors">
                <td className="py-3 px-3 font-bold text-text flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-danger" />
                  {atk.name}
                </td>
                <td className="py-3 px-3">
                  <Badge variant={getRiskVariant(atk.riskLevel)} size="sm">
                    {atk.riskLevel}
                  </Badge>
                </td>
                <td className="py-3 px-3 text-text font-bold">
                  {atk.attempts.toLocaleString()}
                </td>
                <td className="py-3 px-3 text-cyber-danger font-bold flex items-center gap-1">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  {atk.confidenceDrop}%
                </td>
                <td className="py-3 px-3 text-right text-cyber-success font-bold">
                  <span className="inline-flex items-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    +{atk.recoveryRate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};

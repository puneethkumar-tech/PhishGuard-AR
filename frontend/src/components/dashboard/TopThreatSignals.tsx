'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { TopThreatSignalItem } from '@/types';
import { Layers, ArrowUp, ArrowDown, Minus, Sparkles } from 'lucide-react';

interface TopThreatSignalsProps {
  signals: TopThreatSignalItem[];
}

export const TopThreatSignals: React.FC<TopThreatSignalsProps> = ({ signals }) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="w-3 h-3 text-cyber-danger" />;
      case 'down':
        return <ArrowDown className="w-3 h-3 text-cyber-success" />;
      default:
        return <Minus className="w-3 h-3 text-text-muted" />;
    }
  };

  return (
    <GlassCard className="p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyber-cyan/20 text-cyber-cyan">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text uppercase tracking-wider font-mono">
              Top Influential Threat Signals
            </h3>
            <p className="text-[11px] text-text-muted">
              Model attention weights and empirical frequency across analyzed vectors.
            </p>
          </div>
        </div>

        <Badge variant="cyan" size="sm">
          FEATURE RANKING
        </Badge>
      </div>

      {/* Signals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {signals.map((sig) => (
          <div
            key={sig.id}
            className="p-3.5 rounded-xl bg-surface-2/70 border border-border space-y-2 hover:border-cyber-cyan/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-1 mb-1">
                <span className="text-xs font-bold text-text font-mono leading-tight">
                  {sig.signal}
                </span>
                <div className="p-1 rounded bg-surface-3">{getTrendIcon(sig.trend)}</div>
              </div>

              <span className="text-[10px] font-mono text-purple-300 block">
                {sig.category}
              </span>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-border/50">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-text-muted">Impact Score:</span>
                <span className="text-cyber-cyan font-bold">{sig.impactScore}/100</span>
              </div>

              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-text-muted">Sample Frequency:</span>
                <span className="text-text font-bold">{sig.frequencyPercentage}%</span>
              </div>

              <div className="w-full h-1.5 rounded-full bg-surface-3 overflow-hidden mt-1">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyber-cyan to-primary-bright"
                  style={{ width: `${sig.impactScore}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

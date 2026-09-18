'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { AffectedSignalResponse } from '@/types';
import { Layers, Sparkles, Activity } from 'lucide-react';

interface FeatureImpactPanelProps {
  signals: AffectedSignalResponse[];
}

export const FeatureImpactPanel: React.FC<FeatureImpactPanelProps> = ({ signals }) => {
  const getLevelBadge = (level: 'LOW' | 'MEDIUM' | 'HIGH', isAdversarial = false) => {
    switch (level) {
      case 'HIGH':
        return (
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
              isAdversarial
                ? 'bg-cyber-danger/20 text-red-300 border border-cyber-danger/40'
                : 'bg-primary/20 text-primary-bright border border-primary/40'
            }`}
          >
            HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyber-warning/20 text-cyber-warning border border-cyber-warning/40">
            MEDIUM
          </span>
        );
      case 'LOW':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-surface-3 text-text-muted border border-border">
            LOW
          </span>
        );
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
              Affected Model Signals & Weights
            </h3>
            <p className="text-[11px] text-text-muted">
              Simulated response variance across 8 core transformer and lexical feature extractors.
            </p>
          </div>
        </div>

        <Badge variant="cyan" size="sm">
          SIMULATED SIGNAL RESPONSE
        </Badge>
      </div>

      {/* Grid of 8 Model Signals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {signals.map((sig) => (
          <div
            key={sig.name}
            className="p-3.5 rounded-xl bg-surface-2/70 border border-border space-y-2.5 hover:border-border/80 transition-all"
          >
            {/* Title & Category */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold text-text font-mono leading-tight">
                  {sig.name}
                </h4>
                <span className="text-[10px] font-mono text-cyber-cyan">
                  {sig.category}
                </span>
              </div>
              <span className="text-[10px] font-mono text-text-muted italic shrink-0">
                {sig.delta}
              </span>
            </div>

            {/* 3-State Mini Meters */}
            <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-border/50">
              {/* Baseline */}
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-text-muted uppercase block">
                  Baseline
                </span>
                <div className="flex justify-center">{getLevelBadge(sig.baseline)}</div>
                <div className="w-full h-1 rounded-full bg-surface-3 overflow-hidden mt-1">
                  <div
                    className="h-full bg-primary-bright"
                    style={{ width: `${sig.baselineVal}%` }}
                  />
                </div>
              </div>

              {/* Adversarial */}
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-cyber-danger uppercase block">
                  Adversarial
                </span>
                <div className="flex justify-center">{getLevelBadge(sig.adversarial, true)}</div>
                <div className="w-full h-1 rounded-full bg-surface-3 overflow-hidden mt-1">
                  <div
                    className="h-full bg-cyber-danger"
                    style={{ width: `${sig.adversarialVal}%` }}
                  />
                </div>
              </div>

              {/* Hardened */}
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-cyber-success uppercase block">
                  Hardened
                </span>
                <div className="flex justify-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyber-success/20 text-green-300 border border-cyber-success/40">
                    {sig.hardened}
                  </span>
                </div>
                <div className="w-full h-1 rounded-full bg-surface-3 overflow-hidden mt-1">
                  <div
                    className="h-full bg-cyber-success"
                    style={{ width: `${sig.hardenedVal}%` }}
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

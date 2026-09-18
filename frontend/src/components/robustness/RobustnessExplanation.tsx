'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Sparkles, HelpCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface RobustnessExplanationProps {
  explanation: string[];
}

export const RobustnessExplanation: React.FC<RobustnessExplanationProps> = ({ explanation }) => {
  return (
    <GlassCard className="p-5 sm:p-6 space-y-4 border-cyber-cyan/30">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyber-cyan/20 text-cyber-cyan">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text uppercase tracking-wider font-mono">
              Why Did Robustness Change?
            </h3>
            <p className="text-[11px] text-text-muted">
              XAI breakdown explaining classifier sensitivity and defense normalization mechanics.
            </p>
          </div>
        </div>

        <Badge variant="cyan" size="sm">
          SIMULATED MODEL ANALYSIS
        </Badge>
      </div>

      {/* Explanation Steps */}
      <div className="space-y-2.5">
        {explanation.map((point, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-surface-2/80 border border-border flex items-start gap-3"
          >
            <div className="p-1 rounded-md bg-cyber-cyan/15 text-cyber-cyan mt-0.5 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs text-text leading-relaxed font-sans">
              {point}
            </p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

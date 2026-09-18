'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { ModelComparisonMetricItem } from '@/types';
import { Scale, Sparkles, Cpu, Info } from 'lucide-react';

interface DashboardModelComparisonProps {
  metrics: ModelComparisonMetricItem[];
}

export const DashboardModelComparison: React.FC<DashboardModelComparisonProps> = ({ metrics }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <GlassCard className="p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyber-violet/20 text-purple-300">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text uppercase tracking-wider font-mono">
              Simulated Model Comparison
            </h3>
            <p className="text-[11px] text-text-muted">
              Analytical evaluation: TF-IDF + Linear SVM vs Multilingual DistilBERT.
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-primary-bright" />
            <span className="text-text-muted">Linear SVM</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-cyber-violet" />
            <span className="text-purple-300 font-semibold">DistilBERT AR</span>
          </div>
        </div>
      </div>

      {/* Comparison Rows */}
      <div className="space-y-4">
        {metrics.map((item, idx) => {
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={item.attribute}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="space-y-1.5 cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-text group-hover:text-cyber-cyan transition-colors">
                  {item.attribute}
                </span>

                <div className="flex items-center gap-3 text-[11px]">
                  <span className="text-primary-bright font-bold">
                    SVM: {item.svmScore}
                  </span>
                  <span className="text-border">•</span>
                  <span className="text-purple-300 font-bold">
                    BERT: {item.distilbertScore}
                  </span>
                </div>
              </div>

              {/* Dual Bar Track */}
              <div className="space-y-1">
                {/* SVM Bar */}
                <div className="w-full h-1.5 rounded-full bg-surface-3 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary-bright transition-all duration-700"
                    style={{ width: `${item.svmScore}%` }}
                  />
                </div>

                {/* DistilBERT Bar */}
                <div className="w-full h-1.5 rounded-full bg-surface-3 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-cyber-violet transition-all duration-700"
                    style={{ width: `${item.distilbertScore}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hover description */}
      {hoveredIdx !== null && (
        <div className="p-3 rounded-xl bg-surface-2/90 border border-purple-400/30 text-xs text-text-muted flex items-center gap-2">
          <Info className="w-4 h-4 text-purple-300 shrink-0" />
          <span>{metrics[hoveredIdx].description}</span>
        </div>
      )}
    </GlassCard>
  );
};

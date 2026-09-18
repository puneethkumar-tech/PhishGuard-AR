'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { ThreatTypeItem } from '@/types';
import { Layers, ShieldAlert, Sparkles, Tag } from 'lucide-react';

interface ThreatTypeBreakdownProps {
  types: ThreatTypeItem[];
}

export const ThreatTypeBreakdown: React.FC<ThreatTypeBreakdownProps> = ({ types }) => {
  const [hoveredType, setHoveredType] = useState<ThreatTypeItem | null>(null);

  const getSeverityBadgeVariant = (sev: string) => {
    switch (sev) {
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
          <div className="p-1.5 rounded-lg bg-cyber-violet/20 text-purple-300">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text uppercase tracking-wider font-mono">
              Threat Category & Vector Analytics
            </h3>
            <p className="text-[11px] text-text-muted">
              Volume distribution and affected feature extractors across attack taxonomies.
            </p>
          </div>
        </div>

        <Badge variant="violet" size="sm">
          CATEGORY BREAKDOWN
        </Badge>
      </div>

      {/* Horizontal Bars */}
      <div className="space-y-3.5">
        {types.map((item) => {
          const isHovered = hoveredType?.id === item.id;

          return (
            <div
              key={item.id}
              onMouseEnter={() => setHoveredType(item)}
              onMouseLeave={() => setHoveredType(null)}
              className="space-y-1.5 cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-text group-hover:text-cyber-cyan transition-colors">
                    {item.name}
                  </span>
                  <Badge variant={getSeverityBadgeVariant(item.severity)} size="sm">
                    {item.severity}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-text-muted">{item.count.toLocaleString()} events</span>
                  <span className="font-bold text-text">{item.percentage}%</span>
                </div>
              </div>

              {/* Bar track */}
              <div className="w-full h-2 rounded-full bg-surface-3 overflow-hidden border border-border/60">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${item.percentage * 2.5}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Hover Information Box */}
      {hoveredType && (
        <div className="p-3 rounded-xl bg-surface-2/90 border border-purple-400/30 text-xs space-y-1">
          <div className="flex items-center justify-between font-mono">
            <span className="font-bold text-text">Affected Model Signals:</span>
            <span className="text-purple-300 font-semibold">{hoveredType.name}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {hoveredType.affectedSignals.map((sig, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-surface-3 text-[10px] font-mono text-cyan-200 border border-border"
              >
                {sig}
              </span>
            ))}
          </div>
        </div>
      )}
    </GlassCard>
  );
};

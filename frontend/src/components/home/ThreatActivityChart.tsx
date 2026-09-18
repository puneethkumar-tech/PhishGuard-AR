'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { BarChart3, ArrowUpRight } from 'lucide-react';
import { DEMO_ACTIVITY_DATA } from '@/lib/demo-data';

export const ThreatActivityChart: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxScanned = Math.max(...DEMO_ACTIVITY_DATA.map((d) => d.scanned));

  return (
    <GlassCard className="p-5 sm:p-6 flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyber-cyan" />
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-text">
              Threat Activity Trend
            </span>
          </div>
          <Badge variant="demo" size="sm">
            24H DEMO
          </Badge>
        </div>
        <p className="text-xs text-text-muted">
          Scanned message volume versus detected phishing attempts.
        </p>
      </div>

      {/* SVG / Bar Hybrid Cyber Chart */}
      <div className="my-4 pt-4">
        <div className="h-36 flex items-end justify-between gap-2 px-1">
          {DEMO_ACTIVITY_DATA.map((item, index) => {
            const heightPercent = Math.round((item.scanned / maxScanned) * 100);
            const threatHeightPercent = Math.round((item.threats / 60) * 100);
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={item.time}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end cursor-pointer group relative"
              >
                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute -top-12 z-30 px-2.5 py-1 rounded-lg bg-surface border border-cyber-cyan/40 text-[10px] font-mono text-text shadow-glass whitespace-nowrap">
                    <p className="text-cyber-cyan font-bold">{item.time}</p>
                    <p className="text-text-muted">
                      Scanned: {item.scanned} | Threats: {item.threats}
                    </p>
                  </div>
                )}

                {/* Bars */}
                <div className="w-full max-w-[28px] h-full flex items-end gap-1 justify-center">
                  {/* Scanned volume bar */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-2.5 rounded-t-md transition-all duration-300 ${
                      isHovered
                        ? 'bg-primary-bright shadow-glass-glow'
                        : 'bg-primary/40 group-hover:bg-primary/70'
                    }`}
                  />
                  {/* Threat detected bar */}
                  <div
                    style={{ height: `${threatHeightPercent}%` }}
                    className={`w-2.5 rounded-t-md transition-all duration-300 ${
                      isHovered
                        ? 'bg-cyber-danger shadow-danger-glow'
                        : 'bg-cyber-danger/60 group-hover:bg-cyber-danger'
                    }`}
                  />
                </div>

                {/* X-Axis Label */}
                <span className="text-[10px] font-mono text-text-muted group-hover:text-text">
                  {item.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend & Stats Footer */}
      <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-primary" />
            <span className="text-[11px] text-text-muted">Scanned</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyber-danger" />
            <span className="text-[11px] text-text-muted">Threats</span>
          </div>
        </div>

        <span className="text-[11px] text-cyber-cyan font-mono flex items-center gap-1">
          Peak: 12:00 UTC <ArrowUpRight className="w-3 h-3" />
        </span>
      </div>
    </GlassCard>
  );
};

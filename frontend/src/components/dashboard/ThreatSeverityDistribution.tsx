'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { ThreatSeverityItem } from '@/types';
import { PieChart, Shield, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface ThreatSeverityDistributionProps {
  items: ThreatSeverityItem[];
  totalAnalyzed: number;
}

export const ThreatSeverityDistribution: React.FC<ThreatSeverityDistributionProps> = ({
  items,
  totalAnalyzed,
}) => {
  const [hoveredSeverity, setHoveredSeverity] = useState<string | null>(null);

  // SVG Donut Calculations
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  const activeItem = items.find((i) => i.severity === hoveredSeverity) || items[0];

  return (
    <GlassCard className="p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyber-danger/20 text-cyber-danger">
            <PieChart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text uppercase tracking-wider font-mono">
              Threat Severity Distribution
            </h3>
            <p className="text-[11px] text-text-muted">
              Classification breakdown across enterprise risk tiers.
            </p>
          </div>
        </div>

        <Badge variant="demo" size="sm">
          DEMO TELEMETRY
        </Badge>
      </div>

      {/* Donut Chart and Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
        {/* Left: Donut SVG with Center Metric */}
        <div className="sm:col-span-6 flex flex-col items-center justify-center relative">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
              {items.map((item) => {
                const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -((cumulativePercent / 100) * circumference);
                cumulativePercent += item.percentage;
                const isHovered = hoveredSeverity === item.severity;

                return (
                  <circle
                    key={item.severity}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={item.color}
                    strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="cursor-pointer transition-all duration-300"
                    onMouseEnter={() => setHoveredSeverity(item.severity)}
                    onMouseLeave={() => setHoveredSeverity(null)}
                  />
                );
              })}
            </svg>

            {/* Donut Center */}
            <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-xl font-extrabold font-mono text-text">
                {totalAnalyzed.toLocaleString()}
              </span>
              <span className="text-[9px] font-mono text-text-muted uppercase tracking-wider">
                Simulated Analyzed
              </span>
            </div>
          </div>
        </div>

        {/* Right: Legend Breakdown */}
        <div className="sm:col-span-6 space-y-2">
          {items.map((item) => {
            const isHovered = hoveredSeverity === item.severity;

            return (
              <div
                key={item.severity}
                onMouseEnter={() => setHoveredSeverity(item.severity)}
                onMouseLeave={() => setHoveredSeverity(null)}
                className={`p-2 rounded-xl border text-xs font-mono flex items-center justify-between cursor-pointer transition-all ${
                  isHovered
                    ? 'bg-surface-3 border-cyber-cyan/50 shadow-glass'
                    : 'bg-surface-2/60 border-border hover:bg-surface-2'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-bold text-text">{item.severity}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-text-muted">{item.count.toLocaleString()}</span>
                  <span className="font-bold text-text">{item.percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hover Information Box */}
      {activeItem && (
        <div className="p-3 rounded-xl bg-surface-2/80 border border-border text-xs flex items-center justify-between">
          <span className="text-text-muted font-mono">
            Tier Details: <span className="text-text font-bold">{activeItem.severity}</span>
          </span>
          <span className="text-[11px] text-cyber-cyan font-mono">
            {activeItem.description}
          </span>
        </div>
      )}
    </GlassCard>
  );
};

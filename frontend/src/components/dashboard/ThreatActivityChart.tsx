'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { ThreatActivityTimeseriesPoint } from '@/types';
import { Activity, ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ThreatActivityChartProps {
  data: ThreatActivityTimeseriesPoint[];
  timeRange: string;
}

export const ThreatActivityChart: React.FC<ThreatActivityChartProps> = ({ data, timeRange }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // SVG Chart dimensions
  const width = 600;
  const height = 240;
  const padding = { top: 20, right: 25, bottom: 35, left: 45 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // Max value for scaling
  const maxVal = Math.max(...data.map((d) => d.total), 100);

  const getX = (index: number) =>
    padding.left + (index / (data.length - 1 || 1)) * graphWidth;
  const getY = (val: number) =>
    padding.top + graphHeight - (val / maxVal) * graphHeight;

  // Paths
  const detectedPath = data.reduce((acc, pt, i) => {
    return `${acc} ${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(pt.detected)}`;
  }, '');

  const suspiciousPath = data.reduce((acc, pt, i) => {
    return `${acc} ${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(pt.suspicious)}`;
  }, '');

  const blockedPath = data.reduce((acc, pt, i) => {
    return `${acc} ${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(pt.blocked)}`;
  }, '');

  const activePoint = hoveredIdx !== null ? data[hoveredIdx] : data[data.length - 1];

  return (
    <GlassCard className="p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyber-cyan/20 text-cyber-cyan">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text uppercase tracking-wider font-mono">
              Threat Activity Analytics
            </h3>
            <p className="text-[11px] text-text-muted">
              Simulated detection, suspicious flags, and auto-quarantined payloads over {timeRange}.
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px] font-mono flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-cyber-cyan" />
            <span className="text-text-muted">Detected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-cyber-warning" />
            <span className="text-text-muted">Suspicious</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-cyber-danger" />
            <span className="text-text-muted">Blocked</span>
          </div>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[500px] relative">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
            {/* Grid lines (Horizontal) */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = padding.top + graphHeight * (1 - ratio);
              const label = Math.round(maxVal * ratio);
              return (
                <g key={ratio}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={width - padding.right}
                    y2={y}
                    stroke="currentColor"
                    className="text-border/50"
                    strokeDasharray="4,4"
                  />
                  <text
                    x={padding.left - 8}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[9px] fill-text-muted font-mono"
                  >
                    {label > 1000 ? `${(label / 1000).toFixed(1)}k` : label}
                  </text>
                </g>
              );
            })}

            {/* X-Axis labels */}
            {data.map((pt, i) => {
              const x = getX(i);
              return (
                <g key={pt.timeLabel}>
                  <text
                    x={x}
                    y={height - padding.bottom + 18}
                    textAnchor="middle"
                    className="text-[10px] fill-text-muted font-mono"
                  >
                    {pt.timeLabel}
                  </text>
                </g>
              );
            })}

            {/* Detected Line (Cyan) */}
            <path
              d={detectedPath}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2.5"
              className="drop-shadow-[0_0_6px_rgba(6,182,212,0.4)]"
            />

            {/* Suspicious Line (Warning Yellow) */}
            <path
              d={suspiciousPath}
              fill="none"
              stroke="#eab308"
              strokeWidth="2"
              className="drop-shadow-[0_0_6px_rgba(234,179,8,0.3)]"
            />

            {/* Blocked Line (Danger Red) */}
            <path
              d={blockedPath}
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
              className="drop-shadow-[0_0_6px_rgba(239,68,68,0.4)]"
            />

            {/* Hover Circles */}
            {data.map((pt, i) => {
              const x = getX(i);
              const yDet = getY(pt.detected);
              const isHovered = hoveredIdx === i;

              return (
                <g
                  key={pt.timeLabel}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  <circle
                    cx={x}
                    cy={yDet}
                    r={isHovered ? 6 : 4}
                    fill="#06b6d4"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="transition-all"
                  />
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Hover Information Strip */}
      {activePoint && (
        <div className="p-3 rounded-xl bg-surface-2/80 border border-border flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <span className="text-text-muted">
            Timestamp: <span className="text-text font-bold">{activePoint.timeLabel}</span>
          </span>
          <div className="flex items-center gap-4">
            <span className="text-cyber-cyan font-semibold">
              Detected: {activePoint.detected.toLocaleString()}
            </span>
            <span className="text-cyber-warning font-semibold">
              Suspicious: {activePoint.suspicious.toLocaleString()}
            </span>
            <span className="text-cyber-danger font-semibold">
              Blocked: {activePoint.blocked.toLocaleString()}
            </span>
            <span className="text-text font-bold">
              Total: {activePoint.total.toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </GlassCard>
  );
};

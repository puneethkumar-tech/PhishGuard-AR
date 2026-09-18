'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { StabilityChartPoint } from '@/types';
import { LineChart, Sparkles, TrendingDown, RefreshCw } from 'lucide-react';

interface ConfidenceStabilityChartProps {
  data: StabilityChartPoint[];
}

export const ConfidenceStabilityChart: React.FC<ConfidenceStabilityChartProps> = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // SVG dimensions
  const width = 600;
  const height = 240;
  const padding = { top: 20, right: 30, bottom: 40, left: 45 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // Scale calculations
  const getX = (intensity: number) => padding.left + (intensity / 100) * graphWidth;
  const getY = (val: number) => padding.top + graphHeight - (val / 100) * graphHeight;

  // Generate SVG path strings
  const baselinePath = data.reduce((acc, pt, i) => {
    const x = getX(pt.intensity);
    const y = getY(pt.baselineConfidence);
    return `${acc} ${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }, '');

  const attackPath = data.reduce((acc, pt, i) => {
    const x = getX(pt.intensity);
    const y = getY(pt.adversarialConfidence);
    return `${acc} ${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }, '');

  const hardenedPath = data.reduce((acc, pt, i) => {
    const x = getX(pt.intensity);
    const y = getY(pt.hardenedConfidence);
    return `${acc} ${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }, '');

  const activePoint = hoveredIdx !== null ? data[hoveredIdx] : data[data.length - 1];

  return (
    <GlassCard className="p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyber-cyan/20 text-cyber-cyan">
            <LineChart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text uppercase tracking-wider font-mono">
              Model Confidence Under Perturbation
            </h3>
            <p className="text-[11px] text-text-muted">
              Continuous stability curve across 0% to 100% adversarial intensity calibration.
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px] font-mono flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-primary-bright rounded-full" />
            <span className="text-text-muted">Baseline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-cyber-danger rounded-full" />
            <span className="text-cyber-danger font-semibold">Under Attack</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-cyber-success rounded-full" />
            <span className="text-cyber-success font-semibold">Hardened</span>
          </div>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[500px] relative">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
            {/* Grid lines (Horizontal) */}
            {[0, 25, 50, 75, 100].map((val) => {
              const y = getY(val);
              return (
                <g key={val}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={width - padding.right}
                    y2={y}
                    stroke="currentColor"
                    className="text-border/60"
                    strokeDasharray="4,4"
                  />
                  <text
                    x={padding.left - 8}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[9px] fill-text-muted font-mono"
                  >
                    {val}%
                  </text>
                </g>
              );
            })}

            {/* X Axis Labels */}
            {data.map((pt) => {
              const x = getX(pt.intensity);
              return (
                <g key={pt.intensity}>
                  <line
                    x1={x}
                    y1={padding.top}
                    x2={x}
                    y2={padding.top + graphHeight}
                    stroke="currentColor"
                    className="text-border/40"
                    strokeDasharray="2,2"
                  />
                  <text
                    x={x}
                    y={height - padding.bottom + 18}
                    textAnchor="middle"
                    className="text-[10px] fill-text-muted font-mono"
                  >
                    {pt.intensity}%
                  </text>
                </g>
              );
            })}

            {/* Baseline Curve (Cyan/Blue dashed) */}
            <path
              d={baselinePath}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
              strokeDasharray="5,5"
              className="opacity-70"
            />

            {/* Under Attack Curve (Crimson Red solid) */}
            <path
              d={attackPath}
              fill="none"
              stroke="#ef4444"
              strokeWidth="3"
              className="drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
            />

            {/* Hardened Curve (Emerald Green solid) */}
            <path
              d={hardenedPath}
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              className="drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
            />

            {/* Data Points & Interactive Hover Circles */}
            {data.map((pt, i) => {
              const x = getX(pt.intensity);
              const yAtt = getY(pt.adversarialConfidence);
              const yHard = getY(pt.hardenedConfidence);
              const isHovered = hoveredIdx === i;

              return (
                <g
                  key={pt.intensity}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* Under Attack Node */}
                  <circle
                    cx={x}
                    cy={yAtt}
                    r={isHovered ? 6 : 4}
                    fill="#ef4444"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="transition-all"
                  />
                  {/* Hardened Node */}
                  <circle
                    cx={x}
                    cy={yHard}
                    r={isHovered ? 6 : 4}
                    fill="#10b981"
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

      {/* Dynamic Hover Details Bar */}
      {activePoint && (
        <div className="p-3 rounded-xl bg-surface-2/80 border border-border flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <span className="text-text-muted">
            Intensity Level: <span className="text-text font-bold">{activePoint.intensity}%</span>
          </span>
          <div className="flex items-center gap-4">
            <span className="text-text-muted">
              Baseline: <span className="text-primary-bright font-bold">{activePoint.baselineConfidence}%</span>
            </span>
            <span className="text-cyber-danger">
              Under Attack: <span className="font-bold">{activePoint.adversarialConfidence}%</span>
            </span>
            <span className="text-cyber-success">
              Hardened: <span className="font-bold">{activePoint.hardenedConfidence}%</span>
            </span>
          </div>
        </div>
      )}
    </GlassCard>
  );
};

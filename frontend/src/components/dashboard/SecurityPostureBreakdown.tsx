'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { SecurityPostureBreakdownItem } from '@/types';
import { ShieldCheck, Target, Sparkles } from 'lucide-react';

interface SecurityPostureBreakdownProps {
  axes: SecurityPostureBreakdownItem[];
}

export const SecurityPostureBreakdown: React.FC<SecurityPostureBreakdownProps> = ({ axes }) => {
  // SVG Radar Dimensions
  const size = 260;
  const center = size / 2;
  const radius = 95;
  const totalAxes = axes.length;

  const getCoordinates = (index: number, val: number) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const r = (val / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Build Radar Polygon Points
  const scorePoints = axes
    .map((axis, i) => {
      const { x, y } = getCoordinates(i, axis.score);
      return `${x},${y}`;
    })
    .join(' ');

  const benchmarkPoints = axes
    .map((axis, i) => {
      const { x, y } = getCoordinates(i, axis.benchmark);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <GlassCard className="p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyber-violet/20 text-purple-300">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text uppercase tracking-wider font-mono">
              Security Posture Multi-Axis Radar
            </h3>
            <p className="text-[11px] text-text-muted">
              Evaluated across 6 holistic defense dimensions vs industry baseline.
            </p>
          </div>
        </div>

        <Badge variant="violet" size="sm">
          SIMULATED POSTURE MODEL
        </Badge>
      </div>

      {/* Radar Graphic and Axis Meters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Left: SVG Radar */}
        <div className="md:col-span-6 flex flex-col items-center justify-center relative">
          <svg viewBox={`0 0 ${size} ${size}`} className="w-64 h-64 overflow-visible">
            {/* Concentric Circles / Webs */}
            {[0.25, 0.5, 0.75, 1].map((level) => (
              <circle
                key={level}
                cx={center}
                cy={center}
                r={radius * level}
                fill="none"
                stroke="currentColor"
                className="text-border/40"
                strokeDasharray="3,3"
              />
            ))}

            {/* Radial Axis Spokes */}
            {axes.map((_, i) => {
              const { x, y } = getCoordinates(i, 100);
              return (
                <line
                  key={i}
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke="currentColor"
                  className="text-border/40"
                />
              );
            })}

            {/* Benchmark Polygon (Dashed outline) */}
            <polygon
              points={benchmarkPoints}
              fill="rgba(56, 189, 248, 0.1)"
              stroke="#38bdf8"
              strokeWidth="1.5"
              strokeDasharray="4,4"
            />

            {/* Score Polygon (Glowing Cyan/Violet fill) */}
            <polygon
              points={scorePoints}
              fill="rgba(139, 92, 246, 0.25)"
              stroke="#06b6d4"
              strokeWidth="2.5"
              className="drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]"
            />

            {/* Vertex Nodes */}
            {axes.map((axis, i) => {
              const { x, y } = getCoordinates(i, axis.score);
              return (
                <circle
                  key={axis.axis}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#06b6d4"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              );
            })}
          </svg>

          <div className="flex items-center gap-4 text-[10px] font-mono mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-cyber-cyan" />
              <span className="text-text font-bold">Current Model</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-0.5 bg-sky-400" />
              <span className="text-text-muted">Target Benchmark</span>
            </div>
          </div>
        </div>

        {/* Right: Dimension List */}
        <div className="md:col-span-6 space-y-2.5">
          {axes.map((ax) => (
            <div
              key={ax.axis}
              className="p-2.5 rounded-xl bg-surface-2/70 border border-border space-y-1 text-xs font-mono"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-text">{ax.axis}</span>
                <span className="text-cyber-cyan font-bold">{ax.score}/100</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-surface-3 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-cyber-cyan transition-all duration-700"
                  style={{ width: `${ax.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};

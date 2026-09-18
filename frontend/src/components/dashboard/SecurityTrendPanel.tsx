'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { SecurityTrendPoint } from '@/types';
import { TrendingUp, Sparkles, Activity } from 'lucide-react';

interface SecurityTrendPanelProps {
  trends: SecurityTrendPoint[];
}

type TrendMetricKey = 'threatVolume' | 'detectionConfidence' | 'robustness' | 'defenseRecovery';

export const SecurityTrendPanel: React.FC<SecurityTrendPanelProps> = ({ trends }) => {
  const [selectedMetric, setSelectedMetric] = useState<TrendMetricKey>('detectionConfidence');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const metricConfig: Record<
    TrendMetricKey,
    { label: string; unit: string; color: string; maxVal: number }
  > = {
    detectionConfidence: { label: 'Detection Confidence', unit: '%', color: '#06b6d4', maxVal: 100 },
    robustness: { label: 'Adversarial Robustness', unit: '%', color: '#8b5cf6', maxVal: 100 },
    defenseRecovery: { label: 'Defense Recovery Rate', unit: '%', color: '#10b981', maxVal: 100 },
    threatVolume: { label: 'Threat Event Volume', unit: ' events', color: '#ef4444', maxVal: Math.max(...trends.map((t) => t.threatVolume), 1000) },
  };

  const currentCfg = metricConfig[selectedMetric];

  // SVG dimensions
  const width = 600;
  const height = 220;
  const padding = { top: 20, right: 25, bottom: 35, left: 45 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const getX = (idx: number) =>
    padding.left + (idx / (trends.length - 1 || 1)) * graphWidth;
  const getY = (val: number) =>
    padding.top + graphHeight - (val / currentCfg.maxVal) * graphHeight;

  const pathString = trends.reduce((acc, pt, i) => {
    const val = pt[selectedMetric];
    return `${acc} ${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(val)}`;
  }, '');

  const activePoint = hoveredIdx !== null ? trends[hoveredIdx] : trends[trends.length - 1];

  return (
    <GlassCard className="p-5 sm:p-6 space-y-4">
      {/* Header & Metric Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyber-cyan/20 text-cyber-cyan">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text uppercase tracking-wider font-mono">
              Simulated Security Trend Analysis
            </h3>
            <p className="text-[11px] text-text-muted">
              Select key telemetry dimension to observe temporal trajectory.
            </p>
          </div>
        </div>

        {/* Metric Selector Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-surface-2 border border-border">
          {(
            [
              'detectionConfidence',
              'robustness',
              'defenseRecovery',
              'threatVolume',
            ] as TrendMetricKey[]
          ).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedMetric(key)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                selectedMetric === key
                  ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40 font-bold shadow-glass'
                  : 'text-text-muted hover:text-text hover:bg-surface-3'
              }`}
            >
              {metricConfig[key].label}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[500px] relative">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
            {/* Grid */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = padding.top + graphHeight * (1 - ratio);
              const val = Math.round(currentCfg.maxVal * ratio);
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
                    {val > 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                    {currentCfg.unit !== ' events' ? currentCfg.unit : ''}
                  </text>
                </g>
              );
            })}

            {/* X labels */}
            {trends.map((pt, i) => (
              <text
                key={pt.timeLabel}
                x={getX(i)}
                y={height - padding.bottom + 18}
                textAnchor="middle"
                className="text-[10px] fill-text-muted font-mono"
              >
                {pt.timeLabel}
              </text>
            ))}

            {/* Trend Path */}
            <path
              d={pathString}
              fill="none"
              stroke={currentCfg.color}
              strokeWidth="2.5"
              className="drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]"
            />

            {/* Interactive Nodes */}
            {trends.map((pt, i) => {
              const x = getX(i);
              const y = getY(pt[selectedMetric]);
              const isHovered = hoveredIdx === i;

              return (
                <circle
                  key={pt.timeLabel}
                  cx={x}
                  cy={y}
                  r={isHovered ? 6 : 4}
                  fill={currentCfg.color}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* Information Strip */}
      {activePoint && (
        <div className="p-3 rounded-xl bg-surface-2/80 border border-border flex items-center justify-between text-xs font-mono">
          <span className="text-text-muted">
            Timeframe: <span className="text-text font-bold">{activePoint.timeLabel}</span>
          </span>
          <span className="text-text font-bold">
            {currentCfg.label}:{' '}
            <span style={{ color: currentCfg.color }}>
              {activePoint[selectedMetric].toLocaleString()}
              {currentCfg.unit}
            </span>
          </span>
        </div>
      )}
    </GlassCard>
  );
};

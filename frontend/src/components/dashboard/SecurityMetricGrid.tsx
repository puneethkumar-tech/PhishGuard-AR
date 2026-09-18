'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { DashboardKpiMetric } from '@/types';
import {
  ScanLine,
  ShieldAlert,
  Cpu,
  AlertTriangle,
  FlaskConical,
  RefreshCw,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

interface SecurityMetricGridProps {
  metrics: DashboardKpiMetric[];
}

export const SecurityMetricGrid: React.FC<SecurityMetricGridProps> = ({ metrics }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ScanLine':
        return <ScanLine className="w-4 h-4 text-cyber-cyan" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-4 h-4 text-cyber-danger" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4 text-primary-bright" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-4 h-4 text-cyber-warning" />;
      case 'FlaskConical':
        return <FlaskConical className="w-4 h-4 text-purple-300" />;
      case 'RefreshCw':
      default:
        return <RefreshCw className="w-4 h-4 text-cyber-success" />;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {metrics.map((kpi) => {
        const isPositive = kpi.trendType === 'positive';
        const minVal = Math.min(...kpi.sparkline);
        const maxVal = Math.max(...kpi.sparkline);
        const range = maxVal - minVal || 1;

        // Generate sparkline path
        const svgWidth = 100;
        const svgHeight = 24;
        const points = kpi.sparkline
          .map((v, i) => {
            const x = (i / (kpi.sparkline.length - 1)) * svgWidth;
            const y = svgHeight - ((v - minVal) / range) * (svgHeight - 6) - 3;
            return `${x},${y}`;
          })
          .join(' ');

        return (
          <GlassCard
            key={kpi.id}
            className="p-4 flex flex-col justify-between hover:border-cyber-cyan/40 transition-all group"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 rounded-lg bg-surface-3 group-hover:bg-surface-2 transition-colors">
                  {getIcon(kpi.icon)}
                </div>
                <span className="text-[9px] font-mono text-text-muted bg-surface-3 px-1.5 py-0.5 rounded">
                  {kpi.tag}
                </span>
              </div>

              {/* Label */}
              <span className="text-[11px] font-mono text-text-muted uppercase tracking-wider block mb-1">
                {kpi.label}
              </span>

              {/* Value */}
              <div className="text-xl sm:text-2xl font-extrabold font-mono text-text mb-1">
                {kpi.value}
              </div>
            </div>

            {/* Sparkline & Trend */}
            <div className="pt-2 border-t border-border/50 space-y-1.5">
              <div className="w-full h-6">
                <svg
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  className="w-full h-full overflow-visible"
                >
                  <polyline
                    fill="none"
                    stroke={isPositive ? '#06b6d4' : '#ef4444'}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                  />
                </svg>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono">
                <span
                  className={`flex items-center gap-1 font-bold ${
                    isPositive ? 'text-cyber-success' : 'text-cyber-danger'
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {kpi.trend}
                </span>
              </div>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
};

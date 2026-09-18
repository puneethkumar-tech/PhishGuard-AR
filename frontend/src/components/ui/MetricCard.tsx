'use client';

import React from 'react';
import { GlassCard } from './GlassCard';
import { Badge } from './Badge';
import { ScanLine, ShieldAlert, Cpu, Zap, TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';
import { MetricCardData } from '@/types';

const ICON_MAP: Record<string, React.ReactNode> = {
  ScanLine: <ScanLine className="w-5 h-5 text-primary-bright" />,
  ShieldAlert: <ShieldAlert className="w-5 h-5 text-cyber-danger" />,
  Cpu: <Cpu className="w-5 h-5 text-cyber-cyan" />,
  Zap: <Zap className="w-5 h-5 text-cyber-warning" />,
};

interface MetricCardProps {
  data: MetricCardData;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ data, className }) => {
  const icon = ICON_MAP[data.iconName] || <HelpCircle className="w-5 h-5 text-primary-bright" />;

  return (
    <GlassCard variant="interactive" className={`p-5 group ${className || ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="p-2.5 rounded-xl bg-surface-2/80 border border-border group-hover:border-primary-bright/40 transition-colors">
          {icon}
        </div>
        <Badge variant="demo" size="sm" dot>
          {data.tag}
        </Badge>
      </div>

      <div className="space-y-1">
        <span className="text-xs uppercase tracking-wider text-text-muted font-medium block">
          {data.title}
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl lg:text-3xl font-bold tracking-tight text-text">
            {data.value}
          </span>
          {data.change && (
            <span
              className={`text-xs font-semibold flex items-center gap-0.5 ${
                data.changeType === 'positive'
                  ? 'text-cyber-success'
                  : data.changeType === 'negative'
                  ? 'text-cyber-danger'
                  : 'text-text-muted'
              }`}
            >
              {data.changeType === 'positive' && <TrendingUp className="w-3 h-3" />}
              {data.changeType === 'negative' && <TrendingDown className="w-3 h-3" />}
              {data.change}
            </span>
          )}
        </div>
      </div>

      <p className="mt-3 text-xs text-text-muted/90 line-clamp-1">
        {data.description}
      </p>
    </GlassCard>
  );
};

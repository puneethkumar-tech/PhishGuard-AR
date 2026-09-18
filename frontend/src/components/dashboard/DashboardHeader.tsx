'use client';

import React from 'react';
import { LayoutDashboard, RotateCcw, Clock, Sparkles, ShieldCheck } from 'lucide-react';
import { GlowButton } from '@/components/ui/GlowButton';
import { Badge } from '@/components/ui/Badge';
import { DashboardTimeRange } from '@/types';

interface DashboardHeaderProps {
  timeRange: DashboardTimeRange;
  onChangeTimeRange: (range: DashboardTimeRange) => void;
  onRefreshSimulation: () => void;
  isRefreshing: boolean;
  snapshotTimestamp: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  timeRange,
  onChangeTimeRange,
  onRefreshSimulation,
  isRefreshing,
  snapshotTimestamp,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-surface/80 border border-border shadow-glass backdrop-blur-md">
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyber-cyan/20 border border-cyber-cyan/40 text-cyber-cyan">
            <LayoutDashboard className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono font-bold tracking-widest text-cyber-cyan uppercase">
            PHASE 7 // SOC ANALYTICS COMMAND CENTER
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse" />
            SIMULATION ENVIRONMENT
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text">
          Security Analytics Command Center
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
          <span>AI-powered threat intelligence and adversarial resilience overview.</span>
          <span className="text-border">•</span>
          <span className="text-[11px] font-mono text-purple-300 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {snapshotTimestamp}
          </span>
        </div>
      </div>

      {/* Action Controls: Time Range Tabs + Refresh Button */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Time Range Selector */}
        <div className="flex items-center p-1 rounded-xl bg-surface-2 border border-border">
          {(['24H', '7D', '30D'] as DashboardTimeRange[]).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => onChangeTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                timeRange === range
                  ? 'bg-gradient-to-r from-primary to-cyber-cyan text-black font-extrabold shadow-glass'
                  : 'text-text-muted hover:text-text hover:bg-surface-3'
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Refresh Simulation */}
        <GlowButton
          variant="outline"
          size="sm"
          onClick={onRefreshSimulation}
          isLoading={isRefreshing}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Refresh Simulation
        </GlowButton>
      </div>
    </div>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import { DashboardTimeRange, DashboardDataset } from '@/types';
import {
  getDashboardDataset,
  saveDashboardLocalSnapshot,
  loadDashboardLocalSnapshot,
} from '@/lib/dashboard-analytics';

// Subcomponents
import { DashboardHeader } from './DashboardHeader';
import { SecurityPostureCard } from './SecurityPostureCard';
import { SecurityMetricGrid } from './SecurityMetricGrid';
import { ThreatActivityChart } from './ThreatActivityChart';
import { ThreatSeverityDistribution } from './ThreatSeverityDistribution';
import { ThreatTypeBreakdown } from './ThreatTypeBreakdown';
import { DetectionPerformancePanel } from './DetectionPerformancePanel';
import { DashboardModelComparison } from './DashboardModelComparison';
import { DashboardRobustnessPanel } from './DashboardRobustnessPanel';
import { AttackTechniqueAnalytics } from './AttackTechniqueAnalytics';
import { DefenseEffectivenessPanel } from './DefenseEffectivenessPanel';
import { SecurityTrendPanel } from './SecurityTrendPanel';
import { SecurityEventFeed } from './SecurityEventFeed';
import { TopThreatSignals } from './TopThreatSignals';
import { SecurityInsightPanel } from './SecurityInsightPanel';
import { SecurityPostureBreakdown } from './SecurityPostureBreakdown';
import { DashboardQuickActions } from './DashboardQuickActions';
import { SimulationEnvironmentFooter } from './SimulationEnvironmentFooter';
import { AIIntelligenceWorkspace } from '@/components/ai/AIIntelligenceWorkspace';
import { Loader2, AlertCircle, Brain, LayoutDashboard, Sparkles, Network } from 'lucide-react';
import { GlowButton } from '@/components/ui/GlowButton';

export const DashboardWorkspace: React.FC = () => {
  const [dashboardTab, setDashboardTab] = useState<'analytics' | 'intelligence'>('analytics');
  const [timeRange, setTimeRange] = useState<DashboardTimeRange>('24H');
  const [seedVariant, setSeedVariant] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [dataset, setDataset] = useState<DashboardDataset>(() =>
    getDashboardDataset('24H', 0)
  );

  // Handle Time Range Change
  const handleTimeRangeChange = (range: DashboardTimeRange) => {
    setTimeRange(range);
    setIsRefreshing(true);
    setTimeout(() => {
      const updated = getDashboardDataset(range, seedVariant);
      setDataset(updated);
      setIsRefreshing(false);
      saveDashboardLocalSnapshot(updated);
    }, 250);
  };

  // Handle Simulation Refresh
  const handleRefreshSimulation = () => {
    setIsRefreshing(true);
    const nextSeed = seedVariant + 1;
    setSeedVariant(nextSeed);

    setTimeout(() => {
      const updated = getDashboardDataset(timeRange, nextSeed);
      setDataset(updated);
      setIsRefreshing(false);
      saveDashboardLocalSnapshot(updated);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Top Workspace View Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/15 pb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDashboardTab('analytics')}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              dashboardTab === 'analytics'
                ? 'border-cyan-400/60 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>SOC Telemetry & Analytics</span>
          </button>

          <button
            type="button"
            onClick={() => setDashboardTab('intelligence')}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              dashboardTab === 'intelligence'
                ? 'border-cyan-400/60 bg-gradient-to-r from-cyan-500/20 to-violet-600/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <Brain className="h-4 w-4 text-cyan-400" />
            <span>AI Intelligence Core (Phase 8)</span>
            <span className="rounded-full bg-cyan-500/20 border border-cyan-500/40 px-1.5 py-0.2 text-[9px] text-cyan-300">
              3D Neural
            </span>
          </button>
        </div>

        <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Deterministic Simulated Environment</span>
        </div>
      </div>

      {/* Tab 2: AI Intelligence Core View */}
      {dashboardTab === 'intelligence' && (
        <div className="space-y-6 animate-fadeIn">
          <AIIntelligenceWorkspace />
        </div>
      )}

      {/* Tab 1: SOC Telemetry & Analytics View (Preserving Phase 7 with embedded AI Core preview) */}
      {dashboardTab === 'analytics' && (
        <div className="space-y-6">
          {/* 1. Header with Time Range Selector & Refresh */}
          <DashboardHeader
            timeRange={timeRange}
            onChangeTimeRange={handleTimeRangeChange}
            onRefreshSimulation={handleRefreshSimulation}
            isRefreshing={isRefreshing}
            snapshotTimestamp={dataset.snapshotTimestamp}
          />

          {/* 2. Security Posture Hero Card */}
          <SecurityPostureCard
            score={dataset.postureScore}
            rating={dataset.postureRating}
            subMetrics={dataset.postureSubMetrics}
          />

          {/* 3. KPI Metric Grid (6 Cards) */}
          <SecurityMetricGrid metrics={dataset.kpis} />

          {/* 4. Threat Activity Timeseries & Severity Donut */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-7 flex flex-col">
              <ThreatActivityChart
                data={dataset.threatActivity}
                timeRange={timeRange}
              />
            </div>
            <div className="lg:col-span-5 flex flex-col">
              <ThreatSeverityDistribution
                items={dataset.severityDistribution}
                totalAnalyzed={dataset.kpis[0].numericValue}
              />
            </div>
          </div>

          {/* 5. Phase 8 AI Intelligence Core Spotlight Banner */}
          <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-cyan-950/30 to-slate-950 p-5 font-mono shadow-[0_0_30px_rgba(6,182,212,0.1)]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <Brain className="h-6 w-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                      PhishGuard AI Intelligence Core
                    </h3>
                    <span className="rounded bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.2 text-[9px] text-cyan-300 uppercase">
                      3D Neural Network Active
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Explore 7 conceptual neural layers, 8-stage Bayesian signal fusion, and token-level attention attributions.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDashboardTab('intelligence')}
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-400 bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:scale-105"
              >
                <Sparkles className="h-4 w-4 fill-slate-950" />
                <span>Launch 3D Intelligence</span>
              </button>
            </div>
          </div>

          {/* 6. Threat Categories & Influential Threat Signals */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-6 flex flex-col">
              <ThreatTypeBreakdown types={dataset.threatTypes} />
            </div>
            <div className="lg:col-span-6 flex flex-col">
              <TopThreatSignals signals={dataset.topSignals} />
            </div>
          </div>

          {/* 7. Detection Performance Benchmarks & Model Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-6 flex flex-col">
              <DetectionPerformancePanel data={dataset.detectionPerformance} />
            </div>
            <div className="lg:col-span-6 flex flex-col">
              <DashboardModelComparison metrics={dataset.modelComparison} />
            </div>
          </div>

          {/* 8. Adversarial Robustness Overview & Security Posture Radar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-6 flex flex-col">
              <DashboardRobustnessPanel robustness={dataset.robustness} />
            </div>
            <div className="lg:col-span-6 flex flex-col">
              <SecurityPostureBreakdown axes={dataset.postureBreakdown} />
            </div>
          </div>

          {/* 9. Attack Technique Analytics & Defense Countermeasures */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-6 flex flex-col">
              <AttackTechniqueAnalytics attacks={dataset.attackAnalytics} />
            </div>
            <div className="lg:col-span-6 flex flex-col">
              <DefenseEffectivenessPanel defenses={dataset.defenseEffectiveness} />
            </div>
          </div>

          {/* 10. Security Trend Multi-Metric Visualizer */}
          <SecurityTrendPanel trends={dataset.securityTrends} />

          {/* 11. Live Simulated Security Event Feed */}
          <SecurityEventFeed events={dataset.events} />

          {/* 12. AI Security Analyst Briefing + 3D Robot Integration */}
          <SecurityInsightPanel insightText={dataset.aiInsightText} />

          {/* 13. Quick Operations Navigation Actions */}
          <DashboardQuickActions />

          {/* 14. Simulation Environment Footer Strip */}
          <SimulationEnvironmentFooter />
        </div>
      )}
    </div>
  );
};

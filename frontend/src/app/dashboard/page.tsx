'use client';

import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { MetricCard } from '@/components/ui/MetricCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { LiveThreatMap } from '@/components/home/LiveThreatMap';
import { ThreatActivityChart } from '@/components/home/ThreatActivityChart';
import { DEMO_METRICS } from '@/lib/demo-data';
import { Activity, ShieldCheck, Wifi, Radio, AlertCircle, CheckCircle2, Server, Cpu } from 'lucide-react';

const SENSOR_NODES = [
  { name: 'US-East Exchange Sensor', status: 'Online', latency: '4ms', load: '32%' },
  { name: 'EU-Central Mail Gateway', status: 'Online', latency: '12ms', load: '48%' },
  { name: 'AP-South Ingestion Proxy', status: 'Online', latency: '28ms', load: '55%' },
  { name: 'Adversarial Defense Cache', status: 'Optimal', latency: '1ms', load: '14%' },
];

export default function DashboardPage() {
  return (
    <PageContainer>
      {/* 1. Standard Page Header */}
      <PageHeader
        eyebrow="SECURITY OPERATIONS"
        title="SOC Telemetry & Threat Dashboard"
        description="Comprehensive security telemetry, attack vector distribution, and cross-channel sensor health metrics."
        statusBadge={{ label: "Live Telemetry Feed", variant: "cyan", dot: true }}
      />

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DEMO_METRICS.map((metric) => (
          <MetricCard key={metric.id} data={metric} />
        ))}
      </div>

      {/* 3. Primary Telemetry & Activity Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6">
          <LiveThreatMap />
        </div>
        <div className="lg:col-span-6">
          <ThreatActivityChart />
        </div>
      </div>

      {/* 4. Attack Vector Breakdown & Sensor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Attack Vector Distribution */}
        <div className="lg:col-span-7">
          <GlassCard className="p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-text">
                  Attack Vector Distribution (24H Telemetry)
                </h3>
                <Badge variant="demo" size="sm">DEMO</Badge>
              </div>
              <p className="text-xs text-text-muted mb-4">
                Categorized threat distribution across enterprise message traffic.
              </p>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-text mb-1">
                    <span className="font-semibold">Credential Harvester Portals</span>
                    <span className="font-mono text-primary-bright font-bold">54.2%</span>
                  </div>
                  <div className="w-full bg-surface-2 h-2 rounded-full overflow-hidden border border-border">
                    <div className="bg-primary-bright h-full rounded-full" style={{ width: '54.2%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-text mb-1">
                    <span className="font-semibold">Homoglyph & Zero-Width Evasion Attacks</span>
                    <span className="font-mono text-cyber-violet font-bold">28.6%</span>
                  </div>
                  <div className="w-full bg-surface-2 h-2 rounded-full overflow-hidden border border-border">
                    <div className="bg-cyber-violet h-full rounded-full" style={{ width: '28.6%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-text mb-1">
                    <span className="font-semibold">Executive Impersonation / BEC Wire Fraud</span>
                    <span className="font-mono text-cyber-danger font-bold">17.2%</span>
                  </div>
                  <div className="w-full bg-surface-2 h-2 rounded-full overflow-hidden border border-border">
                    <div className="bg-cyber-danger h-full rounded-full" style={{ width: '17.2%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-text-muted">
              <span>Total Threat Samples Categorized: 237</span>
              <span className="text-cyber-cyan">AR Defense Active</span>
            </div>
          </GlassCard>
        </div>

        {/* Sensor Grid Status */}
        <div className="lg:col-span-5">
          <GlassCard className="p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-cyber-cyan" />
                  <h3 className="text-base font-bold text-text">Sensor Infrastructure</h3>
                </div>
                <Badge variant="success" size="sm" dot>ALL HEALTHY</Badge>
              </div>
              <p className="text-xs text-text-muted mb-4">
                Active telemetry nodes evaluating incoming payloads.
              </p>

              <div className="space-y-2.5">
                {SENSOR_NODES.map((sensor) => (
                  <div
                    key={sensor.name}
                    className="p-3 rounded-xl bg-surface-2/70 border border-border/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-text block">{sensor.name}</span>
                      <span className="text-[10px] font-mono text-text-muted">
                        Latency: {sensor.latency} • Load: {sensor.load}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyber-success/15 text-cyber-success border border-cyber-success/30 font-semibold">
                      {sensor.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-border/60 text-[11px] font-mono text-text-muted text-center">
              Simulation Telemetry Stream • Phase 2 UX
            </div>
          </GlassCard>
        </div>
      </div>
    </PageContainer>
  );
}

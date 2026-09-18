'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Globe2, Radio, ShieldAlert, Wifi } from 'lucide-react';
import { DEMO_THREAT_NODES } from '@/lib/demo-data';

export const LiveThreatMap: React.FC = () => {
  return (
    <GlassCard className="p-5 sm:p-6 flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyber-danger animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-text">
              Live Threat Telemetry
            </span>
          </div>
          <Badge variant="demo" size="sm" dot>
            DEMO TELEMETRY
          </Badge>
        </div>
        <p className="text-xs text-text-muted">
          Simulated geographic distribution of detected phishing vector origins.
        </p>
      </div>

      {/* Cyber World Grid Map Visual */}
      <div className="relative my-4 h-48 sm:h-56 rounded-xl bg-surface-2/90 border border-border/70 overflow-hidden flex items-center justify-center">
        {/* World Grid Lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#2563FF_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />

        {/* Global Outline Graphic (Stylized Cyber Map) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-40">
          <Globe2 className="w-40 h-40 text-primary-bright/40" />
        </div>

        {/* Simulated Telemetry Nodes */}
        {DEMO_THREAT_NODES.slice(0, 4).map((node, i) => {
          const positions = [
            { top: '28%', left: '25%' },
            { top: '35%', left: '48%' },
            { top: '65%', left: '78%' },
            { top: '72%', left: '32%' },
          ];
          const pos = positions[i] || { top: '50%', left: '50%' };

          return (
            <div
              key={node.id}
              className="absolute group cursor-pointer"
              style={{ top: pos.top, left: pos.left }}
            >
              <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-cyber-danger opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyber-danger shadow-danger-glow" />
              </div>

              {/* Hover Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                <div className="px-2.5 py-1.5 rounded-lg bg-surface border border-border text-[10px] font-mono text-text shadow-glass whitespace-nowrap">
                  <p className="font-bold text-cyber-cyan">{node.label}</p>
                  <p className="text-text-muted">{node.type}</p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Status Overlay Pill */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface/90 border border-border/80 text-[10px] font-mono text-text-muted">
          <Wifi className="w-3 h-3 text-cyber-success" />
          <span>Global Sensor Grid Active</span>
        </div>
      </div>

      {/* Footer Feed Preview */}
      <div className="space-y-2 pt-2 border-t border-border/50">
        <div className="text-[11px] font-mono text-text-muted flex items-center justify-between">
          <span>Recent Origin:</span>
          <span className="text-cyber-danger font-semibold">San Francisco [URL Harvester]</span>
        </div>
      </div>
    </GlassCard>
  );
};

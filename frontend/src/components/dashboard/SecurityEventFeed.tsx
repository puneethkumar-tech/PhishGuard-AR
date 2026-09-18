'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { SecurityEventFeedItem } from '@/types';
import {
  Activity,
  ShieldAlert,
  ShieldCheck,
  Zap,
  RefreshCw,
  AlertTriangle,
  Radio,
} from 'lucide-react';

interface SecurityEventFeedProps {
  events: SecurityEventFeedItem[];
}

export const SecurityEventFeed: React.FC<SecurityEventFeedProps> = ({ events }) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'PHISHING DETECTED':
      case 'BLOCKED PAYLOAD':
        return <ShieldAlert className="w-4 h-4 text-cyber-danger" />;
      case 'ROBUSTNESS TEST':
        return <Zap className="w-4 h-4 text-purple-300" />;
      case 'DEFENSE SIMULATION':
        return <RefreshCw className="w-4 h-4 text-cyber-success" />;
      case 'SUSPICIOUS URL':
        return <AlertTriangle className="w-4 h-4 text-cyber-warning" />;
      case 'SAFE MESSAGE':
      default:
        return <ShieldCheck className="w-4 h-4 text-cyber-cyan" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'CONTAINED':
      case 'QUARANTINED':
        return 'danger';
      case 'HARDENED':
        return 'success';
      case 'ANALYZED':
        return 'warning';
      case 'CLEAN':
      default:
        return 'cyan';
    }
  };

  return (
    <GlassCard className="p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyber-cyan/20 text-cyber-cyan">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text uppercase tracking-wider font-mono">
              Live Simulated Security Event Feed
            </h3>
            <p className="text-[11px] text-text-muted">
              Streaming timeline of incoming threat detections and AR hardening events.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-cyber-cyan bg-cyber-cyan/15 px-2 py-0.5 rounded border border-cyber-cyan/30">
          ● SIMULATED EVENT STREAM
        </span>
      </div>

      {/* Feed List */}
      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="p-3 rounded-xl bg-surface-2/70 border border-border/70 hover:border-cyber-cyan/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            {/* Left info */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-surface-3 shrink-0 mt-0.5">
                {getEventIcon(evt.eventType)}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono text-cyber-cyan font-bold bg-surface-3 px-1.5 py-0.2 rounded">
                    {evt.timestamp}
                  </span>
                  <span className="text-xs font-bold text-text font-mono">
                    {evt.eventType}
                  </span>
                  <span className="text-[10px] text-purple-300 font-mono">
                    [{evt.category}]
                  </span>
                </div>

                <p className="text-xs text-text-muted mt-0.5 leading-snug">
                  {evt.shortDescription}
                </p>
              </div>
            </div>

            {/* Right confidence & status badge */}
            <div className="flex items-center gap-3 shrink-0 sm:self-center self-end text-xs font-mono">
              <span className="text-text font-bold">
                {evt.confidence.toFixed(1)}%
              </span>
              <Badge variant={getStatusBadgeVariant(evt.status)} size="sm">
                {evt.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

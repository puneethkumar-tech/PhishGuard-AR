'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { RobustnessTimelineEvent } from '@/types';
import { Clock, CheckCircle2, CircleDot } from 'lucide-react';

interface RobustnessTimelineProps {
  timeline: RobustnessTimelineEvent[];
}

export const RobustnessTimeline: React.FC<RobustnessTimelineProps> = ({ timeline }) => {
  return (
    <GlassCard className="p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyber-cyan/20 text-cyber-cyan">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text uppercase tracking-wider font-mono">
              Simulation Execution Timeline
            </h3>
            <p className="text-[11px] text-text-muted">
              Step-by-step audit of automated adversary injection and defense normalization.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-text-muted">
          SIMULATED TIMECODES
        </span>
      </div>

      {/* Timeline Items */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60">
        {timeline.map((event, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-cyber-cyan ring-4 ring-surface flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-surface" />
            </div>

            <div className="p-3 rounded-xl bg-surface-2/70 border border-border group-hover:border-border/80 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                <span className="text-xs font-bold text-text font-mono flex items-center gap-2">
                  <span className="text-[10px] text-cyber-cyan bg-cyber-cyan/15 px-1.5 py-0.5 rounded">
                    {event.timestamp}
                  </span>
                  {event.title}
                </span>
                <span className="text-[10px] font-mono text-purple-300 font-semibold">
                  {event.phase}
                </span>
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

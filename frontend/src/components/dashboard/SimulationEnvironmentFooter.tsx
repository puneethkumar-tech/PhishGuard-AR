'use client';

import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export const SimulationEnvironmentFooter: React.FC = () => {
  return (
    <div className="p-4 rounded-xl bg-surface/60 border border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-text-muted">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
        <span className="font-bold text-text uppercase">
          Simulation Environment Active
        </span>
      </div>

      <p className="text-[11px] leading-relaxed max-w-2xl text-text-muted">
        All analytics shown on this dashboard are deterministic frontend demonstration data. No live threat telemetry, external intelligence feeds, or production model inference are connected.
      </p>

      <span className="text-[10px] text-cyber-cyan font-semibold shrink-0">
        PhishGuard-AR // Phase 7
      </span>
    </div>
  );
};

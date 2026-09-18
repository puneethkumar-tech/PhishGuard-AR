'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface EvidenceSignalListProps {
  signals: Array<{ signal: string; description: string; contribution: 'HIGH' | 'MEDIUM' | 'LOW' }>;
  isSafe: boolean;
}

export const EvidenceSignalList: React.FC<EvidenceSignalListProps> = ({ signals, isSafe }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-mono uppercase text-text-muted font-bold flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-cyber-cyan" />
          <span>Ranked Security Signals (Demo Contribution)</span>
        </h4>
        <span className="text-[10px] font-mono text-text-muted">FEATURE IMPORTANCE</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {signals.map((sig, idx) => {
          const isHigh = sig.contribution === 'HIGH';
          const isMed = sig.contribution === 'MEDIUM';

          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-surface/80 border border-border/80 hover:border-primary-bright/40 transition-all flex flex-col justify-between space-y-2 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {isSafe ? (
                    <CheckCircle2 className="w-4 h-4 text-cyber-success flex-shrink-0" />
                  ) : (
                    <AlertTriangle
                      className={`w-4 h-4 flex-shrink-0 ${
                        isHigh ? 'text-cyber-danger' : isMed ? 'text-cyber-warning' : 'text-cyber-cyan'
                      }`}
                    />
                  )}
                  <h5 className="text-xs font-bold text-text truncate group-hover:text-primary-bright transition-colors">
                    {sig.signal}
                  </h5>
                </div>

                <span
                  className={`px-1.5 py-0.2 rounded text-[9px] font-mono uppercase font-bold border flex-shrink-0 ${
                    isSafe
                      ? 'bg-cyber-success/15 text-cyber-success border-cyber-success/30'
                      : isHigh
                      ? 'bg-cyber-danger/15 text-cyber-danger border-cyber-danger/30'
                      : isMed
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      : 'bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan/30'
                  }`}
                >
                  {sig.contribution} WEIGHT
                </span>
              </div>

              <p className="text-[11px] text-text-muted leading-relaxed font-sans">
                {sig.description}
              </p>

              {/* Mini Contribution Bar */}
              <div className="pt-1">
                <div className="w-full bg-surface-3 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isSafe
                        ? 'bg-cyber-success'
                        : isHigh
                        ? 'bg-cyber-danger'
                        : isMed
                        ? 'bg-amber-400'
                        : 'bg-cyber-cyan'
                    }`}
                    style={{ width: isHigh ? '90%' : isMed ? '65%' : '35%' }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

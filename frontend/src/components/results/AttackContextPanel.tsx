'use client';

import React from 'react';
import { MitreAttackContext, AttackChainStep } from '@/types';
import { ShieldAlert, ArrowRight, ShieldCheck, Terminal, MapPin } from 'lucide-react';

interface AttackContextPanelProps {
  mitreContext?: MitreAttackContext;
  attackChain: AttackChainStep[];
}

export const AttackContextPanel: React.FC<AttackContextPanelProps> = ({
  mitreContext,
  attackChain,
}) => {
  return (
    <div className="space-y-5">
      {/* MITRE ATT&CK Mapping Card */}
      {mitreContext && (
        <div className="p-5 rounded-2xl bg-surface-2/60 border border-border/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/70">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyber-cyan" />
              <h4 className="text-xs font-mono uppercase font-bold text-text">
                Simulated MITRE ATT&CK&reg; Context
              </h4>
            </div>

            <span className="text-[10px] font-mono text-text-muted">
              STATIC EDUCATIONAL MAPPING
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-surface border border-border space-y-1">
              <span className="text-[9px] text-text-muted uppercase block">Technique ID</span>
              <span className="font-bold text-primary-bright text-sm">{mitreContext.techniqueId}</span>
            </div>

            <div className="p-3 rounded-xl bg-surface border border-border space-y-1">
              <span className="text-[9px] text-text-muted uppercase block">Technique Name</span>
              <span className="font-bold text-text truncate block">{mitreContext.techniqueName}</span>
            </div>

            <div className="p-3 rounded-xl bg-surface border border-border space-y-1">
              <span className="text-[9px] text-text-muted uppercase block">Tactic Category</span>
              <span className="font-bold text-cyber-cyan truncate block">{mitreContext.tactic}</span>
            </div>
          </div>

          <p className="text-xs text-text-muted leading-relaxed font-sans bg-surface/70 p-3 rounded-xl border border-border">
            {mitreContext.description}
          </p>
        </div>
      )}

      {/* 4-Stage Attack Chain Flow */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-border/70">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-primary-bright" />
            <h4 className="text-xs font-mono uppercase font-bold text-text">
              Simulated Attack Chain Flow
            </h4>
          </div>
          <span className="text-[10px] font-mono text-cyber-success">
            THREAT CONTAINED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {attackChain.map((step, idx) => {
            const isContained = step.status === 'contained' || step.status === 'prevented';

            return (
              <div
                key={step.step || idx}
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between space-y-2 relative ${
                  isContained
                    ? 'bg-cyber-success/10 border-cyber-success/40'
                    : 'bg-surface/80 border-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-text-muted">
                    PHASE 0{step.step}
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[8px] font-mono uppercase font-bold border ${
                      isContained
                        ? 'bg-cyber-success/20 text-cyber-success border-cyber-success/30'
                        : 'bg-surface-3 text-text-muted border-border'
                    }`}
                  >
                    {step.status}
                  </span>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-text">{step.title}</h5>
                  <p className="text-[10px] text-text-muted mt-1 leading-relaxed font-sans">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

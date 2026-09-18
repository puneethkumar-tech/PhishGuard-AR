'use client';

import React from 'react';
import { Cpu, CheckCircle2, Shield, Activity, Sparkles, Box } from 'lucide-react';
import { AIHolographicPanel } from './AIHolographicPanel';

interface AISystemStatusProps {
  is3DActive: boolean;
}

export const AISystemStatus: React.FC<AISystemStatusProps> = ({ is3DActive }) => {
  const statusItems = [
    { label: 'MODEL STATUS', value: 'SIMULATED READY', status: 'ONLINE', icon: Cpu, color: 'text-cyan-400' },
    { label: 'FEATURE EXTRACTION', value: 'ONLINE (10K TF-IDF)', status: 'ACTIVE', icon: Activity, color: 'text-blue-400' },
    { label: 'SIGNAL FUSION', value: 'READY (8 SIGNALS)', status: 'CALIBRATED', icon: Sparkles, color: 'text-emerald-400' },
    { label: 'ROBUSTNESS ENGINE', value: 'READY (10 ATTACK CLASSES)', status: 'HARDENED', icon: Shield, color: 'text-amber-400' },
    { label: 'EXPLAINABILITY', value: 'READY (ATTRIBUTION GRAPH)', status: 'ONLINE', icon: CheckCircle2, color: 'text-pink-400' },
    { label: 'VISUALIZATION CORE', value: is3DActive ? '3D R3F ACTIVE' : '2D FALLBACK ACTIVE', status: 'ONLINE', icon: Box, color: 'text-teal-400' },
  ];

  return (
    <AIHolographicPanel
      title="AI System Telemetry & Component Status"
      subtitle="Operational readiness of simulated AI detection and robustness sub-engines"
      icon={Activity}
      badge="SIMULATED STATUS"
      badgeColor="cyan"
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 font-mono text-xs">
        {statusItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <Icon className={`h-4 w-4 ${item.color}`} />
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              <div className="mt-2">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  {item.label}
                </div>
                <div className="text-[11px] font-bold text-slate-100 truncate mt-0.5">
                  {item.value}
                </div>
              </div>

              <div className="mt-2 border-t border-slate-800 pt-1 text-[9px] text-emerald-400 font-bold uppercase">
                ● {item.status}
              </div>
            </div>
          );
        })}
      </div>
    </AIHolographicPanel>
  );
};

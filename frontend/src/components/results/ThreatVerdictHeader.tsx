'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { ScanResult } from '@/types';
import { ShieldAlert, ShieldCheck, AlertTriangle, Cpu, Globe, Lock, Activity, Layers } from 'lucide-react';

interface ThreatVerdictHeaderProps {
  result: ScanResult;
}

export const ThreatVerdictHeader: React.FC<ThreatVerdictHeaderProps> = ({ result }) => {
  const isSafe = result.threatLevel === 'safe';
  const isAdversarial = result.threatLevel === 'adversarial';
  const isPhishing = result.threatLevel === 'phishing' || result.threatLevel === 'blocked';

  // Radius and circumference for circular gauge
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (result.confidence / 100) * circumference;

  const strokeColor = isSafe
    ? '#10b981' // Green
    : isAdversarial
    ? '#8b5cf6' // Violet
    : '#ef4444'; // Red

  return (
    <div
      className={`p-6 sm:p-7 rounded-2xl border transition-all ${
        isSafe
          ? 'bg-gradient-to-r from-surface-2 via-cyber-success/10 to-surface-2 border-cyber-success/40'
          : isAdversarial
          ? 'bg-gradient-to-r from-surface-2 via-cyber-violet/15 to-surface-2 border-cyber-violet/50 shadow-glass-glow'
          : 'bg-gradient-to-r from-surface-2 via-cyber-danger/15 to-surface-2 border-cyber-danger/50 shadow-danger-glow'
      }`}
    >
      {/* Top Banner Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-border/60">
        {/* Left: Icon & Title & Description */}
        <div className="flex items-start sm:items-center gap-4">
          <div
            className={`p-3.5 rounded-2xl border flex-shrink-0 ${
              isSafe
                ? 'bg-cyber-success/20 border-cyber-success/40 text-cyber-success'
                : isAdversarial
                ? 'bg-cyber-violet/20 border-cyber-violet/40 text-purple-300'
                : 'bg-cyber-danger/20 border-cyber-danger/40 text-cyber-danger'
            }`}
          >
            {isSafe ? (
              <ShieldCheck className="w-9 h-9" />
            ) : isAdversarial ? (
              <AlertTriangle className="w-9 h-9" />
            ) : (
              <ShieldAlert className="w-9 h-9" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted font-bold">
                AI THREAT ASSESSMENT
              </span>
              <Badge
                variant={isSafe ? 'success' : isAdversarial ? 'violet' : 'danger'}
                size="sm"
              >
                {result.metadata.actionSeverity}
              </Badge>
              <span className="text-[10px] font-mono text-cyber-cyan bg-cyber-cyan/15 px-2 py-0.5 rounded border border-cyber-cyan/30">
                ● SIMULATION
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
              {result.verdict}
            </h2>

            <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-sans max-w-2xl">
              {result.verdictDescription}
            </p>
          </div>
        </div>

        {/* Right: Circular Gauge & Severity Scale */}
        <div className="flex items-center gap-5 self-start lg:self-center">
          {/* Animated Radial Gauge */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke="currentColor"
                strokeWidth="8"
                className="text-surface-3/80"
              />
              <motion.circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={strokeColor}
                strokeWidth="8"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-lg sm:text-xl font-extrabold font-mono text-text">
                {result.confidence.toFixed(1)}%
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono uppercase text-text-muted font-bold tracking-wider">
                CONFIDENCE
              </span>
            </div>
          </div>

          {/* Severity Meter Pill */}
          <div className="space-y-1.5 font-mono text-xs">
            <span className="text-[10px] uppercase text-text-muted font-bold block">
              SEVERITY CLASSIFICATION
            </span>
            <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-surface/90 border border-border">
              {(['low', 'medium', 'high', 'critical'] as const).map((lvl) => {
                const isActive = result.severity === lvl || (result.severity === 'safe' && lvl === 'low');
                return (
                  <span
                    key={lvl}
                    className={`px-2 py-1 rounded text-[9px] font-bold uppercase transition-all ${
                      isActive
                        ? lvl === 'critical'
                          ? 'bg-cyber-violet text-white shadow-glass-glow'
                          : lvl === 'high'
                          ? 'bg-cyber-danger text-white shadow-danger-glow'
                          : lvl === 'medium'
                          ? 'bg-cyber-warning text-black font-bold'
                          : 'bg-cyber-success text-white'
                        : 'text-text-muted/60'
                    }`}
                  >
                    {lvl}
                  </span>
                );
              })}
            </div>
            <span className="text-[9px] text-text-muted block">
              Simulated Model Confidence
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Metadata Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-5 text-xs font-mono">
        <div className="p-2.5 rounded-xl bg-surface/70 border border-border/80">
          <span className="text-[9px] text-text-muted uppercase block">Threat Type</span>
          <span className="font-bold text-text truncate block">{result.metadata.threatType}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-surface/70 border border-border/80">
          <span className="text-[9px] text-text-muted uppercase block">Subcategory</span>
          <span className="font-bold text-cyber-cyan truncate block">{result.metadata.subcategory}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-surface/70 border border-border/80">
          <span className="text-[9px] text-text-muted uppercase block">Attack Vector</span>
          <span className="font-bold text-text truncate block">{result.metadata.vector}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-surface/70 border border-border/80">
          <span className="text-[9px] text-text-muted uppercase block">Detected Language</span>
          <span className="font-bold text-text truncate block">{result.metadata.language}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-surface/70 border border-border/80">
          <span className="text-[9px] text-text-muted uppercase block">Status</span>
          <span className="font-bold text-cyber-success truncate block">SIMULATION</span>
        </div>

        <div className="p-2.5 rounded-xl bg-surface/70 border border-border/80">
          <span className="text-[9px] text-text-muted uppercase block">Analysis Mode</span>
          <span className="font-bold text-primary-bright truncate block">{result.metadata.mode}</span>
        </div>
      </div>
    </div>
  );
};

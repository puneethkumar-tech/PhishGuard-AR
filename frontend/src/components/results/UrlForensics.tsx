'use client';

import React from 'react';
import { UrlForensicData } from '@/types';
import { Globe, AlertTriangle, ShieldCheck, Link2, ExternalLink } from 'lucide-react';

interface UrlForensicsProps {
  urlData?: UrlForensicData;
}

export const UrlForensics: React.FC<UrlForensicsProps> = ({ urlData }) => {
  if (!urlData) return null;

  const isCritical = urlData.riskLevel === 'CRITICAL' || urlData.riskLevel === 'HIGH';

  return (
    <div className="p-5 rounded-2xl bg-surface-2/60 border border-border/80 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-cyber-cyan" />
          <h4 className="text-xs font-mono uppercase font-bold text-text">
            URL & Domain Architecture Forensics
          </h4>
        </div>

        <span
          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border self-start sm:self-center ${
            isCritical
              ? 'bg-cyber-danger/15 text-cyber-danger border-cyber-danger/30'
              : 'bg-cyber-success/15 text-cyber-success border-cyber-success/30'
          }`}
        >
          {urlData.riskLevel} RISK RATING
        </span>
      </div>

      {/* Segmented URL Breakdown Chips */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono uppercase text-text-muted">
          Deconstructed Lexical Segments:
        </span>
        <div className="flex flex-wrap items-center gap-1.5 p-3 rounded-xl bg-surface/90 border border-border font-mono text-xs">
          <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <span className="text-[9px] text-amber-400/70 block text-[8px] uppercase">Protocol</span>
            {urlData.protocol}
          </span>

          <span className="px-2.5 py-1 rounded bg-cyber-danger/25 text-red-200 border border-cyber-danger/50 font-bold">
            <span className="text-[9px] text-red-400/70 block text-[8px] uppercase">Domain (Flagged)</span>
            {urlData.domain}
          </span>

          {urlData.path && (
            <span className="px-2 py-1 rounded bg-surface-3 text-text-muted border border-border">
              <span className="text-[9px] text-text-muted block text-[8px] uppercase">Path</span>
              {urlData.path}
            </span>
          )}

          {urlData.params && (
            <span className="px-2 py-1 rounded bg-cyber-cyan/15 text-cyan-200 border border-cyber-cyan/30">
              <span className="text-[9px] text-cyan-400/70 block text-[8px] uppercase">Parameters</span>
              {urlData.params}
            </span>
          )}
        </div>
      </div>

      {/* Forensic Flags */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono uppercase text-text-muted">
          Domain Anomaly Indicators:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {urlData.flags.map((flag, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-2 rounded-lg bg-surface/70 border border-cyber-danger/30 text-xs text-text-muted"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-cyber-danger flex-shrink-0" />
              <span className="text-[11px] truncate">{flag}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[10px] font-mono text-text-muted/80 italic">
        * URL analysis performed via static lexical parsing and local heuristics. No external DNS or network requests dispatched.
      </p>
    </div>
  );
};

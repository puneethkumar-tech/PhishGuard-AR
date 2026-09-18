'use client';

import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, Copy, Check, Info } from 'lucide-react';

interface RecommendationPanelProps {
  recommendation: string;
  isSafe: boolean;
  actionSeverity: string;
}

export const RecommendationPanel: React.FC<RecommendationPanelProps> = ({
  recommendation,
  isSafe,
  actionSeverity,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(recommendation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between pb-1">
        <h4 className="text-xs font-mono uppercase text-text-muted font-bold flex items-center gap-1.5">
          {isSafe ? (
            <ShieldCheck className="w-3.5 h-3.5 text-cyber-success" />
          ) : (
            <ShieldAlert className="w-3.5 h-3.5 text-cyber-danger" />
          )}
          <span>Recommended Security Action Protocol (Simulated SecOps Response)</span>
        </h4>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] font-mono text-text-muted hover:text-text transition-colors"
        >
          {copied ? <Check className="w-3 h-3 text-cyber-success" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied Protocol' : 'Copy'}</span>
        </button>
      </div>

      <div
        className={`p-4 rounded-xl border leading-relaxed text-xs transition-all ${
          isSafe
            ? 'bg-cyber-success/10 border-cyber-success/30 text-emerald-200'
            : 'bg-cyber-danger/10 border-cyber-danger/30 text-red-200'
        }`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-bold text-text font-mono text-xs uppercase">
            {isSafe ? 'PROTOCOL: VERIFIED BENIGN' : `ACTION REQUIRED: ${actionSeverity}`}
          </span>
          <span className="text-[10px] font-mono text-text-muted">FRONTEND ADVISORY</span>
        </div>

        <p className="text-text leading-relaxed font-sans">{recommendation}</p>
      </div>
    </div>
  );
};

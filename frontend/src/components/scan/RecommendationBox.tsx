'use client';

import React from 'react';
import { ShieldAlert, ShieldCheck, ArrowRight, ShieldCheckIcon } from 'lucide-react';

interface RecommendationBoxProps {
  recommendation: string;
  isSafe: boolean;
  isAdversarial?: boolean;
}

export const RecommendationBox: React.FC<RecommendationBoxProps> = ({
  recommendation,
  isSafe,
  isAdversarial,
}) => {
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-mono uppercase text-text-muted font-bold flex items-center gap-1.5">
        <ShieldCheckIcon className="w-3.5 h-3.5 text-cyber-success" />
        <span>Recommended Action Protocol (Simulated SecOps Response)</span>
      </h4>

      <div
        className={`p-4 rounded-xl border leading-relaxed text-xs transition-all ${
          isSafe
            ? 'bg-cyber-success/10 border-cyber-success/30 text-emerald-200'
            : isAdversarial
            ? 'bg-cyber-violet/10 border-cyber-violet/30 text-purple-200'
            : 'bg-cyber-danger/10 border-cyber-danger/30 text-red-200'
        }`}
      >
        <p className="font-semibold text-text mb-1">
          {isSafe
            ? 'VERIFIED ACTION: ROUTINE HANDLING'
            : isAdversarial
            ? 'ADVERSARIAL INCIDENT: IMMEDIATE QUARANTINE'
            : 'MALICIOUS THREAT: ISOLATE & BLOCK'}
        </p>
        <p className="text-text-muted leading-relaxed font-sans">{recommendation}</p>
      </div>
    </div>
  );
};

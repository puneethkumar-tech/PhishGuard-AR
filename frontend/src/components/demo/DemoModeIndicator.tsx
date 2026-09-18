'use client';

import React from 'react';
import { ShieldCheck, Sparkles, Terminal } from 'lucide-react';

export const DemoModeIndicator: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/20 text-[10px] font-mono text-cyan-600 dark:text-cyan-300 backdrop-blur-md shadow-sm select-none ${className}`}
      title="PhishGuard-AR operates in a 100% frontend simulation sandbox with local browser persistence."
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
      </span>
      <span className="font-bold tracking-wider uppercase">DEMO ENVIRONMENT</span>
      <span className="hidden xl:inline text-slate-400 dark:text-slate-500">•</span>
      <span className="hidden xl:inline text-slate-500 dark:text-slate-400">SIMULATED ML</span>
      <span className="hidden xl:inline text-slate-400 dark:text-slate-500">•</span>
      <span className="hidden xl:inline text-slate-500 dark:text-slate-400">LOCAL STORAGE</span>
    </div>
  );
};

'use client';

import React from 'react';
import { Info, Shield, Code, Cpu, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur-xl shadow-xl space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <Info className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-100">About PhishGuard-AR</h3>
          <p className="text-xs text-slate-400">
            Adversarially Robust AI-Assisted Phishing Detection — Frontend Demonstration.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-cyan-300">PhishGuard-AR</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              PHASE 9 VERIFIED
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            PhishGuard-AR demonstrates a next-generation AI security platform engineered to detect,
            explain, and resist adversarial evasion attacks (homoglyph obfuscation, zero-width
            injections, semantic perturbations) across phishing and malicious threat vectors.
          </p>
        </div>

        {/* Tech Stack */}
        <div>
          <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
            Engineered With
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              'Next.js 14 (App Router)',
              'React 18 & TypeScript',
              'Tailwind CSS',
              'Framer Motion',
              'Three.js / R3F',
              'Lucide React',
              'Local Browser Storage',
              'Deterministic Simulation',
            ].map((tech) => (
              <div
                key={tech}
                className="p-2 rounded-lg bg-slate-950/40 border border-slate-800/80 text-[11px] font-mono text-slate-300 flex items-center gap-1.5"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                <span className="truncate">{tech}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Runtime specs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">VERSION</span>
            <span className="text-slate-200 font-semibold">Phase 9 Demonstration Build</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">ENVIRONMENT</span>
            <span className="text-cyan-400 font-semibold">Frontend Simulation Sandbox</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">ML BACKEND</span>
            <span className="text-purple-400 font-semibold">Deterministic Emulation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

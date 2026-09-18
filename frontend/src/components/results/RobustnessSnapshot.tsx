'use client';

import React from 'react';
import Link from 'next/link';
import { RobustnessSnapshotData } from '@/types';
import { FlaskConical, ArrowRight, ShieldCheck, ShieldAlert, Cpu } from 'lucide-react';
import { GlowButton } from '@/components/ui/GlowButton';

interface RobustnessSnapshotProps {
  robustness: RobustnessSnapshotData;
}

export const RobustnessSnapshot: React.FC<RobustnessSnapshotProps> = ({ robustness }) => {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-surface-2/70 border border-primary-bright/30 space-y-5 shadow-glass">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-purple-300" />
          <h4 className="text-xs font-mono uppercase font-bold text-text">
            Adversarial Robustness Snapshot (Demo Simulation)
          </h4>
        </div>

        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyber-violet/20 text-purple-300 border border-cyber-violet/40">
          {robustness.stabilityScore}
        </span>
      </div>

      {/* 3-Stage Meter */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
        {/* Baseline */}
        <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1">
          <span className="text-[10px] font-mono text-text-muted uppercase block">
            01. Baseline Model
          </span>
          <span className="text-xl font-extrabold font-mono text-text block">
            {robustness.baselineConfidence.toFixed(1)}%
          </span>
          <span className="text-[10px] text-cyber-success font-mono">Unperturbed Accuracy</span>
        </div>

        {/* Perturbed Adversarial */}
        <div className="p-3.5 rounded-xl bg-cyber-danger/10 border border-cyber-danger/30 space-y-1">
          <span className="text-[10px] font-mono text-cyber-danger uppercase block">
            02. Under Attack
          </span>
          <span className="text-xl font-extrabold font-mono text-red-300 block">
            {robustness.perturbedConfidence.toFixed(1)}%
          </span>
          <span className="text-[10px] text-text-muted font-mono">{robustness.attackType}</span>
        </div>

        {/* Hardened Defense */}
        <div className="p-3.5 rounded-xl bg-cyber-violet/15 border border-cyber-violet/40 space-y-1 shadow-glass">
          <span className="text-[10px] font-mono text-purple-300 uppercase block">
            03. Hardened Defense
          </span>
          <span className="text-xl font-extrabold font-mono text-purple-200 block">
            {robustness.hardenedConfidence.toFixed(1)}%
          </span>
          <span className="text-[10px] text-cyber-success font-mono">Recovered Accuracy</span>
        </div>
      </div>

      {/* Defense Strategy & Interpretation */}
      <div className="p-4 rounded-xl bg-surface/90 border border-border space-y-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyber-success" />
          <span className="text-xs font-mono font-bold uppercase text-text">
            Defense Mechanism: {robustness.defenseStrategy}
          </span>
        </div>

        <p className="text-xs text-text-muted leading-relaxed font-sans">
          The simulated hardened defense pipeline maintains strong classification stability against evasion perturbations by executing Unicode NFKC confusable mapping and transformer attention normalization.
        </p>
      </div>

      {/* Link to Robustness Lab */}
      <div className="flex justify-end pt-1">
        <Link
          href="/robustness"
          onClick={() => {
            if (typeof window !== 'undefined') {
              localStorage.setItem(
                'phishguard_active_scan_sample',
                JSON.stringify({
                  input: `Target threat sample (${robustness.attackType}): verified under adversarial simulation`,
                  isHomoglyph: robustness.attackType.toLowerCase().includes('homoglyph'),
                })
              );
            }
          }}
        >
          <GlowButton
            variant="secondary"
            size="sm"
            rightIcon={<ArrowRight className="w-3.5 h-3.5 ml-1" />}
          >
            Open Full Robustness Lab →
          </GlowButton>
        </Link>
      </div>
    </div>
  );
};

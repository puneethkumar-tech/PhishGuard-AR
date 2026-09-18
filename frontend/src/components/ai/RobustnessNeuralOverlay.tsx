'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Lock,
  Activity,
} from 'lucide-react';
import { AIHolographicPanel } from './AIHolographicPanel';

interface RobustnessNeuralOverlayProps {
  baselineAccuracy?: number;
  underAttackAccuracy?: number;
  hardenedAccuracy?: number;
  scenarioName?: string;
}

export const RobustnessNeuralOverlay: React.FC<RobustnessNeuralOverlayProps> = ({
  baselineAccuracy = 0.942,
  underAttackAccuracy = 0.684,
  hardenedAccuracy = 0.896,
  scenarioName = 'Adversarial Unicode & Leetspeak Attack',
}) => {
  return (
    <AIHolographicPanel
      title="Adversarial Robustness Visualizer"
      subtitle="Phase 6 Hardening Architecture: Perturbation resistance and gradient regularization"
      icon={ShieldCheck}
      badge="SIMULATED ROBUSTNESS FLOW"
      badgeColor="amber"
      headerAction={
        <Link
          href="/robustness"
          className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1 font-mono text-xs font-semibold text-amber-300 uppercase transition-all duration-200 hover:border-amber-400 hover:bg-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
        >
          <span>Open Robustness Lab</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
      }
    >
      <div className="font-mono text-xs">
        {/* Flow Visualization: Baseline -> Under Attack -> Hardened */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* 1. Baseline Model */}
          <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-3.5">
            <div className="flex items-center justify-between text-[10px] text-blue-400 uppercase font-bold">
              <span>1. Standard Baseline</span>
              <Activity className="h-3.5 w-3.5" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-100">
              {(baselineAccuracy * 100).toFixed(1)}%
            </div>
            <div className="text-[10px] text-slate-400">Clean Payload Detection Rate</div>
            <p className="mt-2 text-[9px] text-slate-400 border-t border-blue-500/15 pt-2">
              Unmodified phishing samples detected with standard SVM & TF-IDF vectors.
            </p>
          </div>

          {/* 2. Under Adversarial Attack */}
          <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3.5">
            <div className="flex items-center justify-between text-[10px] text-rose-400 uppercase font-bold">
              <span>2. Under Perturbation</span>
              <ShieldAlert className="h-3.5 w-3.5" />
            </div>
            <div className="mt-2 text-2xl font-bold text-rose-400">
              {(underAttackAccuracy * 100).toFixed(1)}%
            </div>
            <div className="text-[10px] text-slate-400">Degraded Detection (Vulnerable)</div>
            <p className="mt-2 text-[9px] text-slate-400 border-t border-rose-500/15 pt-2">
              Cyrillic homoglyphs & zero-width tokens bypass unhardened lexical tokenizers.
            </p>
          </div>

          {/* 3. Hardened PhishGuard-AR */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5">
            <div className="flex items-center justify-between text-[10px] text-emerald-400 uppercase font-bold">
              <span>3. Hardened DistilBERT</span>
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
            <div className="mt-2 text-2xl font-bold text-emerald-400">
              {(hardenedAccuracy * 100).toFixed(1)}%
            </div>
            <div className="text-[10px] text-slate-400">Hardened Adversarial Defense</div>
            <p className="mt-2 text-[9px] text-slate-400 border-t border-emerald-500/15 pt-2">
              Adversarially trained with gradient regularization and Unicode normalization.
            </p>
          </div>
        </div>

        {/* Bottom Educational Summary */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-lg border border-amber-500/20 bg-slate-900/60 p-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-400">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <div className="font-bold text-slate-200 text-xs">
                Phase 6 Robustness Invariance Active
              </div>
              <div className="text-[10px] text-slate-400">
                Evaluating against 10 attack classes (FGSM, Homoglyphs, Zero-Width, Leetspeak)
              </div>
            </div>
          </div>

          <Link
            href="/robustness"
            className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <span>Explore Attack Simulation</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </AIHolographicPanel>
  );
};

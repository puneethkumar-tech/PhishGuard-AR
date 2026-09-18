'use client';

import React from 'react';
import {
  GitBranch,
  Binary,
  Globe2,
  GitMerge,
  ShieldCheck,
  CheckCircle,
  ArrowDown,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';
import { AIHolographicPanel } from './AIHolographicPanel';

export const ModelArchitecturePanel: React.FC = () => {
  return (
    <AIHolographicPanel
      title="Conceptual Dual-Branch Model Architecture"
      subtitle="Hybrid Lexical-Structural & Multilingual Transformer Reasoning Pipeline"
      icon={GitBranch}
      badge="CONCEPTUAL ARCHITECTURE"
      badgeColor="violet"
    >
      <div className="font-mono text-xs">
        {/* Top Input Header */}
        <div className="mb-4 flex flex-col items-center justify-center rounded-lg border border-cyan-500/30 bg-slate-900/60 p-3 text-center">
          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
            RAW INGESTION STREAM (EMAIL / URL / DOM PAYLOAD)
          </span>
          <p className="mt-1 text-slate-300 text-[11px]">
            Payload is simultaneously bifurcated into Lexical N-Gram extraction and Subword Transformer Tokenization.
          </p>
        </div>

        {/* Dual Branches Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Branch A: Lexical & Structural Engine */}
          <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-4">
            <div className="flex items-center gap-2 border-b border-blue-500/20 pb-2 text-blue-400 font-bold uppercase text-[11px]">
              <Binary className="h-4 w-4" />
              <span>Branch A: Lexical & Structural SVM</span>
            </div>

            <div className="mt-3 space-y-2">
              <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-2">
                <span className="text-[10px] text-slate-400 uppercase">Step A.1</span>
                <div className="font-bold text-slate-200">Character & Word TF-IDF Vectors</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  10,000-dimensional sparse vocabulary with subword n-gram frequency scaling.
                </div>
              </div>

              <div className="flex justify-center text-blue-400">
                <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-2">
                <span className="text-[10px] text-slate-400 uppercase">Step A.2</span>
                <div className="font-bold text-slate-200">URL Entropy & DOM Heuristics</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Shannon bit entropy, redirect hop depth, and WHOIS domain age delta vectors.
                </div>
              </div>

              <div className="flex justify-center text-blue-400">
                <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
              </div>

              <div className="rounded-lg border border-blue-500/40 bg-blue-900/30 p-2">
                <span className="text-[10px] text-blue-400 uppercase">Output A</span>
                <div className="font-bold text-blue-200">Linear SVM Decision Boundary</div>
                <div className="text-[10px] text-blue-300 mt-0.5">
                  Simulated Malicious Score: <span className="font-bold text-white">94.2%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Branch B: Multilingual Transformer */}
          <div className="rounded-xl border border-pink-500/30 bg-pink-950/20 p-4">
            <div className="flex items-center gap-2 border-b border-pink-500/20 pb-2 text-pink-400 font-bold uppercase text-[11px]">
              <Globe2 className="h-4 w-4" />
              <span>Branch B: Multilingual DistilBERT AR</span>
            </div>

            <div className="mt-3 space-y-2">
              <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-2">
                <span className="text-[10px] text-slate-400 uppercase">Step B.1</span>
                <div className="font-bold text-slate-200">WordPiece Subword Tokenizer</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Universal multilingual dictionary with zero-width character stripping.
                </div>
              </div>

              <div className="flex justify-center text-pink-400">
                <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-2">
                <span className="text-[10px] text-slate-400 uppercase">Step B.2</span>
                <div className="font-bold text-slate-200">12-Head Self-Attention Pooling</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Contextual semantic embedding projection across 100+ language spaces.
                </div>
              </div>

              <div className="flex justify-center text-pink-400">
                <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
              </div>

              <div className="rounded-lg border border-pink-500/40 bg-pink-900/30 p-2">
                <span className="text-[10px] text-pink-400 uppercase">Output B</span>
                <div className="font-bold text-pink-200">Semantic Intent Vector</div>
                <div className="text-[10px] text-pink-300 mt-0.5">
                  Simulated Malicious Score: <span className="font-bold text-white">96.1%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Convergence: Signal Fusion & Robustness */}
        <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-[11px]">
              <GitMerge className="h-4 w-4" />
              <span>Multi-Modal Bayesian Signal Fusion Core</span>
            </div>
            <span className="rounded bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[9px] text-emerald-300 font-bold uppercase">
              Cross-Model Concordance
            </span>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2.5">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-[10px] uppercase">
                <ShieldCheck className="h-3.5 w-3.5" /> Adversarial Robustness Engine
              </div>
              <p className="mt-1 text-[10px] text-slate-300 leading-relaxed">
                Gradient-bounded invariance validation defends against Unicode homoglyphs, whitespace injections, and synonym attacks.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2.5">
              <div className="flex items-center gap-1.5 text-rose-400 font-semibold text-[10px] uppercase">
                <Sparkles className="h-3.5 w-3.5" /> Calibrated Verdict
              </div>
              <p className="mt-1 text-[10px] text-slate-300 leading-relaxed">
                Outputs deterministic threat classification, confidence bounds, and automated remediation guidance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AIHolographicPanel>
  );
};

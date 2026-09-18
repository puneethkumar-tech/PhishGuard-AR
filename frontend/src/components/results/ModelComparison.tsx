'use client';

import React from 'react';
import { Cpu, Terminal, ArrowRight, ShieldCheck, Sparkles, Layers } from 'lucide-react';

interface ModelComparisonProps {
  confidenceInterpretation: string;
}

export const ModelComparison: React.FC<ModelComparisonProps> = ({
  confidenceInterpretation,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/70">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-primary-bright" />
          <h4 className="text-xs font-mono uppercase font-bold text-text">
            Dual AI Model Comparative Architecture
          </h4>
        </div>
        <span className="text-[10px] font-mono text-cyber-cyan">ENSEMBLE FUSION</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Model 01: Statistical N-Gram */}
        <div className="p-4 rounded-2xl bg-surface/80 border border-cyber-cyan/30 space-y-3 shadow-glass">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-cyber-cyan uppercase">
              MODEL 01 • STATISTICAL CLASSIFIER
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-surface-3 text-text-muted">
              ~2.4ms Latency
            </span>
          </div>

          <div>
            <h5 className="text-sm font-bold text-text">TF-IDF + Linear SVM</h5>
            <p className="text-xs text-text-muted mt-1 leading-relaxed font-sans">
              High-throughput n-gram frequency extraction capturing raw lexical keywords, suspicious protocol schemes, and anomalous formatting tokens.
            </p>
          </div>

          <div className="space-y-1 pt-2 border-t border-border/60 text-[11px] font-mono">
            <div className="flex justify-between text-text-muted">
              <span>Feature Focus:</span>
              <span className="text-text font-bold">Lexical & Structural Patterns</span>
            </div>
            <div className="flex justify-between text-text-muted">
              <span>Strengths:</span>
              <span className="text-cyber-cyan font-bold">Sub-millisecond Pre-filter</span>
            </div>
          </div>
        </div>

        {/* Model 02: Contextual Transformer */}
        <div className="p-4 rounded-2xl bg-surface/80 border border-primary-bright/30 space-y-3 shadow-glass">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-primary-bright uppercase">
              MODEL 02 • TRANSFORMER NLP
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-surface-3 text-text-muted">
              104 Languages
            </span>
          </div>

          <div>
            <h5 className="text-sm font-bold text-text">Multilingual DistilBERT</h5>
            <p className="text-xs text-text-muted mt-1 leading-relaxed font-sans">
              Bidirectional self-attention layers model semantic relationship between tokens, detecting psychological urgency, CEO fraud, and intent nuance.
            </p>
          </div>

          <div className="space-y-1 pt-2 border-t border-border/60 text-[11px] font-mono">
            <div className="flex justify-between text-text-muted">
              <span>Feature Focus:</span>
              <span className="text-text font-bold">Contextual Coercion Semantics</span>
            </div>
            <div className="flex justify-between text-text-muted">
              <span>Strengths:</span>
              <span className="text-primary-bright font-bold">Adversarial Resistance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ensemble Fusion & Decision Engine Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-surface-2 via-primary/15 to-surface-2 border border-primary-bright/40 space-y-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyber-success" />
          <h5 className="text-xs font-mono font-bold uppercase text-text">
            AR Decision Engine • Robustness Fusion
          </h5>
        </div>

        <p className="text-xs text-text-muted leading-relaxed font-sans">
          {confidenceInterpretation}
        </p>
      </div>
    </div>
  );
};

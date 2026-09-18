'use client';

import React from 'react';
import { Cpu, Terminal, ArrowRight, ShieldAlert, Sparkles, Layers } from 'lucide-react';

export const ScanDualPipelineVisual: React.FC = () => {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-surface-2/60 border border-border/70 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary-bright" />
          <h4 className="text-xs font-mono uppercase font-bold text-text">
            Dual AI Pipeline Architecture (Simulated)
          </h4>
        </div>
        <span className="text-[9px] font-mono text-cyber-cyan bg-cyber-cyan/15 px-2 py-0.5 rounded border border-cyber-cyan/30">
          TF-IDF + DistilBERT
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center">
        {/* Step 1: Inbound Input */}
        <div className="p-2.5 rounded-xl bg-surface border border-border flex-1 w-full text-left">
          <span className="text-[9px] font-mono text-text-muted block">INPUT SIGNAL</span>
          <p className="text-xs font-bold text-text truncate">Inbound Token Stream</p>
          <span className="text-[9px] text-text-muted font-mono">RFC 822 / Text / URL</span>
        </div>

        <ArrowRight className="w-4 h-4 text-text-muted/50 hidden md:block" />

        {/* Step 2: Dual Ensembles */}
        <div className="flex flex-col gap-1.5 flex-1 w-full">
          <div className="p-2 rounded-lg bg-surface border border-cyber-cyan/40 text-left flex items-center justify-between">
            <div>
              <span className="text-[8px] font-mono text-cyber-cyan uppercase font-bold block">Statistical Classifier</span>
              <span className="text-xs font-bold text-text">TF-IDF + Linear SVM</span>
            </div>
            <span className="text-[9px] font-mono text-text-muted">~2.4ms</span>
          </div>

          <div className="p-2 rounded-lg bg-surface border border-primary-bright/40 text-left flex items-center justify-between">
            <div>
              <span className="text-[8px] font-mono text-primary-bright uppercase font-bold block">Transformer NLP</span>
              <span className="text-xs font-bold text-text">Multilingual DistilBERT</span>
            </div>
            <span className="text-[9px] font-mono text-text-muted">104 Lang</span>
          </div>
        </div>

        <ArrowRight className="w-4 h-4 text-text-muted/50 hidden md:block" />

        {/* Step 3: AR Decision Engine */}
        <div className="p-2.5 rounded-xl bg-primary/20 border border-primary-bright/40 flex-1 w-full text-left shadow-glass">
          <span className="text-[9px] font-mono text-primary-bright uppercase font-bold block">Robustness Defense</span>
          <p className="text-xs font-bold text-white truncate">AR Decision Engine</p>
          <span className="text-[9px] text-text-muted font-mono">NFKC Normalization</span>
        </div>

        <ArrowRight className="w-4 h-4 text-text-muted/50 hidden md:block" />

        {/* Step 4: Calibrated Threat Output */}
        <div className="p-2.5 rounded-xl bg-surface border border-border flex-1 w-full text-left">
          <span className="text-[9px] font-mono text-cyber-success uppercase font-bold block">Output Verdict</span>
          <p className="text-xs font-bold text-text truncate">Calibrated Assessment</p>
          <span className="text-[9px] text-text-muted font-mono">XAI Evidence Dossier</span>
        </div>
      </div>
    </div>
  );
};

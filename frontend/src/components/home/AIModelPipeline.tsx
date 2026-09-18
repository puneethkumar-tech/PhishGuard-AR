'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Cpu, Network, ShieldCheck, ArrowDown, Sparkles, Layers } from 'lucide-react';

export const AIModelPipeline: React.FC = () => {
  return (
    <GlassCard className="p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-cyber-cyan uppercase tracking-wider">
              Architecture Blueprint
            </span>
            <Badge variant="demo" size="sm">
              PHASE 1 VISUAL ONLY
            </Badge>
          </div>
          <h3 className="text-xl font-bold text-text">
            Dual AI Model & Robustness Pipeline
          </h3>
        </div>
        <p className="text-xs text-text-muted max-w-xs sm:text-right">
          Complementary feature extraction paired with contextual neural embeddings
        </p>
      </div>

      {/* Interactive Pipeline Diagram */}
      <div className="relative">
        {/* Top Input Node */}
        <div className="flex justify-center mb-6">
          <div className="px-5 py-2.5 rounded-xl bg-surface-2 border border-primary-bright/40 shadow-glass flex items-center gap-2.5 text-xs font-mono text-text">
            <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
            <span className="font-bold">SUSPICIOUS INPUT STREAM</span>
            <span className="text-text-muted">(Text / Headers / URLs)</span>
          </div>
        </div>

        {/* Dual Branch Connectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {/* Branch 1: TF-IDF + Linear SVM */}
          <div className="relative p-5 rounded-2xl bg-gradient-to-br from-surface-2 to-surface-3/50 border border-border hover:border-primary-bright/50 transition-all shadow-glass">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-primary/20 border border-primary-bright/30 text-primary-bright">
                <Layers className="w-5 h-5" />
              </div>
              <Badge variant="primary" size="sm">
                Statistical Baseline
              </Badge>
            </div>
            <h4 className="text-base font-bold text-text mb-1">TF-IDF + Linear SVM</h4>
            <p className="text-xs text-text-muted leading-relaxed mb-3">
              High-speed n-gram token frequency vectorization, keyword density weighting, and linear hyperplane classification.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-text-muted/80 bg-surface/60 p-2 rounded-lg border border-border/50">
              <span className="text-cyber-cyan">Latency:</span> ~2.4ms
              <span className="mx-1">•</span>
              <span className="text-primary-bright">Weight:</span> 0.35 Ensemble
            </div>
          </div>

          {/* Branch 2: Multilingual DistilBERT */}
          <div className="relative p-5 rounded-2xl bg-gradient-to-br from-surface-2 to-surface-3/50 border border-border hover:border-cyber-violet/50 transition-all shadow-glass">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-cyber-violet/20 border border-cyber-violet/30 text-purple-300">
                <Cpu className="w-5 h-5" />
              </div>
              <Badge variant="violet" size="sm">
                Contextual Transformer
              </Badge>
            </div>
            <h4 className="text-base font-bold text-text mb-1">Multilingual DistilBERT</h4>
            <p className="text-xs text-text-muted leading-relaxed mb-3">
              Deep bidirectional self-attention capturing subtle semantic phrasing, deceptive urgent intents, and multilingual evasion.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-text-muted/80 bg-surface/60 p-2 rounded-lg border border-border/50">
              <span className="text-purple-400">Context:</span> 512 Tokens
              <span className="mx-1">•</span>
              <span className="text-cyber-cyan">Weight:</span> 0.65 Ensemble
            </div>
          </div>
        </div>

        {/* Converging Downward Arrow */}
        <div className="flex justify-center my-4">
          <div className="p-2 rounded-full bg-surface-2 border border-border text-cyber-cyan animate-bounce">
            <ArrowDown className="w-4 h-4" />
          </div>
        </div>

        {/* Bottom AI Decision Engine Node */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-surface-2 via-primary/10 to-surface-2 border border-cyber-cyan/40 shadow-cyan-glow">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-cyber-cyan text-white shadow-glass-glow">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-text">
                    AR ROBUSTNESS & DECISION ENGINE
                  </h4>
                  <Badge variant="cyan" size="sm" dot>
                    Active Guard
                  </Badge>
                </div>
                <p className="text-xs text-text-muted mt-0.5">
                  Adversarially calibrated decision threshold, confidence weighting & explainability highlights.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-text-muted bg-surface/80 px-3 py-2 rounded-xl border border-border">
              <Sparkles className="w-3.5 h-3.5 text-cyber-cyan" />
              <span>Hardened Defense Active</span>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { RobustnessDiffToken } from '@/types';
import { FileCode, Sparkles, HelpCircle, Eye, Info } from 'lucide-react';

interface PerturbationDiffViewerProps {
  originalText: string;
  perturbedText: string;
  diffTokens: RobustnessDiffToken[];
  attackType: string;
}

export const PerturbationDiffViewer: React.FC<PerturbationDiffViewerProps> = ({
  originalText,
  perturbedText,
  diffTokens,
  attackType,
}) => {
  const [selectedToken, setSelectedToken] = useState<RobustnessDiffToken | null>(
    diffTokens.find((t) => t.isModified) || null
  );

  const modifiedCount = diffTokens.filter((t) => t.isModified).length;

  return (
    <GlassCard className="p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyber-violet/20 text-purple-300">
            <FileCode className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text uppercase tracking-wider font-mono">
              Adversarial Perturbation Diff Viewer
            </h3>
            <p className="text-[11px] text-text-muted">
              Side-by-side inspection of injected lexical, Unicode, or structural permutations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="danger" size="sm">
            {modifiedCount} MUTATIONS INJECTED
          </Badge>
          <span className="text-[10px] font-mono text-purple-300 bg-cyber-violet/20 px-2 py-0.5 rounded border border-cyber-violet/40">
            SIMULATED DIFF
          </span>
        </div>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Original Clean Payload */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-text font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary-bright" />
              Original Baseline Payload
            </span>
            <span className="text-[10px] text-text-muted">Clean ASCII / UTF-8</span>
          </div>

          <div className="p-4 rounded-xl bg-surface-2/90 border border-border min-h-[120px] text-xs font-mono text-text leading-relaxed select-all">
            {originalText}
          </div>
        </div>

        {/* Perturbed Adversarial Payload with Highlights */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyber-danger font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyber-danger animate-pulse" />
              Perturbed Payload (Under Attack)
            </span>
            <span className="text-[10px] text-cyber-danger">Click highlighted tokens</span>
          </div>

          <div className="p-4 rounded-xl bg-surface-2/90 border border-cyber-danger/40 min-h-[120px] text-xs font-mono leading-relaxed break-words">
            {diffTokens.map((token, idx) => {
              if (!token.isModified) {
                return (
                  <span key={idx} className="text-text">
                    {token.text}
                  </span>
                );
              }

              const isSelected = selectedToken === token;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedToken(token)}
                  className={`inline-block px-1 py-0.5 rounded font-bold cursor-pointer transition-all mx-0.5 ${
                    isSelected
                      ? 'bg-cyber-danger text-white shadow-danger-glow ring-2 ring-white/50'
                      : 'bg-cyber-danger/25 text-red-300 border border-cyber-danger/60 hover:bg-cyber-danger/40'
                  }`}
                >
                  {token.text}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Token / Character Inspector Panel */}
      {selectedToken && selectedToken.charInfo && (
        <div className="p-4 rounded-xl bg-surface-3/80 border border-purple-400/30 space-y-2.5">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-purple-300" />
              <span className="text-xs font-mono font-bold text-text uppercase tracking-wider">
                Simulated Perturbation Inspector: {selectedToken.charInfo.note}
              </span>
            </div>
            <Badge variant="violet" size="sm">
              SIMULATED UNICODE CONFUSABLE
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-2 rounded-lg bg-surface-2 border border-border">
              <span className="text-[10px] text-text-muted block">Original Char</span>
              <span className="text-sm font-bold text-text">
                &quot;{selectedToken.charInfo.originalChar}&quot; ({selectedToken.charInfo.originalUnicode})
              </span>
              <span className="text-[9px] text-primary-bright block">
                {selectedToken.charInfo.originalScript}
              </span>
            </div>

            <div className="p-2 rounded-lg bg-cyber-danger/15 border border-cyber-danger/30">
              <span className="text-[10px] text-cyber-danger block">Perturbed Char</span>
              <span className="text-sm font-bold text-red-300">
                &quot;{selectedToken.charInfo.perturbedChar}&quot; ({selectedToken.charInfo.perturbedUnicode})
              </span>
              <span className="text-[9px] text-cyber-danger block">
                {selectedToken.charInfo.perturbedScript}
              </span>
            </div>

            <div className="p-2 rounded-lg bg-surface-2 border border-border sm:col-span-2">
              <span className="text-[10px] text-text-muted block">Adversarial Rationale</span>
              <span className="text-[11px] text-text leading-tight block mt-0.5">
                {selectedToken.charInfo.note}. Deceives standard subword tokenizers while preserving human visual recognition.
              </span>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
};

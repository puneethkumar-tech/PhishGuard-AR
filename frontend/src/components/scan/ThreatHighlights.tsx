'use client';

import React from 'react';
import { ScanEvidenceToken } from '@/types';
import { Sparkles, Info } from 'lucide-react';

interface ThreatHighlightsProps {
  tokens: ScanEvidenceToken[];
  isSafe: boolean;
}

export const ThreatHighlights: React.FC<ThreatHighlightsProps> = ({ tokens, isSafe }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-mono uppercase text-text-muted font-bold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyber-cyan" />
          <span>Analyzed Message & Evidence Highlights</span>
        </h4>
        <span className="text-[10px] font-mono text-cyber-cyan bg-cyber-cyan/10 px-2 py-0.5 rounded border border-cyber-cyan/20">
          FEATURE TOKENS
        </span>
      </div>

      {/* Highlighted text container */}
      <div className="p-4 rounded-xl bg-surface/90 border border-border/80 text-xs text-text leading-relaxed font-sans max-h-48 overflow-y-auto">
        {tokens.map((token, idx) => {
          if (!token.isThreat || isSafe) {
            return <span key={idx}>{token.text}</span>;
          }

          const categoryStyle =
            token.category === 'homoglyph'
              ? 'bg-cyber-violet/25 text-purple-200 border-cyber-violet/50'
              : token.category === 'url'
              ? 'bg-amber-500/20 text-amber-200 border-amber-500/40'
              : token.category === 'payment'
              ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40'
              : 'bg-cyber-danger/25 text-red-200 border-cyber-danger/50';

          return (
            <span
              key={idx}
              title={token.explanation || 'Suspicious threat token signal'}
              className={`inline-block px-1.5 py-0.5 mx-0.5 rounded font-mono font-bold border transition-all hover:scale-105 cursor-help ${categoryStyle}`}
            >
              {token.text}
            </span>
          );
        })}
      </div>

      {/* Explanatory disclaimer */}
      <p className="text-[10px] text-text-muted/80 flex items-center gap-1.5 italic font-sans">
        <Info className="w-3 h-3 text-text-muted flex-shrink-0" />
        <span>
          Highlighted patterns are model evidence signals used for this simulation; they do not independently establish malicious intent.
        </span>
      </p>
    </div>
  );
};

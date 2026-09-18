'use client';

import React, { useState } from 'react';
import { Eye, Sparkles, Tag, Info, AlertCircle } from 'lucide-react';
import { TokenAttentionItem } from '@/types';
import { AIHolographicPanel } from './AIHolographicPanel';

interface AttentionSignalMapProps {
  tokens: TokenAttentionItem[];
  onSelectToken?: (token: TokenAttentionItem) => void;
}

export const AttentionSignalMap: React.FC<AttentionSignalMapProps> = ({
  tokens,
  onSelectToken,
}) => {
  const [selectedToken, setSelectedToken] = useState<TokenAttentionItem | null>(null);

  const getTokenBgColor = (weight: number, isPerturbed: boolean) => {
    if (isPerturbed) {
      return 'bg-purple-500/25 border-purple-400 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.3)]';
    }
    if (weight > 0.8) {
      return 'bg-rose-500/25 border-rose-400 text-rose-200 shadow-[0_0_10px_rgba(244,63,94,0.3)]';
    }
    if (weight > 0.6) {
      return 'bg-amber-500/20 border-amber-400 text-amber-200';
    }
    if (weight > 0.3) {
      return 'bg-cyan-500/15 border-cyan-500/40 text-cyan-200';
    }
    return 'bg-slate-800/40 border-slate-700/50 text-slate-400';
  };

  const handleTokenClick = (item: TokenAttentionItem) => {
    setSelectedToken(item);
    onSelectToken?.(item);
  };

  return (
    <AIHolographicPanel
      title="Simulated Token Signal Map"
      subtitle="Conceptual visualization of token-level importance and self-attention weighting"
      icon={Eye}
      badge="SIMULATED ATTENTION MAP"
      badgeColor="violet"
    >
      <div className="font-mono text-xs">
        {/* Token Highlights Container */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 leading-relaxed">
          <div className="mb-2 text-[10px] uppercase text-slate-400 flex items-center justify-between">
            <span>Payload Stream (Click token to inspect simulated weight)</span>
            <span className="text-cyan-400">WordPiece Subword Tokens</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {tokens.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleTokenClick(item)}
                className={`group relative rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all duration-200 hover:scale-105 ${getTokenBgColor(
                  item.weight,
                  item.isPerturbed
                )} ${selectedToken?.token === item.token ? 'ring-2 ring-cyan-400' : ''}`}
              >
                <span>{item.token}</span>
                <span className="ml-1.5 rounded bg-black/40 px-1 py-0.2 text-[9px] opacity-75 group-hover:opacity-100">
                  {(item.weight * 100).toFixed(0)}%
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Token Inspector */}
        {selectedToken && (
          <div className="mt-4 rounded-xl border border-cyan-500/30 bg-slate-900/80 p-3.5 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-cyan-400" />
                <span className="text-[10px] text-slate-400 uppercase">Selected Token:</span>
                <span className="font-bold text-slate-100 text-sm">&ldquo;{selectedToken.token}&rdquo;</span>
              </div>
              <span className="text-xs font-bold text-cyan-400">
                Simulated Weight: {(selectedToken.weight * 100).toFixed(1)}%
              </span>
            </div>

            <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-3 text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Signal Class</span>
                <span className="font-semibold text-slate-200">{selectedToken.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Perturbation Status</span>
                <span
                  className={`font-semibold ${
                    selectedToken.isPerturbed ? 'text-purple-400' : 'text-emerald-400'
                  }`}
                >
                  {selectedToken.isPerturbed ? 'Adversarially Injected' : 'Standard Ingestion'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Risk Contribution</span>
                <span className="font-semibold text-rose-400">
                  {selectedToken.weight > 0.8
                    ? 'High Malicious Attribution'
                    : selectedToken.weight > 0.5
                    ? 'Moderate Threat Association'
                    : 'Baseline Context'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-3 text-[9px] text-slate-400 text-center">
          ● Conceptual attention visualization for educational demonstration. No live neural transformer inference executed.
        </div>
      </div>
    </AIHolographicPanel>
  );
};

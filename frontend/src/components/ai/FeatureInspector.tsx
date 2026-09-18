'use client';

import React from 'react';
import { Tag, ShieldAlert, Cpu, HelpCircle, CheckCircle2 } from 'lucide-react';
import { TokenAttentionItem } from '@/types';
import { AIHolographicPanel } from './AIHolographicPanel';

interface FeatureInspectorProps {
  tokenItem: TokenAttentionItem | null;
  onClose?: () => void;
}

export const FeatureInspector: React.FC<FeatureInspectorProps> = ({
  tokenItem,
}) => {
  if (!tokenItem) {
    return (
      <AIHolographicPanel
        title="Token & Feature Inspector"
        subtitle="Select a token or node in the visualization to inspect simulated weights"
        icon={Tag}
        badge="STANDBY"
        badgeColor="cyan"
      >
        <div className="flex flex-col items-center justify-center p-6 text-center font-mono text-xs text-slate-400">
          <HelpCircle className="h-8 w-8 text-cyan-500/40 mb-2" />
          <p>No token currently selected.</p>
          <p className="text-[10px] text-slate-400 mt-1">
            Click on any token in the Attention Signal Map to inspect its simulated semantic contribution.
          </p>
        </div>
      </AIHolographicPanel>
    );
  }

  return (
    <AIHolographicPanel
      title="Token & Feature Inspector"
      subtitle="Detailed simulated breakdown of selected payload feature"
      icon={Tag}
      badge="SIMULATED FEATURE"
      badgeColor="violet"
    >
      <div className="font-mono text-xs space-y-3">
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
          <div>
            <span className="text-[10px] text-slate-400 uppercase">Token Literal</span>
            <div className="text-base font-bold text-slate-100">&ldquo;{tokenItem.token}&rdquo;</div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase">Simulated Weight</span>
            <div className="text-base font-bold text-cyan-400">
              {(tokenItem.weight * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2">
            <span className="text-[9px] text-slate-400 uppercase">Signal Class</span>
            <div className="font-semibold text-slate-200">{tokenItem.category}</div>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2">
            <span className="text-[9px] text-slate-400 uppercase">Adversarial Flag</span>
            <div className="font-semibold text-slate-200">
              {tokenItem.isPerturbed ? 'Perturbed Token' : 'Authentic Token'}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-2.5 text-[10px] text-slate-300 leading-relaxed">
          <strong>Conceptual Role:</strong> Simulated signal associated with {tokenItem.category.toLowerCase()}. Contributes to the overall threat vector during Bayesian multi-signal fusion.
        </div>
      </div>
    </AIHolographicPanel>
  );
};

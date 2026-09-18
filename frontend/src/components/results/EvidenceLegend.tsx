'use client';

import React from 'react';
import { EvidenceCategory } from '@/types';
import { Sparkles } from 'lucide-react';

interface EvidenceLegendProps {
  activeCategory: EvidenceCategory | 'ALL';
  onSelectCategory: (cat: EvidenceCategory | 'ALL') => void;
}

const CATEGORIES: Array<{ id: EvidenceCategory | 'ALL'; label: string; color: string; border: string }> = [
  { id: 'ALL', label: 'All Signals', color: 'bg-surface-3 text-text', border: 'border-border' },
  { id: 'urgency', label: 'Urgency & Pressure', color: 'bg-cyber-danger/20 text-red-300', border: 'border-cyber-danger/50' },
  { id: 'credential', label: 'Credential Request', color: 'bg-amber-500/20 text-amber-300', border: 'border-amber-500/50' },
  { id: 'url', label: 'Deceptive URL', color: 'bg-cyber-cyan/20 text-cyan-300', border: 'border-cyber-cyan/50' },
  { id: 'payment', label: 'Payment / Wire Fraud', color: 'bg-emerald-500/20 text-emerald-300', border: 'border-emerald-500/50' },
  { id: 'impersonation', label: 'Brand Impersonation', color: 'bg-primary/25 text-primary-bright', border: 'border-primary-bright/50' },
  { id: 'homoglyph', label: 'Adversarial Homoglyph', color: 'bg-cyber-violet/25 text-purple-300', border: 'border-cyber-violet/50' },
];

export const EvidenceLegend: React.FC<EvidenceLegendProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 pt-2">
      <span className="text-[11px] font-mono text-text-muted flex items-center gap-1.5 mr-1">
        <Sparkles className="w-3.5 h-3.5 text-cyber-cyan" />
        <span>Filter Evidence:</span>
      </span>

      {CATEGORIES.map((cat) => {
        const isSelected = activeCategory === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(isSelected && cat.id !== 'ALL' ? 'ALL' : cat.id)}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-medium border transition-all ${
              isSelected
                ? `${cat.color} ${cat.border} ring-2 ring-cyber-cyan/30 shadow-glass`
                : 'bg-surface-2/80 text-text-muted hover:text-text border-border hover:bg-surface-3'
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
};

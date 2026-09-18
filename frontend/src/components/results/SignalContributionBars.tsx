'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ModelSignalContribution } from '@/types';
import { Layers, Info } from 'lucide-react';

interface SignalContributionBarsProps {
  contributions: ModelSignalContribution[];
}

export const SignalContributionBars: React.FC<SignalContributionBarsProps> = ({ contributions }) => {
  const [hoveredSignal, setHoveredSignal] = useState<ModelSignalContribution | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/70">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyber-cyan" />
          <h4 className="text-xs font-mono uppercase font-bold text-text">
            Simulated Feature Contribution Analysis
          </h4>
        </div>
        <span className="text-[10px] font-mono text-text-muted">MODEL EXPLAINABILITY (DEMO)</span>
      </div>

      <div className="space-y-3">
        {contributions.map((item, idx) => {
          const isHovered = hoveredSignal?.id === item.id;

          const barColor =
            item.contributionLevel === 'HIGH'
              ? 'bg-gradient-to-r from-cyber-danger to-red-400'
              : item.contributionLevel === 'MEDIUM'
              ? 'bg-gradient-to-r from-amber-500 to-amber-300'
              : 'bg-gradient-to-r from-cyber-cyan to-primary-bright';

          return (
            <div
              key={item.id || idx}
              onMouseEnter={() => setHoveredSignal(item)}
              onMouseLeave={() => setHoveredSignal(null)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                isHovered
                  ? 'bg-surface-2 border-cyber-cyan/50 shadow-glass'
                  : 'bg-surface/70 border-border/60 hover:bg-surface-2/60'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-text">{item.name}</span>
                  <span className="text-[9px] text-text-muted uppercase">({item.category})</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] uppercase font-bold border ${
                      item.contributionLevel === 'HIGH'
                        ? 'bg-cyber-danger/15 text-cyber-danger border-cyber-danger/30'
                        : item.contributionLevel === 'MEDIUM'
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : 'bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan/30'
                    }`}
                  >
                    {item.contributionLevel}
                  </span>
                  <span className="font-bold text-text">{item.weight}%</span>
                </div>
              </div>

              {/* Progress Track */}
              <div className="w-full bg-surface-3 h-2 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.weight}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
                  className={`h-full rounded-full ${barColor}`}
                />
              </div>

              {/* Inline Description on Hover or always */}
              <p className="text-[10px] text-text-muted mt-1.5 font-sans leading-tight">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] font-mono text-text-muted/80 flex items-center gap-1.5 italic">
        <Info className="w-3 h-3 text-text-muted flex-shrink-0" />
        <span>
          Simulated feature weights illustrate relative NLP signal contributions in this frontend demonstration.
        </span>
      </p>
    </div>
  );
};

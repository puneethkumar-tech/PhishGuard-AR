'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AIExplanationPoint } from '@/types';
import { ShieldQuestion, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';

interface AIExplanationCardsProps {
  explanations: AIExplanationPoint[];
}

export const AIExplanationCards: React.FC<AIExplanationCardsProps> = ({ explanations }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-mono uppercase text-text-muted font-bold flex items-center gap-1.5">
          <ShieldQuestion className="w-3.5 h-3.5 text-primary-bright" />
          <span>Why PhishGuard AI Flagged This (Simulated AI Explanation)</span>
        </h4>
        <span className="text-[10px] font-mono text-text-muted">
          XAI REASONING
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {explanations.map((item, idx) => {
          const isHigh = item.severity === 'high';
          const isLow = item.severity === 'low';

          return (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.08 }}
              className="p-3.5 rounded-xl bg-surface/80 border border-border/80 hover:border-primary-bright/40 transition-all flex flex-col justify-between space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {isLow ? (
                    <CheckCircle2 className="w-4 h-4 text-cyber-success flex-shrink-0" />
                  ) : (
                    <AlertTriangle className={`w-4 h-4 flex-shrink-0 ${isHigh ? 'text-cyber-danger' : 'text-cyber-warning'}`} />
                  )}
                  <h5 className="text-xs font-bold text-text truncate">{item.title}</h5>
                </div>

                <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono uppercase font-bold border ${
                  isHigh
                    ? 'bg-cyber-danger/15 text-cyber-danger border-cyber-danger/30'
                    : isLow
                    ? 'bg-cyber-success/15 text-cyber-success border-cyber-success/30'
                    : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                }`}>
                  {item.category}
                </span>
              </div>

              <p className="text-[11px] text-text-muted leading-relaxed font-sans">
                {item.explanation}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIExplanationPoint } from '@/types';
import { Sparkles, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, ShieldQuestion } from 'lucide-react';

interface ExplanationTimelineProps {
  explanations: AIExplanationPoint[];
}

export const ExplanationTimeline: React.FC<ExplanationTimelineProps> = ({ explanations }) => {
  const [selectedStep, setSelectedStep] = useState<string>(explanations[0]?.id || 'e1');

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/70">
        <div className="flex items-center gap-2">
          <ShieldQuestion className="w-4 h-4 text-cyber-cyan" />
          <h4 className="text-xs font-mono uppercase font-bold text-text">
            Why PhishGuard-AR Flagged This (Simulated AI Reasoning)
          </h4>
        </div>
        <span className="text-[10px] font-mono text-text-muted">XAI SEQUENCE</span>
      </div>

      {/* Step Indicator Nodes Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {explanations.map((step, idx) => {
          const isSelected = selectedStep === step.id;

          return (
            <button
              key={step.id || idx}
              onClick={() => setSelectedStep(step.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold border transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-primary text-white border-cyber-cyan shadow-glass-glow'
                  : 'bg-surface-2 text-text-muted hover:text-text hover:bg-surface-3 border-border'
              }`}
            >
              <span>{step.stepNumber || `0${idx + 1}`}</span>
              <span>{step.title}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Step Detail Card */}
      <div className="space-y-3">
        {explanations.map((item) => {
          if (item.id !== selectedStep) return null;

          const isHigh = item.severity === 'high';
          const isLow = item.severity === 'low';

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-5 rounded-2xl bg-surface/90 border border-cyber-cyan/30 space-y-4 shadow-glass"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl font-extrabold font-mono text-cyber-cyan">
                    {item.stepNumber}
                  </span>
                  <div>
                    <h5 className="text-sm font-bold text-text">{item.title}</h5>
                    <span className="text-[10px] font-mono text-text-muted uppercase">
                      Category: {item.category}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${
                    isHigh
                      ? 'bg-cyber-danger/15 text-cyber-danger border-cyber-danger/30'
                      : isLow
                      ? 'bg-cyber-success/15 text-cyber-success border-cyber-success/30'
                      : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {item.severity} SEVERITY
                </span>
              </div>

              <div className="space-y-2 text-xs font-sans">
                <p className="text-text leading-relaxed bg-surface-2/60 p-3.5 rounded-xl border border-border/70">
                  {item.explanation}
                </p>

                {item.whyItMatters && (
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary-bright/20 text-text-muted space-y-1">
                    <span className="text-[10px] font-mono text-primary-bright uppercase font-bold block">
                      Why This Signal Matters:
                    </span>
                    <p className="text-[11px] leading-relaxed text-text">
                      {item.whyItMatters}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Cpu, Terminal, ShieldAlert, Sparkles, ShieldCheck } from 'lucide-react';

export interface PipelineStageInfo {
  id: string;
  name: string;
  desc: string;
  icon: React.ElementType;
}

export const SCAN_PIPELINE_STAGES: PipelineStageInfo[] = [
  { id: 'ingest', name: 'INGESTING', desc: 'Sanitizing byte stream & character tokens', icon: Terminal },
  { id: 'extract', name: 'EXTRACTING SIGNALS', desc: 'Homoglyph & URL lexical normalization', icon: Sparkles },
  { id: 'analyze', name: 'NEURAL ANALYZING', desc: 'DistilBERT attention & TF-IDF hyperplane pass', icon: Cpu },
  { id: 'evaluate', name: 'THREAT ASSESSMENT', desc: 'Ensemble confidence & adversarial calibrate', icon: ShieldAlert },
  { id: 'explain', name: 'EXPLANATION & PROTECT', desc: 'Generating IoC signals & defense protocol', icon: ShieldCheck },
];

interface ScanPipelineProgressProps {
  currentStageIndex: number;
}

export const ScanPipelineProgress: React.FC<ScanPipelineProgressProps> = ({
  currentStageIndex,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-mono text-cyber-cyan">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-ping" />
          <span>DUAL AI PIPELINE ACTIVE</span>
        </span>
        <span>
          Stage {Math.min(currentStageIndex + 1, SCAN_PIPELINE_STAGES.length)} of {SCAN_PIPELINE_STAGES.length}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
        {SCAN_PIPELINE_STAGES.map((stage, idx) => {
          const isCompleted = idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex;
          const Icon = stage.icon;

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              className={`p-3 rounded-xl border transition-all duration-300 relative overflow-hidden ${
                isCurrent
                  ? 'bg-primary/25 border-cyber-cyan shadow-cyan-glow'
                  : isCompleted
                  ? 'bg-surface-2/90 border-cyber-success/50'
                  : 'bg-surface-2/40 border-border/40 opacity-40'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-bold text-text-muted">
                  0{idx + 1}
                </span>
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyber-success" />
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-border" />
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isCurrent ? 'text-cyber-cyan' : isCompleted ? 'text-cyber-success' : 'text-text-muted'}`} />
                <p className="text-[11px] font-bold text-text truncate">{stage.name}</p>
              </div>

              <p className="text-[9px] text-text-muted truncate mt-1">
                {stage.desc}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

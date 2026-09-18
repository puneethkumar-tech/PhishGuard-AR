'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import {
  FileText,
  Cpu,
  Zap,
  Activity,
  ShieldAlert,
  ShieldCheck,
  Award,
  ArrowRight,
  Info,
} from 'lucide-react';

interface AttackChainVisualizationProps {
  attackType: string;
  defenseType: string;
}

const PIPELINE_NODES = [
  {
    id: 'input',
    label: 'Input Ingest',
    icon: FileText,
    summary: 'Payload Ingestion',
    detail: 'Raw text characters parsed into UTF-8 codepoints and BPE subword sequences.',
    color: 'text-primary-bright',
    bg: 'bg-primary/20',
  },
  {
    id: 'features',
    label: 'Feature Extraction',
    icon: Cpu,
    summary: 'Vector Profiling',
    detail: 'Extracts lexical n-grams, URL syntactical structures, and attention token embeddings.',
    color: 'text-cyber-cyan',
    bg: 'bg-cyber-cyan/20',
  },
  {
    id: 'perturb',
    label: 'Perturbation',
    icon: Zap,
    summary: 'Adversary Injection',
    detail: 'Applies simulated homoglyph swaps, URL punctures, or semantic synonym replacements.',
    color: 'text-cyber-danger',
    bg: 'bg-cyber-danger/20',
  },
  {
    id: 'response',
    label: 'Model Response',
    icon: Activity,
    summary: 'Classifier Output',
    detail: 'Vulnerable standard classifier evaluates perturbed token distribution, exhibiting confidence drop.',
    color: 'text-cyber-warning',
    bg: 'bg-cyber-warning/20',
  },
  {
    id: 'check',
    label: 'Robustness Check',
    icon: ShieldAlert,
    summary: 'Resilience Audit',
    detail: 'Computes stability margin, confidence retention score, and signal divergence metrics.',
    color: 'text-purple-300',
    bg: 'bg-cyber-violet/20',
  },
  {
    id: 'defense',
    label: 'Defense Simulation',
    icon: ShieldCheck,
    summary: 'AR Transformation',
    detail: 'Applies Unicode NFKC normalization, Punycode resolution, and attention re-alignment.',
    color: 'text-cyber-success',
    bg: 'bg-cyber-success/20',
  },
  {
    id: 'verdict',
    label: 'Final Assessment',
    icon: Award,
    summary: 'Hardened Score',
    detail: 'Confirms recovered confidence and generates final adversarial resilience rating.',
    color: 'text-cyber-success',
    bg: 'bg-cyber-success/20',
  },
];

export const AttackChainVisualization: React.FC<AttackChainVisualizationProps> = ({
  attackType,
  defenseType,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('perturb');

  const activeNode = PIPELINE_NODES.find((n) => n.id === selectedNodeId) || PIPELINE_NODES[2];

  return (
    <GlassCard className="p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyber-cyan/20 text-cyber-cyan">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text uppercase tracking-wider font-mono">
              Adversarial Attack & Defense Pipeline Chain
            </h3>
            <p className="text-[11px] text-text-muted">
              Interactive visual pipeline tracing data flow from raw input to hardened verification.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-cyber-cyan bg-cyber-cyan/15 px-2 py-0.5 rounded border border-cyber-cyan/30">
          CLICK NODE FOR DETAILS
        </span>
      </div>

      {/* Interactive Horizontal Pipeline Nodes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-1">
        {PIPELINE_NODES.map((node, idx) => {
          const isSelected = selectedNodeId === node.id;
          const Icon = node.icon;

          return (
            <button
              key={node.id}
              type="button"
              onClick={() => setSelectedNodeId(node.id)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[90px] relative group ${
                isSelected
                  ? 'bg-surface-3/90 border-cyber-cyan/80 shadow-cyan-glow/40 ring-1 ring-cyber-cyan/50'
                  : 'bg-surface-2/60 hover:bg-surface-2/90 border-border text-text-muted hover:text-text'
              }`}
            >
              {/* Pulse line indicator */}
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-[9px] font-mono font-bold text-text-muted">
                  0{idx + 1}
                </span>
                <div className={`p-1.5 rounded-lg ${node.bg} ${node.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-text block leading-tight font-mono">
                  {node.label}
                </span>
                <span className="text-[9px] text-text-muted block mt-0.5">
                  {node.summary}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Node Details Box */}
      {activeNode && (
        <div className="p-4 rounded-xl bg-surface-3/80 border border-cyber-cyan/30 flex items-start gap-3">
          <div className={`p-2 rounded-xl ${activeNode.bg} ${activeNode.color} shrink-0 mt-0.5`}>
            <activeNode.icon className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-text uppercase">
                {activeNode.label} Stage Details
              </span>
              <span className="text-[10px] font-mono text-cyber-cyan">
                [{activeNode.summary}]
              </span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed font-sans">
              {activeNode.detail}
            </p>
          </div>
        </div>
      )}
    </GlassCard>
  );
};

'use client';

import React from 'react';
import { X, Activity, Layers, Zap, Info, ShieldCheck, Tag } from 'lucide-react';
import { NeuralNodeData } from '@/types';

interface NeuralNodeInspectorProps {
  node: NeuralNodeData | null;
  onClose: () => void;
}

export const NeuralNodeInspector: React.FC<NeuralNodeInspectorProps> = ({
  node,
  onClose,
}) => {
  if (!node) return null;

  const getContributionColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'Medium':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Low':
      default:
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-cyan-500/30 bg-slate-950/90 p-4 font-mono shadow-[0_0_25px_rgba(6,182,212,0.15)] backdrop-blur-md">
      {/* Corner cyber brackets */}
      <div className="pointer-events-none absolute -top-px -left-px h-2.5 w-2.5 border-t-2 border-l-2 border-cyan-400" />
      <div className="pointer-events-none absolute -top-px -right-px h-2.5 w-2.5 border-t-2 border-r-2 border-cyan-400" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
        <div className="flex items-center gap-2">
          <div
            className="flex h-6 w-6 items-center justify-center rounded border"
            style={{ borderColor: node.color, backgroundColor: `${node.color}20`, color: node.color }}
          >
            <Activity className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Node Inspector</div>
            <h4 className="text-sm font-bold text-slate-100">{node.name}</h4>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 text-slate-400 hover:bg-slate-900 hover:text-slate-100 transition-colors"
          title="Close Inspector"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Grid of Attributes */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2">
          <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase">
            <Layers className="h-3 w-3 text-cyan-400" /> Conceptual Layer
          </div>
          <div className="mt-0.5 truncate font-semibold text-slate-200">{node.layerName}</div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2">
          <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase">
            <Zap className="h-3 w-3 text-cyan-400" /> Simulated Activation
          </div>
          <div className="mt-0.5 font-bold text-cyan-400">
            {(node.simulatedActivation * 100).toFixed(0)}%
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2">
          <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase">
            <Tag className="h-3 w-3 text-cyan-400" /> Signal Class
          </div>
          <div className="mt-0.5 truncate font-semibold text-slate-200">{node.signalType}</div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2">
          <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase">
            <ShieldCheck className="h-3 w-3 text-cyan-400" /> Contribution
          </div>
          <div className="mt-0.5">
            <span
              className={`inline-block rounded border px-1.5 py-0.2 text-[10px] font-bold uppercase ${getContributionColor(
                node.contributionLevel
              )}`}
            >
              {node.contributionLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Role and Description */}
      <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900/40 p-2.5 text-xs text-slate-300">
        <div className="flex items-center gap-1 text-[10px] font-semibold text-cyan-400 uppercase">
          <Info className="h-3 w-3" /> Description & Conceptual Role
        </div>
        <p className="mt-1 leading-relaxed text-slate-300">{node.description}</p>
      </div>

      {/* Related Signals */}
      {node.relatedSignals && node.relatedSignals.length > 0 && (
        <div className="mt-3">
          <div className="text-[10px] font-semibold text-slate-400 uppercase">
            Related Conceptual Signals
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {node.relatedSignals.map((sig, idx) => (
              <span
                key={idx}
                className="rounded border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-300"
              >
                {sig}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer Disclaimer */}
      <div className="mt-3 border-t border-slate-800/80 pt-2 text-[9px] text-slate-400">
        ● Simulated conceptual activation for educational visualization. No real neuron execution.
      </div>
    </div>
  );
};

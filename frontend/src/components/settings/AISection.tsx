'use client';

import React from 'react';
import { Cpu, Network, Layers, GitFork, Activity } from 'lucide-react';
import { PlatformSettings } from '@/types';

interface AISectionProps {
  ai: PlatformSettings['ai'];
  onChange: (ai: PlatformSettings['ai']) => void;
}

export const AISection: React.FC<AISectionProps> = ({
  ai,
  onChange,
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur-xl shadow-xl space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-100">AI Analysis & Model Preferences</h3>
          <p className="text-xs text-slate-400">
            Select primary neural visualization perspective and signal explainability layers.
          </p>
        </div>
      </div>

      {/* Model Visualization Perspective */}
      <div>
        <label className="block text-xs font-mono text-slate-400 mb-2">
          Default Model Perspective
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: 'FUSION',
              label: 'Fusion Ensemble',
              desc: 'Weighted multi-head consensus combining statistical & neural models',
            },
            {
              id: 'TFIDF_SVM',
              label: 'TF-IDF + Linear SVM',
              desc: 'High-speed ngram token frequency & structural linear boundary',
            },
            {
              id: 'DISTILBERT',
              label: 'Multilingual DistilBERT',
              desc: 'Deep transformer self-attention & contextual semantics',
            },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => onChange({ ...ai, modelVisualization: m.id as any })}
              className={`p-3 rounded-xl text-left border transition-all ${
                ai.modelVisualization === m.id
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-md'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <span className="text-xs font-mono font-bold block">{m.label}</span>
              <span className="text-[10px] text-slate-400 mt-1 block leading-relaxed">
                {m.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Feature Visibility Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            key: 'showSignalContributions' as const,
            title: 'Signal Contribution Bars',
            desc: 'Display individual feature weights and lexical coefficient bars.',
          },
          {
            key: 'showExplainability' as const,
            title: 'Natural Explainability Layer',
            desc: 'Render forensic rationale synthesis explaining classifier choices.',
          },
          {
            key: 'showModelComparison' as const,
            title: 'Model Comparison Matrix',
            desc: 'Show side-by-side metric tables across SVM, DistilBERT, and Fusion.',
          },
          {
            key: 'showNeuralVisualization' as const,
            title: 'Neural Network 3D/Graph Views',
            desc: 'Enable interactive node activation graphs and attention flow lines.',
          },
        ].map((toggle) => (
          <div
            key={toggle.key}
            onClick={() =>
              onChange({
                ...ai,
                [toggle.key]: !ai[toggle.key],
              })
            }
            className="flex items-center justify-between p-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
          >
            <div className="pr-3">
              <span className="text-xs font-semibold text-slate-200 block">{toggle.title}</span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">{toggle.desc}</span>
            </div>
            <input
              type="checkbox"
              checked={ai[toggle.key]}
              onChange={() => {}}
              className="w-4 h-4 accent-purple-400 rounded pointer-events-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

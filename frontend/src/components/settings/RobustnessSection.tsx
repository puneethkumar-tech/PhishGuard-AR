'use client';

import React from 'react';
import { Swords, ShieldAlert, Sliders, Zap, CheckCircle2 } from 'lucide-react';
import { PlatformSettings } from '@/types';

interface RobustnessSectionProps {
  robustness: PlatformSettings['robustness'];
  onChange: (robustness: PlatformSettings['robustness']) => void;
}

export const RobustnessSection: React.FC<RobustnessSectionProps> = ({
  robustness,
  onChange,
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur-xl shadow-xl space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
          <Swords className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-100">
            Adversarial Robustness Preferences
          </h3>
          <p className="text-xs text-slate-400">
            Configure mutation perturbation bounds, hardening defaults, and semantic constraints.
          </p>
        </div>
      </div>

      {/* Default Attack Strength */}
      <div>
        <label className="block text-xs font-mono text-slate-400 mb-2">
          Default Attack Strength
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'LOW', label: 'Low (Subtle Perturbations)', desc: '1-2 character homoglyphs' },
            { id: 'MEDIUM', label: 'Medium (Compound Evasion)', desc: 'Obfuscation + zero-width' },
            { id: 'HIGH', label: 'High (Adversarial Stress)', desc: 'Multi-layer semantic mutation' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => onChange({ ...robustness, defaultAttackStrength: s.id as any })}
              className={`p-3 rounded-xl text-left border transition-all ${
                robustness.defaultAttackStrength === s.id
                  ? 'bg-orange-500/20 text-orange-300 border-orange-500/40 shadow-md'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <span className="text-xs font-mono font-bold block">{s.label}</span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">{s.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Default Intensity Slider */}
      <div>
        <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-2">
          <span>Default Mutation Intensity</span>
          <span className="text-orange-400 font-bold">{robustness.defaultIntensity}%</span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          value={robustness.defaultIntensity}
          onChange={(e) =>
            onChange({ ...robustness, defaultIntensity: Number(e.target.value) })
          }
          className="w-full accent-orange-400 bg-slate-950/80 h-2 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
          <span>10% (Minimal)</span>
          <span>50% (Balanced)</span>
          <span>100% (Maximum Perturbation)</span>
        </div>
      </div>

      {/* Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
        <div
          onClick={() =>
            onChange({ ...robustness, preserveSemantics: !robustness.preserveSemantics })
          }
          className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-slate-700 cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-200">Preserve Semantics</span>
            <input
              type="checkbox"
              checked={robustness.preserveSemantics}
              onChange={() => {}}
              className="w-4 h-4 accent-orange-400 rounded pointer-events-none"
            />
          </div>
          <span className="text-[11px] text-slate-400">
            Prevent unreadable gibberish mutations.
          </span>
        </div>

        <div
          onClick={() =>
            onChange({ ...robustness, preserveUrlStructure: !robustness.preserveUrlStructure })
          }
          className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-slate-700 cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-200">Preserve URL Grammar</span>
            <input
              type="checkbox"
              checked={robustness.preserveUrlStructure}
              onChange={() => {}}
              className="w-4 h-4 accent-orange-400 rounded pointer-events-none"
            />
          </div>
          <span className="text-[11px] text-slate-400">
            Maintain valid protocol and domain format.
          </span>
        </div>

        <div
          onClick={() =>
            onChange({
              ...robustness,
              autoShowRobustnessResult: !robustness.autoShowRobustnessResult,
            })
          }
          className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-slate-700 cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-200">Auto-show Results</span>
            <input
              type="checkbox"
              checked={robustness.autoShowRobustnessResult}
              onChange={() => {}}
              className="w-4 h-4 accent-orange-400 rounded pointer-events-none"
            />
          </div>
          <span className="text-[11px] text-slate-400">
            Auto-scroll to hardened comparison view.
          </span>
        </div>
      </div>
    </div>
  );
};

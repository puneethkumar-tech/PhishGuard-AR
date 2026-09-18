'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { ROBUSTNESS_DEMO_SCENARIOS } from '@/lib/robustness-demo-data';
import { RobustnessDemoScenario } from '@/types';
import { FileText, Sparkles, Globe, Mail, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface RobustnessInputPanelProps {
  selectedScenario: RobustnessDemoScenario;
  onSelectScenario: (scenario: RobustnessDemoScenario) => void;
  customText: string;
  onChangeCustomText: (text: string) => void;
  disabled?: boolean;
}

export const RobustnessInputPanel: React.FC<RobustnessInputPanelProps> = ({
  selectedScenario,
  onSelectScenario,
  customText,
  onChangeCustomText,
  disabled = false,
}) => {
  return (
    <GlassCard className="p-5 sm:p-6 space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/20 text-primary-bright">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text uppercase tracking-wider font-mono">
              1. Input Under Test
            </h3>
            <p className="text-[11px] text-text-muted">
              Select a benchmark attack scenario or provide custom text to simulate.
            </p>
          </div>
        </div>

        <Badge variant="primary" size="sm">
          DEMO SAMPLE SELECTION
        </Badge>
      </div>

      {/* Scenario Pill Selector */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-text-muted flex items-center justify-between">
          <span>Preset Scenarios:</span>
          <span className="text-[10px] text-primary-bright">Click to populate</span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {ROBUSTNESS_DEMO_SCENARIOS.map((sc) => {
            const isSelected = selectedScenario.id === sc.id;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => onSelectScenario(sc)}
                disabled={disabled}
                className={`p-2.5 rounded-xl text-left transition-all border flex flex-col justify-between min-h-[64px] ${
                  isSelected
                    ? 'bg-gradient-to-br from-primary/20 to-cyber-violet/20 border-primary-bright/60 text-white shadow-glass-glow ring-1 ring-primary-bright/50'
                    : 'bg-surface-2/70 hover:bg-surface-3/80 border-border text-text-muted hover:text-text'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-[9px] font-mono uppercase font-bold text-cyber-cyan">
                    {sc.tag}
                  </span>
                  {isSelected && <CheckCircle2 className="w-3 h-3 text-primary-bright" />}
                </div>
                <span className="text-xs font-bold leading-tight line-clamp-2">
                  {sc.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Text Area Input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono text-text-muted flex items-center gap-1.5">
            <span>Payload Content (Editable):</span>
            <span className="text-[10px] text-purple-300">[{selectedScenario.category}]</span>
          </label>
          <span className="text-[10px] font-mono text-text-muted">
            {customText.length} chars
          </span>
        </div>

        <div className="relative">
          <textarea
            value={customText}
            onChange={(e) => onChangeCustomText(e.target.value)}
            disabled={disabled}
            rows={3}
            className="w-full p-3.5 rounded-xl bg-surface-2/90 border border-border focus:border-primary-bright focus:ring-1 focus:ring-primary-bright text-xs font-mono text-text placeholder-text-muted resize-none leading-relaxed transition-all shadow-inner"
            placeholder="Type or paste phishing or benign payload here..."
          />
        </div>
      </div>
    </GlassCard>
  );
};

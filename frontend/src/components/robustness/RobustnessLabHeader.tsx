'use client';

import React from 'react';
import { FlaskConical, RotateCcw, Download, Sparkles, ShieldAlert } from 'lucide-react';
import { GlowButton } from '@/components/ui/GlowButton';
import { Badge } from '@/components/ui/Badge';

interface RobustnessLabHeaderProps {
  onReset: () => void;
  onExport: () => void;
  onLoadScenarioModal?: () => void;
  hasResult: boolean;
}

export const RobustnessLabHeader: React.FC<RobustnessLabHeaderProps> = ({
  onReset,
  onExport,
  hasResult,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-surface/80 border border-border shadow-glass backdrop-blur-md">
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyber-violet/20 border border-cyber-violet/40 text-purple-300">
            <FlaskConical className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono font-bold tracking-widest text-purple-300 uppercase">
            PHASE 6 // ADVERSARIAL STRESS-TEST LAB
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse" />
            SIMULATION ENVIRONMENT
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text">
          Adversarial Robustness Lab
        </h1>

        <p className="text-xs sm:text-sm text-text-muted max-w-2xl leading-relaxed">
          Test how simulated phishing detection models respond to controlled adversarial perturbations and evaluate resilient AR defense transformations.
        </p>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {hasResult && (
          <>
            <a
              href="/reports"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.setItem('phishguard_active_report_source', 'LATEST_ROBUSTNESS');
                }
              }}
            >
              <GlowButton
                variant="primary"
                size="sm"
                leftIcon={<Sparkles className="w-3.5 h-3.5 text-cyan-300" />}
              >
                Generate Report
              </GlowButton>
            </a>
            <GlowButton
              variant="secondary"
              size="sm"
              onClick={onExport}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export Dossier
            </GlowButton>
          </>
        )}

        <GlowButton
          variant="outline"
          size="sm"
          onClick={onReset}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Reset Lab
        </GlowButton>
      </div>
    </div>
  );
};

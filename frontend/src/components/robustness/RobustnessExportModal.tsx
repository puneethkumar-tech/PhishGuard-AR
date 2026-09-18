'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { Badge } from '@/components/ui/Badge';
import { RobustnessSimulationResult } from '@/types';
import { X, Copy, Check, Download, FileJson, Shield } from 'lucide-react';

interface RobustnessExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: RobustnessSimulationResult | null;
}

export const RobustnessExportModal: React.FC<RobustnessExportModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !result) return null;

  const exportPayload = {
    platform: 'PhishGuard-AR',
    mode: 'SIMULATION',
    environment: 'Adversarial Robustness Lab (Phase 6)',
    timestamp: new Date().toISOString(),
    simulationScenario: {
      id: result.config.sampleId,
      title: result.config.sampleTitle,
      inputPayload: result.originalInput,
    },
    attackConfiguration: {
      technique: result.config.attackType,
      simulatedStrength: result.config.attackStrength,
      intensityPercent: result.config.intensity,
      mutationCount: result.config.mutationCount,
      preserveSemantics: result.config.preserveSemantics,
      preserveUrlStructure: result.config.preserveUrlStructure,
      perturbedPayload: result.perturbedInput,
    },
    modelResponseMetrics: {
      unperturbedBaselineConfidence: result.originalConfidence,
      unperturbedVerdict: result.originalVerdict,
      perturbedConfidence: result.perturbedConfidence,
      perturbedVerdict: result.perturbedVerdict,
      hardenedConfidence: result.hardenedConfidence,
      hardenedVerdict: result.hardenedVerdict,
      recoveryDeltaPoints: result.recoveryDelta,
    },
    robustnessEvaluation: {
      robustnessScore: result.robustnessScore,
      stabilityRating: result.stabilityScore,
      confidenceRetentionPercent: result.confidenceRetention,
      signalPreservationPercent: result.signalPreservation,
      recoveryRatePercent: result.recoveryRate,
      activeDefenseCountermeasure: result.config.activeDefense,
    },
    disclaimer:
      'DEMO / SIMULATED MODEL OUTPUT. This export contains deterministic educational simulations and does not represent live adversarial exploits or production telemetry.',
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phishguard-robustness-dossier-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <div className="w-full max-w-2xl">
        <GlassCard className="p-6 space-y-4 border-cyber-cyan/40 shadow-2xl relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-surface-2 hover:bg-surface-3 text-text-muted hover:text-text border border-border"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyber-cyan/20 text-cyber-cyan">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text font-mono uppercase">
                Export Robustness Simulation Dossier
              </h3>
              <p className="text-xs text-text-muted">
                Standardized JSON export for security benchmark tracking.
              </p>
            </div>
          </div>

          {/* JSON Preview */}
          <div className="p-4 rounded-xl bg-surface-2/90 border border-border max-h-80 overflow-y-auto font-mono text-[11px] text-cyan-200 leading-relaxed select-all">
            <pre className="whitespace-pre-wrap">{jsonString}</pre>
          </div>

          {/* Modal Footer Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-border">
            <span className="text-[10px] font-mono text-text-muted">
              ● SIMULATED DOSSIER FORMAT
            </span>

            <div className="flex items-center gap-2">
              <GlowButton
                variant="outline"
                size="sm"
                onClick={handleCopy}
                leftIcon={copied ? <Check className="w-3.5 h-3.5 text-cyber-success" /> : <Copy className="w-3.5 h-3.5" />}
              >
                {copied ? 'Copied to Clipboard' : 'Copy JSON'}
              </GlowButton>

              <GlowButton
                variant="secondary"
                size="sm"
                onClick={handleDownload}
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                Download JSON
              </GlowButton>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

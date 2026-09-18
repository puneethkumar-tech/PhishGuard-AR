'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { GlowButton } from '@/components/ui/GlowButton';
import {
  FlaskConical,
  Shield,
  Zap,
  RefreshCw,
  ArrowRight,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { DEMO_ROBUSTNESS_CASES } from '@/lib/demo-data';
import { RobustnessCase } from '@/types';

export default function RobustnessPage() {
  const [selectedCase, setSelectedCase] = useState<RobustnessCase>(DEMO_ROBUSTNESS_CASES[0]);
  const [perturbationLevel, setPerturbationLevel] = useState<number>(65);

  return (
    <PageContainer>
      {/* 1. Page Header */}
      <PageHeader
        eyebrow="ROBUSTNESS LAB"
        title="Adversarial Testing Environment"
        description="Visualize how phishing attacks change under adversarial perturbations and evaluate PhishGuard-AR defensive hardening algorithms."
        statusBadge={{ label: "Simulation Ready", variant: "violet", dot: true }}
      />

      {/* 2. Attack Vector Selector & Controls */}
      <GlassCard className="p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-border/70">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FlaskConical className="w-4 h-4 text-cyber-violet" />
              <span className="text-xs font-mono font-bold text-text uppercase tracking-wider">
                Select Attack Vector:
              </span>
            </div>
            <p className="text-xs text-text-muted">
              Choose an adversarial text transformation technique to stress-test the model.
            </p>
          </div>

          {/* Selector Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {DEMO_ROBUSTNESS_CASES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCase(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedCase.id === c.id
                    ? 'bg-gradient-to-r from-cyber-violet to-purple-600 text-white shadow-glass-glow border border-purple-400/40'
                    : 'bg-surface-2 text-text-muted hover:text-text hover:bg-surface-3 border border-border'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Perturbation Level Slider */}
        <div className="mt-4 pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
            <Sliders className="w-3.5 h-3.5 text-cyber-cyan" />
            <span>Perturbation Intensity Calibration:</span>
            <span className="text-cyber-cyan font-bold">{perturbationLevel}%</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-64">
            <span className="text-[10px] font-mono text-text-muted">Min</span>
            <input
              type="range"
              min="10"
              max="100"
              value={perturbationLevel}
              onChange={(e) => setPerturbationLevel(Number(e.target.value))}
              className="w-full accent-cyber-cyan bg-surface-2 h-1.5 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] font-mono text-text-muted">Max</span>
          </div>
        </div>
      </GlassCard>

      {/* 3. Three-Stage Visual Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Stage 1: Original Clean Baseline */}
        <div className="lg:col-span-4 flex flex-col">
          <GlassCard className="p-6 flex-1 flex flex-col justify-between border-t-2 border-t-primary-bright">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/20 text-primary-bright">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text">1. Clean Phishing Input</h3>
                    <span className="text-[10px] font-mono text-text-muted">Unperturbed Sample</span>
                  </div>
                </div>
                <Badge variant="primary" size="sm">BASELINE</Badge>
              </div>

              <div className="p-4 rounded-xl bg-surface-2/90 border border-border text-xs font-mono text-text-muted leading-relaxed my-4 min-h-[100px]">
                &quot;{selectedCase.originalText}&quot;
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface/80 border border-border text-xs space-y-2">
              <div className="flex justify-between items-center text-text-muted">
                <span>Standard Detector:</span>
                <Badge variant="danger" size="sm">PHISHING</Badge>
              </div>
              <div className="flex justify-between items-center text-text-muted">
                <span>Initial Confidence:</span>
                <span className="text-cyber-danger font-mono font-bold">{selectedCase.baselineConfidence}</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Stage 2: Adversarial Attack (Evasion) */}
        <div className="lg:col-span-4 flex flex-col">
          <GlassCard className="p-6 flex-1 flex flex-col justify-between border-t-2 border-t-cyber-danger shadow-danger-glow/20">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-cyber-danger/20 text-cyber-danger">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text">2. Adversarial Evasion</h3>
                    <span className="text-[10px] font-mono text-cyber-danger">{selectedCase.category}</span>
                  </div>
                </div>
                <Badge variant="danger" size="sm">ATTACKED</Badge>
              </div>

              <div className="p-4 rounded-xl bg-surface-2/90 border border-cyber-danger/30 text-xs font-mono text-text leading-relaxed my-4 min-h-[100px] relative">
                &quot;{selectedCase.attackedText}&quot;
                <div className="mt-2 text-[10px] font-mono text-cyber-danger">
                  • {selectedCase.attackType}
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface/80 border border-cyber-danger/30 text-xs space-y-2">
              <div className="flex justify-between items-center text-text-muted">
                <span>Static Filter Response:</span>
                <Badge variant="warning" size="sm">EVADED (SAFE)</Badge>
              </div>
              <div className="flex justify-between items-center text-text-muted">
                <span>Confidence Drop:</span>
                <span className="text-cyber-danger font-mono font-bold">{selectedCase.confidenceDrop}</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Stage 3: Hardened AR Defense */}
        <div className="lg:col-span-4 flex flex-col">
          <GlassCard className="p-6 flex-1 flex flex-col justify-between border-t-2 border-t-cyber-success shadow-cyan-glow/20">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-cyber-success/20 text-cyber-success">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text">3. AR Hardened Defense</h3>
                    <span className="text-[10px] font-mono text-cyber-success">PhishGuard-AR Model</span>
                  </div>
                </div>
                <Badge variant="success" size="sm">HARDENED</Badge>
              </div>

              <div className="p-4 rounded-xl bg-surface-2/90 border border-cyber-success/30 text-xs font-mono text-text-muted leading-relaxed my-4 min-h-[100px]">
                <p className="text-text font-semibold mb-1">Defense Transformation:</p>
                <p className="text-[11px] text-cyber-cyan">{selectedCase.defenseMechanism}</p>
                <div className="mt-2 text-[10px] text-cyber-success font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Evasion neutralised & token restored
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface/80 border border-cyber-success/30 text-xs space-y-2">
              <div className="flex justify-between items-center text-text-muted">
                <span>Hardened Verdict:</span>
                <Badge variant="success" size="sm">RESISTED (PHISHING)</Badge>
              </div>
              <div className="flex justify-between items-center text-text-muted">
                <span>Robust Model Score:</span>
                <span className="text-cyber-success font-mono font-bold">{selectedCase.hardenedConfidence}</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* 4. Research Notes & Benchmarking Details */}
      <GlassCard className="p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-primary-bright" />
          <h4 className="text-sm font-bold text-text font-mono uppercase tracking-wider">
            Adversarial Defense Architecture Insight (Demo Lab)
          </h4>
        </div>
        <p className="text-xs text-text-muted leading-relaxed">
          Standard static text classifiers (such as naive Bayes or uncalibrated linear SVMs) rely heavily on exact string token matches. Adversaries exploit this vulnerability by swapping Unicode homoglyphs (e.g. Cyrillic &apos;а&apos; for Latin &apos;a&apos;) or injecting zero-width spaces. PhishGuard-AR pairs NFKC normalization with DistilBERT contextual subword embeddings, ensuring detection resilience even when surface-level character encodings are heavily mutated.
        </p>
      </GlassCard>
    </PageContainer>
  );
}

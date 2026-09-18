'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { RobustnessSimulationResult } from '@/types';
import {
  Shield,
  Zap,
  RefreshCw,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';

interface RobustnessComparisonProps {
  result: RobustnessSimulationResult;
}

export const RobustnessComparison: React.FC<RobustnessComparisonProps> = ({ result }) => {
  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-text font-mono uppercase tracking-wider flex items-center gap-2">
            <span>Robustness Comparison Matrix</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-primary/20 text-primary-bright border border-primary/30">
              SIMULATED RESULT
            </span>
          </h3>
          <p className="text-xs text-text-muted">
            Tracking classification resilience across unperturbed baseline, adversarial evasion, and hardened defense.
          </p>
        </div>

        <span className="text-[10px] font-mono text-text-muted">
          Technique: <span className="text-purple-300 font-bold uppercase">{result.config.attackType}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        {/* PANEL 1: ORIGINAL BASELINE */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col"
        >
          <GlassCard className="p-6 flex-1 flex flex-col justify-between border-t-2 border-t-primary-bright shadow-glass">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-primary/20 text-primary-bright">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text">1. Clean Baseline</h4>
                    <span className="text-[10px] font-mono text-text-muted">Unperturbed Sample</span>
                  </div>
                </div>
                <Badge variant="primary" size="sm">BASELINE</Badge>
              </div>

              {/* Confidence Metric */}
              <div className="my-4 p-4 rounded-xl bg-surface-2/80 border border-border text-center space-y-1">
                <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider block">
                  Simulated Confidence
                </span>
                <span className="text-3xl font-extrabold font-mono text-primary-bright block">
                  {result.originalConfidence.toFixed(1)}%
                </span>
                <span className="text-[11px] text-cyber-success font-semibold">
                  Stable unperturbed state
                </span>
              </div>

              {/* Verdict */}
              <div className="p-3 rounded-xl bg-surface/90 border border-border text-xs space-y-2">
                <div className="flex justify-between items-center text-text-muted">
                  <span>Simulated Verdict:</span>
                  <span className="font-mono font-bold text-cyber-danger">
                    {result.originalVerdict}
                  </span>
                </div>
                <div className="flex justify-between items-center text-text-muted">
                  <span>Feature Extraction:</span>
                  <span className="text-text font-mono">100% Intact</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/60 text-[10px] font-mono text-text-muted flex items-center justify-between">
              <span>Standard Vulnerable Detector</span>
              <span className="text-primary-bright">● Reference Point</span>
            </div>
          </GlassCard>
        </motion.div>

        {/* PANEL 2: ADVERSARIAL ATTACK */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex flex-col"
        >
          <GlassCard className="p-6 flex-1 flex flex-col justify-between border-t-2 border-t-cyber-danger shadow-danger-glow/20">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-cyber-danger/20 text-cyber-danger">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text">2. Under Attack</h4>
                    <span className="text-[10px] font-mono text-cyber-danger">
                      {result.config.intensity}% Perturbation Applied
                    </span>
                  </div>
                </div>
                <Badge variant="danger" size="sm">ATTACKED</Badge>
              </div>

              {/* Confidence Metric with Degradation */}
              <div className="my-4 p-4 rounded-xl bg-cyber-danger/10 border border-cyber-danger/30 text-center space-y-1">
                <span className="text-[10px] font-mono text-cyber-danger uppercase tracking-wider block">
                  Simulated Confidence
                </span>
                <span className="text-3xl font-extrabold font-mono text-red-300 block">
                  {result.perturbedConfidence.toFixed(1)}%
                </span>
                <div className="flex items-center justify-center gap-1 text-[11px] text-cyber-danger font-bold">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>
                    -{(result.originalConfidence - result.perturbedConfidence).toFixed(1)}% Degradation
                  </span>
                </div>
              </div>

              {/* Verdict */}
              <div className="p-3 rounded-xl bg-surface/90 border border-cyber-danger/30 text-xs space-y-2">
                <div className="flex justify-between items-center text-text-muted">
                  <span>Evaded Classifier:</span>
                  <span className="font-mono font-bold text-cyber-warning">
                    {result.perturbedVerdict}
                  </span>
                </div>
                <div className="flex justify-between items-center text-text-muted">
                  <span>Confidence Retention:</span>
                  <span className="text-red-300 font-mono font-bold">
                    {result.confidenceRetention}%
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/60 text-[10px] font-mono text-cyber-danger flex items-center justify-between">
              <span>Classifier Instability Flagged</span>
              <span>● Perturbed</span>
            </div>
          </GlassCard>
        </motion.div>

        {/* PANEL 3: HARDENED AR DEFENSE */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex flex-col"
        >
          <GlassCard className="p-6 flex-1 flex flex-col justify-between border-t-2 border-t-cyber-success shadow-glass-glow">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-cyber-success/20 text-cyber-success">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text">3. Hardened Defense</h4>
                    <span className="text-[10px] font-mono text-cyber-success">
                      PhishGuard-AR Model
                    </span>
                  </div>
                </div>
                <Badge variant="success" size="sm">HARDENED</Badge>
              </div>

              {/* Recovered Confidence Metric */}
              <div className="my-4 p-4 rounded-xl bg-cyber-success/10 border border-cyber-success/30 text-center space-y-1">
                <span className="text-[10px] font-mono text-cyber-success uppercase tracking-wider block">
                  Simulated Confidence
                </span>
                <span className="text-3xl font-extrabold font-mono text-green-300 block">
                  {result.hardenedConfidence.toFixed(1)}%
                </span>
                <div className="flex items-center justify-center gap-1 text-[11px] text-cyber-success font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+{result.recoveryDelta.toFixed(1)} points recovered</span>
                </div>
              </div>

              {/* Verdict */}
              <div className="p-3 rounded-xl bg-surface/90 border border-cyber-success/30 text-xs space-y-2">
                <div className="flex justify-between items-center text-text-muted">
                  <span>Hardened Verdict:</span>
                  <span className="font-mono font-bold text-cyber-success">
                    {result.hardenedVerdict}
                  </span>
                </div>
                <div className="flex justify-between items-center text-text-muted">
                  <span>Recovery Efficiency:</span>
                  <span className="text-green-300 font-mono font-bold">
                    {result.recoveryRate}%
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/60 text-[10px] font-mono text-cyber-success flex items-center justify-between">
              <span>Robust AR Transformer Defense</span>
              <span>● Protected</span>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

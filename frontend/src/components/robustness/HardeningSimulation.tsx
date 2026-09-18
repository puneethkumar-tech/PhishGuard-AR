'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { RobustnessSimulationResult } from '@/types';
import {
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Cpu,
  RefreshCw,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface HardeningSimulationProps {
  result: RobustnessSimulationResult;
}

export const HardeningSimulation: React.FC<HardeningSimulationProps> = ({ result }) => {
  return (
    <GlassCard className="p-5 sm:p-6 space-y-5 border-cyber-success/30 shadow-glass-glow">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyber-success/20 text-cyber-success">
            <RefreshCw className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text uppercase tracking-wider font-mono">
              Hardening Simulation Workflow
            </h3>
            <p className="text-[11px] text-text-muted">
              Live simulation of adversarial token sanitization, embedding restoration, and confidence recovery.
            </p>
          </div>
        </div>

        <Badge variant="success" size="sm">
          SIMULATED DEFENSE RESPONSE
        </Badge>
      </div>

      {/* 5-Stage Hardening Pipeline */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
        {/* Step 1: Attacked Model */}
        <div className="p-4 rounded-xl bg-cyber-danger/10 border border-cyber-danger/40 text-center space-y-1">
          <span className="text-[9px] font-mono text-cyber-danger uppercase font-bold block">
            01. Attacked State
          </span>
          <span className="text-xl font-extrabold font-mono text-red-300 block">
            {result.perturbedConfidence.toFixed(1)}%
          </span>
          <span className="text-[10px] text-text-muted block">Evaded Static Detector</span>
        </div>

        <div className="hidden sm:flex justify-center text-border">
          <ArrowRight className="w-4 h-4 text-cyber-cyan" />
        </div>

        {/* Step 2: Defense Mechanism */}
        <div className="p-4 rounded-xl bg-surface-2 border border-border text-center space-y-1">
          <span className="text-[9px] font-mono text-purple-300 uppercase font-bold block">
            02. Defense Transformation
          </span>
          <span className="text-xs font-bold text-text font-mono block">
            {result.config.activeDefense.toUpperCase()}
          </span>
          <span className="text-[10px] text-text-muted block">NFKC + Attention Hardening</span>
        </div>

        <div className="hidden sm:flex justify-center text-border">
          <ArrowRight className="w-4 h-4 text-cyber-success" />
        </div>

        {/* Step 3: Hardened Output */}
        <div className="p-4 rounded-xl bg-cyber-success/15 border border-cyber-success/50 text-center space-y-1 shadow-glass">
          <span className="text-[9px] font-mono text-cyber-success uppercase font-bold block">
            03. Recovered State
          </span>
          <span className="text-xl font-extrabold font-mono text-green-300 block">
            {result.hardenedConfidence.toFixed(1)}%
          </span>
          <span className="text-[10px] text-cyber-success font-semibold block">
            +{result.recoveryDelta.toFixed(1)} pts restored
          </span>
        </div>
      </div>

      {/* Recovery Breakdown Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="p-3 rounded-xl bg-surface-2/70 border border-border text-center">
          <span className="text-[10px] font-mono text-text-muted uppercase block">
            Before Defense
          </span>
          <span className="text-lg font-bold font-mono text-red-300">
            {result.perturbedConfidence.toFixed(1)}%
          </span>
        </div>

        <div className="p-3 rounded-xl bg-surface-2/70 border border-border text-center">
          <span className="text-[10px] font-mono text-text-muted uppercase block">
            After Hardened AR
          </span>
          <span className="text-lg font-bold font-mono text-green-300">
            {result.hardenedConfidence.toFixed(1)}%
          </span>
        </div>

        <div className="p-3 rounded-xl bg-cyber-success/20 border border-cyber-success/40 text-center shadow-glass">
          <span className="text-[10px] font-mono text-cyber-success uppercase block font-bold">
            Total Recovery Boost
          </span>
          <span className="text-lg font-extrabold font-mono text-white flex items-center justify-center gap-1">
            <TrendingUp className="w-4 h-4 text-cyber-success" />
            +{result.recoveryDelta.toFixed(1)} points
          </span>
        </div>
      </div>
    </GlassCard>
  );
};

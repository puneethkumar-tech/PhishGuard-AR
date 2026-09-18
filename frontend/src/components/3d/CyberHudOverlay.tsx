'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Activity,
  Sparkles,
  X,
  ArrowRight,
  Radio,
} from 'lucide-react';
import { ThreatNode3D, DefenseState } from './CyberDefenseState';
import { GlowButton } from '@/components/ui/GlowButton';
import { Badge } from '@/components/ui/Badge';

interface CyberHudOverlayProps {
  defenseState: DefenseState;
  onSimulateThreat: () => void;
  selectedThreat: ThreatNode3D | null;
  onCloseThreatModal: () => void;
  interceptedCount: number;
  activeThreatCount: number;
  totalSignalsCount: number;
}

export const CyberHudOverlay: React.FC<CyberHudOverlayProps> = ({
  defenseState,
  onSimulateThreat,
  selectedThreat,
  onCloseThreatModal,
  interceptedCount,
  activeThreatCount,
  totalSignalsCount,
}) => {
  const getStatusBadge = () => {
    switch (defenseState) {
      case 'THREAT_DETECTED':
        return { label: 'THREAT DETECTED', variant: 'danger' as const };
      case 'DEFENDING':
        return { label: 'DEFENSE ENGAGED', variant: 'cyan' as const };
      case 'PROTECTED':
        return { label: 'THREAT NEUTRALIZED', variant: 'success' as const };
      case 'SCANNING':
        return { label: 'DEEP SCANNING', variant: 'violet' as const };
      default:
        return { label: 'SOC GRID ACTIVE', variant: 'cyan' as const };
    }
  };

  const status = getStatusBadge();

  return (
    <>
      {/* Top HUD Bar */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface/85 border border-border backdrop-blur-md text-[10px] font-mono text-text">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-cyan opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-cyan" />
          </span>
          <span className="font-bold tracking-wider uppercase">GLOBAL THREAT SURFACE</span>
          <span className="text-text-muted/60">•</span>
          <span className="text-cyber-cyan">SIMULATION MODE</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface/85 border border-border backdrop-blur-md text-[10px] font-mono text-text">
          <Badge variant={status.variant} size="sm" dot>
            {status.label}
          </Badge>
        </div>
      </div>

      {/* Bottom HUD Bar */}
      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-20">
        {/* Telemetry Counters */}
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-surface/85 border border-border backdrop-blur-md text-[10px] font-mono text-text pointer-events-auto">
          <div>
            <span className="text-text-muted block text-[9px]">SIGNALS</span>
            <span className="font-bold text-text font-mono">{totalSignalsCount} DEMO</span>
          </div>
          <span className="text-border">|</span>
          <div>
            <span className="text-text-muted block text-[9px]">INTERCEPTED</span>
            <span className="font-bold text-cyber-success font-mono">{interceptedCount}</span>
          </div>
          <span className="text-border">|</span>
          <div>
            <span className="text-text-muted block text-[9px]">ACTIVE NODES</span>
            <span className="font-bold text-cyber-danger font-mono">{activeThreatCount}</span>
          </div>
        </div>

        {/* Manual Simulation Button */}
        <div className="pointer-events-auto">
          <GlowButton
            size="sm"
            variant={defenseState === 'DEFENDING' ? 'danger' : 'primary'}
            onClick={onSimulateThreat}
            disabled={defenseState === 'DEFENDING'}
            leftIcon={<Zap className="w-3.5 h-3.5" />}
          >
            {defenseState === 'DEFENDING' ? 'Neutralizing Attack...' : 'Simulate Threat'}
          </GlowButton>
        </div>
      </div>

      {/* Compact Threat Node Inspection Modal on Click */}
      <AnimatePresence>
        {selectedThreat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseThreatModal}
              className="fixed inset-0 bg-background/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md rounded-2xl bg-surface/95 border border-cyber-cyan/40 shadow-2xl p-6 backdrop-blur-2xl z-10 space-y-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between pb-3 border-b border-border/70">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyber-danger/15 border border-cyber-danger/30 text-cyber-danger">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-cyber-cyan uppercase">
                        DEMO TELEMETRY SIGNAL
                      </span>
                      <Badge variant="danger" size="sm">
                        {selectedThreat.severity}
                      </Badge>
                    </div>
                    <h3 className="text-base font-bold text-text mt-0.5">
                      {selectedThreat.label}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={onCloseThreatModal}
                  className="p-1 rounded-lg text-text-muted hover:text-text hover:bg-surface-3"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Threat Details */}
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-surface-2 border border-border space-y-1.5">
                  <div className="flex justify-between text-text-muted">
                    <span>Threat Classification:</span>
                    <span className="text-text font-semibold">{selectedThreat.type}</span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Attack Vector:</span>
                    <span className="text-cyber-danger font-mono text-[11px]">{selectedThreat.vector}</span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Sensor Region:</span>
                    <span className="text-text-muted font-mono">{selectedThreat.region}</span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Defense Status:</span>
                    <span className="text-cyber-success font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> CONTAINED (SIMULATION)
                    </span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] font-mono text-text-muted">
                  Simulated Threat Telemetry
                </span>

                <div className="flex items-center gap-2">
                  <GlowButton size="sm" variant="ghost" onClick={onCloseThreatModal}>
                    Dismiss
                  </GlowButton>
                  <Link href="/scan" onClick={onCloseThreatModal}>
                    <GlowButton size="sm" variant="primary" rightIcon={<ArrowRight className="w-3.5 h-3.5 ml-1" />}>
                      View Analysis
                    </GlowButton>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

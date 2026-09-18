'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RobotState } from '@/types';
import { Shield, Sparkles, AlertTriangle, ShieldCheck, Cpu } from 'lucide-react';

interface RobotFallback2DProps {
  state: RobotState;
}

export const RobotFallback2D: React.FC<RobotFallback2DProps> = ({ state }) => {
  const isThreat = state === 'THREAT_DETECTED';
  const isProtected = state === 'PROTECTED';
  const isScanning = state === 'SCANNING';
  const isAnalyzing = state === 'ANALYZING';

  return (
    <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden bg-gradient-to-b from-surface-2 to-surface rounded-2xl border border-border/80">
      {/* Glow Backdrop */}
      <div
        className={`absolute w-44 h-44 rounded-full blur-3xl transition-colors duration-500 pointer-events-none ${
          isThreat
            ? 'bg-cyber-danger/30'
            : isProtected
            ? 'bg-cyber-success/30'
            : isScanning || isAnalyzing
            ? 'bg-cyber-cyan/30'
            : 'bg-primary/20'
        }`}
      />

      {/* Center 2D Avatar / Visor */}
      <motion.div
        animate={{
          scale: isScanning ? [1, 1.05, 1] : 1,
          rotate: isThreat ? [0, -2, 2, -1, 1, 0] : 0,
        }}
        transition={{ repeat: isScanning ? Infinity : 0, duration: 1.5 }}
        className={`relative w-28 h-28 rounded-3xl flex items-center justify-center border-2 transition-all duration-300 shadow-2xl ${
          isThreat
            ? 'bg-surface border-cyber-danger text-cyber-danger shadow-danger-glow'
            : isProtected
            ? 'bg-surface border-cyber-success text-cyber-success shadow-glass-glow'
            : isScanning || isAnalyzing
            ? 'bg-surface border-cyber-cyan text-cyber-cyan shadow-cyan-glow'
            : 'bg-surface border-primary-bright/40 text-primary-bright shadow-glass'
        }`}
      >
        {isThreat ? (
          <AlertTriangle className="w-12 h-12 animate-bounce" />
        ) : isProtected ? (
          <ShieldCheck className="w-12 h-12" />
        ) : isAnalyzing ? (
          <Cpu className="w-12 h-12 animate-pulse" />
        ) : (
          <Shield className="w-12 h-12" />
        )}

        {/* Visor Eye Line */}
        <div
          className={`absolute top-4 left-6 right-6 h-1.5 rounded-full transition-colors ${
            isThreat
              ? 'bg-cyber-danger shadow-danger-glow'
              : isProtected
              ? 'bg-cyber-success shadow-glass-glow'
              : 'bg-cyber-cyan shadow-cyan-glow'
          }`}
        />
      </motion.div>

      {/* Label and State Text */}
      <div className="mt-4 space-y-1 z-10">
        <h4 className="text-sm font-bold text-text">AI CYBER ANALYST</h4>
        <div className="flex items-center justify-center gap-2 text-xs font-mono">
          <span
            className={`w-2 h-2 rounded-full animate-pulse ${
              isThreat
                ? 'bg-cyber-danger'
                : isProtected
                ? 'bg-cyber-success'
                : 'bg-cyber-cyan'
            }`}
          />
          <span className="text-text-muted uppercase">
            {state.replace('_', ' ')}
          </span>
        </div>
      </div>
    </div>
  );
};

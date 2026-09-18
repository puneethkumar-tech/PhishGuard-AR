'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

interface ScanConfidenceGaugeProps {
  confidence: number;
  verdict: string;
  severity: 'low' | 'medium' | 'high' | 'critical' | 'safe';
}

export const ScanConfidenceGauge: React.FC<ScanConfidenceGaugeProps> = ({
  confidence,
  verdict,
  severity,
}) => {
  const isSafe = severity === 'safe' || severity === 'low';
  const isAdversarial = severity === 'critical';

  // SVG circular arc calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (confidence / 100) * circumference;

  const strokeColor = isSafe
    ? '#10b981' // Green
    : isAdversarial
    ? '#8b5cf6' // Violet
    : '#ef4444'; // Red

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-surface-2/60 border border-border/80 relative">
      {/* Radial Gauge SVG */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            className="text-surface-3/80"
          />

          {/* Animated Value Arc */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke={strokeColor}
            strokeWidth="8"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xl font-extrabold font-mono text-text">
            {confidence.toFixed(1)}%
          </span>
          <span className="text-[9px] font-mono uppercase text-text-muted font-bold tracking-wider">
            DEMO
          </span>
        </div>
      </div>

      {/* Threat Badge */}
      <div className="mt-3 text-center space-y-0.5">
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
          isSafe
            ? 'bg-cyber-success/15 text-cyber-success border-cyber-success/30'
            : isAdversarial
            ? 'bg-cyber-violet/20 text-purple-300 border-cyber-violet/40'
            : 'bg-cyber-danger/15 text-cyber-danger border-cyber-danger/30'
        }`}>
          {isSafe ? 'BENIGN CLASSIFICATION' : isAdversarial ? 'ADVERSARIAL EVASION' : 'HIGH SEVERITY'}
        </span>
      </div>
    </div>
  );
};

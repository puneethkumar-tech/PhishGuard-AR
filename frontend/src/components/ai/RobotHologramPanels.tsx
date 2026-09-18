'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RobotState } from '@/types';
import { Cpu, Globe, ShieldCheck, AlertTriangle } from 'lucide-react';

interface RobotHologramPanelsProps {
  state: RobotState;
}

export const RobotHologramPanels: React.FC<RobotHologramPanelsProps> = ({ state }) => {
  const isThreat = state === 'THREAT_DETECTED';
  const isProtected = state === 'PROTECTED';
  const isAnalyzing = state === 'ANALYZING' || state === 'SCANNING';

  return (
    <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between select-none">
      {/* Top Row Panels */}
      <div className="flex items-center justify-between gap-2">
        {/* Signal Extraction Panel */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-2 rounded-xl bg-surface/85 border border-cyber-cyan/30 backdrop-blur-md shadow-glass text-[10px] font-mono flex items-center gap-2"
        >
          <Cpu className="w-3.5 h-3.5 text-cyber-cyan" />
          <div>
            <span className="text-text-muted block text-[8px] uppercase">Feature Signals</span>
            <span className="text-text font-bold">
              {isAnalyzing ? 'Extracting...' : '97.4% Demo'}
            </span>
          </div>
        </motion.div>

        {/* Language Detection Panel */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-2 rounded-xl bg-surface/85 border border-primary-bright/30 backdrop-blur-md shadow-glass text-[10px] font-mono flex items-center gap-2"
        >
          <Globe className="w-3.5 h-3.5 text-primary-bright" />
          <div className="text-right">
            <span className="text-text-muted block text-[8px] uppercase">Language</span>
            <span className="text-text font-bold">EN (104-Lang)</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row Panels */}
      <div className="flex items-center justify-between gap-2">
        {/* URL Risk Status */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-2 rounded-xl backdrop-blur-md border shadow-glass text-[10px] font-mono flex items-center gap-2 ${
            isThreat
              ? 'bg-cyber-danger/15 border-cyber-danger/40 text-cyber-danger'
              : 'bg-surface/85 border-border/80 text-text'
          }`}
        >
          {isThreat ? (
            <AlertTriangle className="w-3.5 h-3.5 text-cyber-danger" />
          ) : (
            <ShieldCheck className="w-3.5 h-3.5 text-cyber-success" />
          )}
          <div>
            <span className="text-text-muted block text-[8px] uppercase">URL Structure</span>
            <span className="font-bold">
              {isThreat ? 'High Risk Lure' : isAnalyzing ? 'Evaluating...' : 'Verified Benign'}
            </span>
          </div>
        </motion.div>

        {/* Robustness Hardening */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-2 rounded-xl backdrop-blur-md border shadow-glass text-[10px] font-mono flex items-center gap-2 ${
            isProtected
              ? 'bg-cyber-success/15 border-cyber-success/40 text-cyber-success'
              : 'bg-surface/85 border-border/80 text-text'
          }`}
        >
          <ShieldCheck className={`w-3.5 h-3.5 ${isProtected ? 'text-cyber-success' : 'text-purple-300'}`} />
          <div className="text-right">
            <span className="text-text-muted block text-[8px] uppercase">Adversarial AR</span>
            <span className="font-bold">
              {isProtected ? 'Protected' : 'Calibrated'}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

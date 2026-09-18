'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanResult, RobotState } from '@/types';
import { ThreatVerdictHeader } from './ThreatVerdictHeader';
import { ForensicMessageViewer } from './ForensicMessageViewer';
import { EvidenceSignalList } from './EvidenceSignalList';
import { UrlForensics } from './UrlForensics';
import { CharacterForensics } from './CharacterForensics';
import { SignalContributionBars } from './SignalContributionBars';
import { ModelComparison } from './ModelComparison';
import { ExplanationTimeline } from './ExplanationTimeline';
import { AttackContextPanel } from './AttackContextPanel';
import { RobustnessSnapshot } from './RobustnessSnapshot';
import { RecommendationPanel } from './RecommendationPanel';
import { ResultActionBar } from './ResultActionBar';
import {
  ShieldAlert,
  FileSearch,
  Cpu,
  MapPin,
  FlaskConical,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';

interface ForensicWorkspaceProps {
  result: ScanResult;
  onRunAgain: () => void;
  onTabChange?: (tabId: string) => void;
}

const FORENSIC_TABS = [
  { id: 'overview', label: 'OVERVIEW', icon: Layers },
  { id: 'evidence', label: 'EVIDENCE & TOKENS', icon: FileSearch },
  { id: 'models', label: 'MODEL CONTRIBUTIONS', icon: Cpu },
  { id: 'attack', label: 'ATTACK CONTEXT', icon: MapPin },
  { id: 'robustness', label: 'ROBUSTNESS SNAPSHOT', icon: FlaskConical },
];

export const ForensicWorkspace: React.FC<ForensicWorkspaceProps> = ({
  result,
  onRunAgain,
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (onTabChange) onTabChange(tabId);
  };

  const isSafe = result.threatLevel === 'safe';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Master Threat Verdict Header */}
      <ThreatVerdictHeader result={result} />

      {/* 2. Navigation Tabs for Investigation */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-surface-2/90 border border-border overflow-x-auto">
        {FORENSIC_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-primary to-primary-bright text-white shadow-glass-glow'
                  : 'text-text-muted hover:text-text hover:bg-surface-3'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Tab Contents with Animation */}
      <div className="min-h-[360px]">
        <AnimatePresence mode="wait">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div
              key="tab-overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Evidence Signals Summary */}
              <EvidenceSignalList signals={result.signals} isSafe={isSafe} />

              {/* Numbered Explanation Sequence */}
              <ExplanationTimeline explanations={result.explanations} />

              {/* Recommendation Box */}
              <RecommendationPanel
                recommendation={result.recommendation}
                isSafe={isSafe}
                actionSeverity={result.metadata.actionSeverity}
              />
            </motion.div>
          )}

          {/* TAB 2: EVIDENCE & TOKENS */}
          {activeTab === 'evidence' && (
            <motion.div
              key="tab-evidence"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Forensic Message Viewer */}
              <ForensicMessageViewer
                tokens={result.tokens}
                isSafe={isSafe}
                rawInput={result.input}
              />

              {/* URL Forensics if URL exists */}
              {result.urlForensics && <UrlForensics urlData={result.urlForensics} />}

              {/* Character Forensics if Homoglyph detected */}
              {result.characterForensics && (
                <CharacterForensics characters={result.characterForensics} />
              )}
            </motion.div>
          )}

          {/* TAB 3: MODEL CONTRIBUTIONS */}
          {activeTab === 'models' && (
            <motion.div
              key="tab-models"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Signal Contribution Bars */}
              <SignalContributionBars contributions={result.contributions} />

              {/* Dual Model Architecture Comparison */}
              <ModelComparison
                confidenceInterpretation={result.confidenceInterpretation}
              />
            </motion.div>
          )}

          {/* TAB 4: ATTACK CONTEXT */}
          {activeTab === 'attack' && (
            <motion.div
              key="tab-attack"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <AttackContextPanel
                mitreContext={result.mitreContext}
                attackChain={result.attackChain}
              />
            </motion.div>
          )}

          {/* TAB 5: ROBUSTNESS SNAPSHOT */}
          {activeTab === 'robustness' && (
            <motion.div
              key="tab-robustness"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <RobustnessSnapshot robustness={result.robustnessSnapshot} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Master Action Bar */}
      <ResultActionBar result={result} onRunAgain={onRunAgain} />
    </div>
  );
};

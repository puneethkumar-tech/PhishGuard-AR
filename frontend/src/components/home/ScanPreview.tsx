'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { Badge } from '@/components/ui/Badge';
import {
  FileText,
  Mail,
  UploadCloud,
  Link2,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  CheckCircle,
} from 'lucide-react';
import { DEMO_SAMPLE_MESSAGES } from '@/lib/demo-data';

const SCAN_TABS = [
  { id: 'text', label: 'Text Input', icon: FileText },
  { id: 'email', label: 'Email Header', icon: Mail },
  { id: 'upload', label: 'Upload File', icon: UploadCloud },
  { id: 'url', label: 'URL Scan', icon: Link2 },
];

const PIPELINE_STEPS = [
  { id: 'input', label: 'Input Ingestion', desc: 'Sanitizing and tokenizing input characters' },
  { id: 'preprocess', label: 'Preprocessing & Cleaning', desc: 'Homoglyph & URL normalization' },
  { id: 'features', label: 'Feature Extraction', desc: 'TF-IDF n-grams + subword embeddings' },
  { id: 'ai-model', label: 'Dual Model Inference', desc: 'DistilBERT Transformer + SVM baseline' },
  { id: 'decision', label: 'Robustness Decision Engine', desc: 'Ensemble confidence & adversarial check' },
];

export const ScanPreview: React.FC<{ id?: string }> = ({ id }) => {
  const [activeTab, setActiveTab] = useState('text');
  const [inputContent, setInputContent] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [showDemoResult, setShowDemoResult] = useState(false);

  const handleStartDemoScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setShowDemoResult(false);
    setCurrentStepIndex(0);
  };

  useEffect(() => {
    if (!isScanning) return;

    if (currentStepIndex < PIPELINE_STEPS.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      const finishTimer = setTimeout(() => {
        setIsScanning(false);
        setShowDemoResult(true);
      }, 900);
      return () => clearTimeout(finishTimer);
    }
  }, [isScanning, currentStepIndex]);

  const handleLoadSample = (sampleText: string) => {
    setInputContent(sampleText);
    setShowDemoResult(false);
  };

  const handleReset = () => {
    setInputContent('');
    setIsScanning(false);
    setCurrentStepIndex(-1);
    setShowDemoResult(false);
  };

  return (
    <div id={id} className="w-full">
      <GlassCard className="p-6 sm:p-8 relative overflow-hidden">
        {/* Header and Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold tracking-widest text-primary-bright uppercase">
                Interactive Scanner
              </span>
              <Badge variant="demo" size="sm">
                PHASE 1 SIMULATION
              </Badge>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-text">
              AI THREAT ANALYSIS
            </h2>
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-2/80 border border-border/80 self-start sm:self-auto overflow-x-auto max-w-full">
            {SCAN_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
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
        </div>

        {/* Scan Input Area */}
        <div className="mt-6 space-y-4">
          <div className="relative">
            <textarea
              rows={4}
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              placeholder="Paste your suspicious message, email content, or link here..."
              disabled={isScanning}
              className="w-full bg-surface-2/70 border border-border/80 focus:border-cyber-cyan/70 rounded-2xl p-4 text-sm text-text placeholder-text-muted/70 focus:outline-none focus:ring-2 focus:ring-cyber-cyan/20 transition-all font-sans resize-none"
            />

            {/* Quick Sample Selector */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-[11px] text-text-muted flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyber-cyan" /> Try Demo Sample:
              </span>
              {DEMO_SAMPLE_MESSAGES.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleLoadSample(sample.content)}
                  disabled={isScanning}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-surface-2 hover:bg-surface-3 border border-border hover:border-primary-bright/40 text-text-muted hover:text-text transition-colors"
                >
                  {sample.category}
                </button>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-text-muted hidden sm:inline">
              Dual-engine AI pipeline ready for simulation
            </span>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              {(inputContent || showDemoResult) && (
                <GlowButton
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                  disabled={isScanning}
                >
                  Reset
                </GlowButton>
              )}

              <GlowButton
                size="md"
                variant="primary"
                onClick={handleStartDemoScan}
                isLoading={isScanning}
                rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
              >
                {isScanning ? 'Simulating Pipeline...' : 'Scan with AI'}
              </GlowButton>
            </div>
          </div>
        </div>

        {/* Pipeline Animation State */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-border/60"
            >
              <div className="text-xs font-mono uppercase tracking-wider text-cyber-cyan mb-4 flex items-center justify-between">
                <span>Executing Pipeline Simulation</span>
                <span>Step {currentStepIndex + 1} of {PIPELINE_STEPS.length}</span>
              </div>

              {/* Progress Stepper */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {PIPELINE_STEPS.map((step, idx) => {
                  const isDone = idx < currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div
                      key={step.id}
                      className={`p-3 rounded-xl border transition-all duration-300 ${
                        isCurrent
                          ? 'bg-primary/20 border-cyber-cyan/60 shadow-cyan-glow'
                          : isDone
                          ? 'bg-surface-2/90 border-cyber-success/40'
                          : 'bg-surface-2/40 border-border/40 opacity-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-bold text-text-muted">
                          0{idx + 1}
                        </span>
                        {isDone ? (
                          <CheckCircle className="w-3.5 h-3.5 text-cyber-success" />
                        ) : isCurrent ? (
                          <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-ping" />
                        ) : null}
                      </div>
                      <p className="text-xs font-semibold text-text truncate">{step.label}</p>
                      <p className="text-[10px] text-text-muted truncate mt-0.5">{step.desc}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Simulated Demo Result Placeholder */}
        <AnimatePresence>
          {showDemoResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-6 pt-6 border-t border-border/60"
            >
              <div className="p-5 rounded-2xl bg-gradient-to-r from-surface-2 via-surface-3/50 to-surface-2 border border-cyber-cyan/30 shadow-cyan-glow">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-cyber-danger/15 border border-cyber-danger/30 text-cyber-danger">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-text">
                          Phishing Threat Pattern Detected (Demo Preview)
                        </span>
                        <Badge variant="danger" size="sm">
                          HIGH CONFIDENCE
                        </Badge>
                      </div>
                      <p className="text-xs text-text-muted mt-0.5">
                        Feature extraction flagged credential harvesting tokens and domain homoglyph anomalies.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-auto">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-mono text-text-muted block">
                        Threat Score
                      </span>
                      <span className="text-lg font-bold text-cyber-danger font-mono">
                        94.8%
                      </span>
                    </div>
                    <Badge variant="demo">DEMO VERDICT</Badge>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] font-mono text-text-muted">
                  <span>Pipeline: TF-IDF + SVM + DistilBERT Ensemble</span>
                  <span className="text-cyber-cyan">Phase 1 Visual Simulation • Backend API will connect in Phase 4</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </div>
  );
};

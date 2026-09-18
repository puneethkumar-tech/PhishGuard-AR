'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Play,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  X,
  Shield,
  Scan,
  FlaskConical,
  LayoutDashboard,
  Cpu,
  History,
  FileText,
  Bell,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface GuidedDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DemoStep {
  stepNumber: number;
  title: string;
  category: string;
  route: string;
  icon: React.ReactNode;
  summary: string;
  keyHighlights: string[];
  actionLabel: string;
}

export const GuidedDemoModal: React.FC<GuidedDemoModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const demoSteps: DemoStep[] = [
    {
      stepNumber: 1,
      title: 'Payload Ingestion & Ingestion Channels',
      category: '1. Scan Ingestion',
      route: '/scan',
      icon: <Scan className="w-5 h-5 text-cyan-400" />,
      summary:
        'PhishGuard-AR ingests raw email headers, SMS lures, web URLs, and attachment metadata across multi-format channels.',
      keyHighlights: [
        'Select from 5 real-world attack scenarios (Credential Phish, Homoglyph, BEC, etc.)',
        'Interactive character and word count telemetry',
        'Synchronized with reactive 3D AI Cyber Robot assistant',
      ],
      actionLabel: 'Go to Threat Scanner',
    },
    {
      stepNumber: 2,
      title: 'Multi-Stage Neural Pipeline Execution',
      category: '2. Pipeline Animation',
      route: '/scan',
      icon: <Cpu className="w-5 h-5 text-purple-400" />,
      summary:
        'Executes 4-stage pipeline: Payload Ingestion → Signal Extraction → Dual-Engine Neural Inference → Threat Classification.',
      keyHighlights: [
        'Parallelized Linear SVM + Multilingual DistilBERT transformer passes',
        'State-driven robot mode changes (IDLE → SCANNING → ANALYZING)',
        'Real-time token entropy calculation and Unicode confusable detection',
      ],
      actionLabel: 'Inspect Pipeline Flow',
    },
    {
      stepNumber: 3,
      title: 'Calibrated Threat Verdict & Severity Assessment',
      category: '3. Threat Result',
      route: '/scan',
      icon: <Shield className="w-5 h-5 text-red-400" />,
      summary:
        'Generates comprehensive threat score, severity classification, and confidence calibration gauges.',
      keyHighlights: [
        'High-confidence phishing indicators and confidence interpretation bar',
        'Color-coded severity tiers (CRITICAL, HIGH, MEDIUM, LOW, SAFE)',
        'Actionable immediate mitigation directives for SecOps responders',
      ],
      actionLabel: 'View Threat Verdict',
    },
    {
      stepNumber: 4,
      title: 'Forensic Investigation Workspace & Explainability',
      category: '4. Deep Forensics',
      route: '/scan',
      icon: <FileText className="w-5 h-5 text-blue-400" />,
      summary:
        'Multi-tab investigation deck with visual token highlights, URL forensics, character homoglyph mappings, and MITRE ATT&CK tactics.',
      keyHighlights: [
        'Interactive token highlight inspects individual deceptive words',
        'Character entropy analysis detecting Unicode Cyrillic substitutions',
        'Signal contribution weights and STIX 2.1 JSON export package',
      ],
      actionLabel: 'Explore Forensics Deck',
    },
    {
      stepNumber: 5,
      title: 'Adversarial Robustness Stress-Testing Lab',
      category: '5. Robustness Lab',
      route: '/robustness',
      icon: <FlaskConical className="w-5 h-5 text-orange-400" />,
      summary:
        'Stress-tests NLP detectors against homoglyphs, zero-width spaces, and semantic synonym substitutions, evaluating defensive recovery.',
      keyHighlights: [
        'Side-by-side comparison: Baseline Model vs Attacked Input vs AR Hardened Model',
        'Recovery rate delta (+28 pts) through Unicode NFKC & semantic embeddings',
        'Attack-defense chain visualization and perturbation diff viewer',
      ],
      actionLabel: 'Open Robustness Lab',
    },
    {
      stepNumber: 6,
      title: 'Security Operations Analytics & Posture Telemetry',
      category: '6. Analytics Dashboard',
      route: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5 text-cyan-400" />,
      summary:
        'Enterprise SOC dashboard tracking threat volume, severity distributions, detection accuracy (99.2%), and defense stability across 24H/7D/30D windows.',
      keyHighlights: [
        'Overall Security Posture Score (88/100 Optimal Resilience)',
        'Live simulated incident stream with direct forensic drill-down links',
        'Detection performance breakdown across SVM, DistilBERT, and Fusion',
      ],
      actionLabel: 'Open SOC Dashboard',
    },
    {
      stepNumber: 7,
      title: 'AI Intelligence Core & 3D Neural Network',
      category: '7. AI Visualizations',
      route: '/dashboard/intelligence',
      icon: <Cpu className="w-5 h-5 text-purple-400" />,
      summary:
        'Immersive 3D React Three Fiber neural network visualizer with 5 specialized inspection modes.',
      keyHighlights: [
        '5 Intelligence Modes: Pipeline, Neural Network, Signal Fusion, Threat Constellation, Explainability',
        'Interactive 3D node activation inspection and traveling pulse beams',
        'Token attention weight heatmaps and signal orbit system',
      ],
      actionLabel: 'Launch 3D AI Intelligence',
    },
    {
      stepNumber: 8,
      title: 'Threat Scan Audit History & Forensics Archive',
      category: '8. Threat History',
      route: '/history',
      icon: <History className="w-5 h-5 text-cyan-400" />,
      summary:
        'Full historical audit log of previous threat scans, adversarial evaluations, and benign verifications with localStorage persistence.',
      keyHighlights: [
        '10 deterministic audit logs (PHG-0001 through PHG-0010)',
        'Dual View: Rich Data Table or 6-Stage SOC Investigation Timeline',
        'Multidimensional filters by channel, verdict, severity, and AI model',
      ],
      actionLabel: 'Browse Threat History',
    },
    {
      stepNumber: 9,
      title: 'Security Intelligence Dossiers & Export Hub',
      category: '9. Forensic Reports',
      route: '/reports',
      icon: <FileText className="w-5 h-5 text-yellow-400" />,
      summary:
        'Generate, inspect, and export 12-section standardized cybersecurity intelligence dossiers.',
      keyHighlights: [
        'Report Generator with custom section inclusions and source selection',
        'Full 12-section preview deck with executive summaries and attack context',
        'Real client-side JSON, TXT, CSV Blob downloads + simulated PDF export',
      ],
      actionLabel: 'Generate Security Report',
    },
    {
      stepNumber: 10,
      title: 'SOC Incident Alert Center & Realtime Telemetry',
      category: '10. Alert Center',
      route: '/alerts',
      icon: <Bell className="w-5 h-5 text-red-400" />,
      summary:
        'Real-time simulated incident triage deck for SOC analysts with acknowledgements, resolutions, and event feeds.',
      keyHighlights: [
        'Critical, High, Medium, Low severity counters and status filters',
        'SOC Event Chronology Stream with microsecond timecodes',
        'Persistent triage state in browser localStorage with zero backend dependencies',
      ],
      actionLabel: 'Review Alert Center',
    },
  ];

  if (!isOpen) return null;

  const currentStep = demoSteps[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < demoSteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleNavigateToRoute = () => {
    onClose();
    router.push(currentStep.route);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden relative flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-border bg-surface-2/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 border border-cyan-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-text">
                  PhishGuard-AR Guided Demonstration
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 font-bold border border-cyan-500/30">
                  STEP {currentStepIndex + 1} OF {demoSteps.length}
                </span>
              </div>
              <p className="text-xs text-text-muted">
                Explore the complete end-to-end frontend cybersecurity AI demonstration.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-3 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progression Indicators */}
        <div className="flex items-center gap-1 px-5 pt-3 overflow-x-auto">
          {demoSteps.map((step, idx) => (
            <button
              key={step.stepNumber}
              onClick={() => setCurrentStepIndex(idx)}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                idx === currentStepIndex
                  ? 'bg-cyan-500'
                  : idx < currentStepIndex
                  ? 'bg-cyan-500/40'
                  : 'bg-surface-3'
              }`}
              title={`Step ${step.stepNumber}: ${step.title}`}
            />
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 flex-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-surface-2 border border-border shrink-0">
              {currentStep.icon}
            </div>
            <div>
              <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-semibold uppercase">
                {currentStep.category}
              </span>
              <h4 className="text-lg font-bold text-text">{currentStep.title}</h4>
            </div>
          </div>

          <p className="text-xs text-text-muted leading-relaxed">{currentStep.summary}</p>

          <div className="space-y-2 p-4 rounded-xl bg-surface-2/60 border border-border">
            <span className="text-[11px] font-mono font-bold text-text uppercase tracking-wider block">
              Key Platform Highlights:
            </span>
            <ul className="space-y-1.5 text-xs text-text-muted">
              {currentStep.keyHighlights.map((highlight, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400 shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Navigation Controls */}
        <div className="p-4 border-t border-border bg-surface-2/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStepIndex(0)}
              className="p-2 rounded-xl text-xs font-mono text-text-muted hover:text-text hover:bg-surface-3 transition-colors flex items-center gap-1"
              title="Restart Tour"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restart</span>
            </button>

            <button
              onClick={handleNavigateToRoute}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-3 hover:bg-surface-2 text-xs font-mono text-cyan-600 dark:text-cyan-300 border border-border hover:border-cyan-500/40 transition-all font-semibold"
            >
              <span>{currentStep.actionLabel}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-mono text-text-muted hover:text-text disabled:opacity-30 disabled:pointer-events-none hover:bg-surface-3 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            {currentStepIndex < demoSteps.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-mono font-bold shadow-md shadow-cyan-500/20 transition-all"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleNavigateToRoute}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-600 hover:from-cyan-400 hover:to-emerald-500 text-white text-xs font-mono font-bold shadow-md shadow-emerald-500/20 transition-all"
              >
                <span>Complete & Launch</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

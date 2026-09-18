'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { RobotSceneContainer } from '@/components/ai/RobotSceneContainer';
import { ScanPipelineProgress } from '@/components/scan/ScanPipelineProgress';
import { ScanDualPipelineVisual } from '@/components/scan/ScanDualPipelineVisual';
import { ForensicWorkspace } from '@/components/results/ForensicWorkspace';
import {
  FileText,
  Mail,
  UploadCloud,
  Link2,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  ArrowRight,
  Copy,
  Check,
  Activity,
} from 'lucide-react';
import { DEMO_SAMPLE_MESSAGES } from '@/lib/demo-data';
import { analyzeDemoThreat } from '@/lib/scan-engine';
import { RobotState, ScanResult, DemoScanSample } from '@/types';

const SCAN_TABS = [
  { id: 'text', label: 'TEXT', icon: FileText, placeholder: 'Paste suspicious message, SMS lure, or communication tokens...' },
  { id: 'email', label: 'EMAIL HEADER', icon: Mail, placeholder: 'Paste raw email RFC 822 headers and MIME body text here (HEADER ANALYSIS READY)...' },
  { id: 'url', label: 'URL', icon: Link2, placeholder: 'Paste suspicious URL or domain (e.g., https://pаypаl-security.com) (URL ANALYSIS READY)...' },
  { id: 'upload', label: 'FILE', icon: UploadCloud, placeholder: 'Paste file metadata or attachment content (FILE READY FOR SIMULATION)...' },
];

export default function ScanPage() {
  const [activeTab, setActiveTab] = useState<'text' | 'email' | 'url' | 'upload'>('text');
  const [inputText, setInputText] = useState(DEMO_SAMPLE_MESSAGES[0].content);
  const [robotState, setRobotState] = useState<RobotState>('IDLE');
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'completed'>('idle');
  const [currentStage, setCurrentStage] = useState(0);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const characterCount = inputText.length;
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;

  // Execute synchronized scan pipeline with robot state machine
  const handleStartScan = () => {
    if (!inputText.trim() || scanState === 'scanning') return;
    setScanState('scanning');
    setCurrentStage(0);
    setRobotState('SCANNING');
  };

  useEffect(() => {
    if (scanState !== 'scanning') return;

    let timer: NodeJS.Timeout;

    if (currentStage === 0) {
      // INGESTING stage -> Robot in SCANNING
      setRobotState('SCANNING');
      timer = setTimeout(() => setCurrentStage(1), 650);
    } else if (currentStage === 1) {
      // EXTRACTING SIGNALS -> Robot in ANALYZING
      setRobotState('ANALYZING');
      timer = setTimeout(() => setCurrentStage(2), 700);
    } else if (currentStage === 2) {
      // NEURAL ANALYZING -> Robot continues ANALYZING
      setRobotState('ANALYZING');
      timer = setTimeout(() => setCurrentStage(3), 800);
    } else if (currentStage === 3) {
      // THREAT ASSESSMENT -> Robot detects threat or safe state
      const result = analyzeDemoThreat(inputText, activeTab);
      setScanResult(result);
      if (result.threatLevel === 'safe') {
        setRobotState('PROTECTED');
      } else {
        setRobotState('THREAT_DETECTED');
      }
      timer = setTimeout(() => setCurrentStage(4), 850);
    } else if (currentStage === 4) {
      // EXPLANATION / FINAL STAGE
      timer = setTimeout(() => {
        setScanState('completed');
        if (scanResult?.threatLevel !== 'safe') {
          setRobotState('EXPLAINING');
          setTimeout(() => setRobotState('PROTECTED'), 2000);
        } else {
          setRobotState('PROTECTED');
        }

        // Scroll result workspace into view
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
      }, 650);
    }

    return () => clearTimeout(timer);
  }, [scanState, currentStage, inputText, activeTab, scanResult]);

  const handleLoadSample = (sample: DemoScanSample) => {
    setInputText(sample.content);
    setActiveTab(sample.mode);
    setScanState('idle');
    setCurrentStage(0);
    setRobotState('IDLE');
    setScanResult(null);
  };

  const handleClear = () => {
    setInputText('');
    setScanState('idle');
    setCurrentStage(0);
    setRobotState('IDLE');
    setScanResult(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleForensicTabChange = (tabId: string) => {
    if (tabId === 'models') {
      setRobotState('ANALYZING');
    } else if (tabId === 'robustness' || tabId === 'overview') {
      setRobotState('PROTECTED');
    } else if (tabId === 'evidence' || tabId === 'attack') {
      setRobotState('EXPLAINING');
    }
  };

  const currentTabObj = SCAN_TABS.find((t) => t.id === activeTab) || SCAN_TABS[0];

  return (
    <PageContainer>
      {/* 1. Standardized Page Header */}
      <PageHeader
        eyebrow="AI THREAT SCANNER & FORENSICS"
        title="AI Threat Scanner & Forensic Workspace"
        description="Analyze suspicious messages, URLs, and communication signals with real-time AI Cyber Robot synchronization and multi-tier explainability."
        statusBadge={{
          label: robotState === 'IDLE' ? 'AI Ready' : robotState.replace('_', ' '),
          variant: robotState === 'THREAT_DETECTED' ? 'danger' : robotState === 'PROTECTED' ? 'success' : 'cyan',
          dot: true,
        }}
      />

      {/* 2. Top Interactive Scanner & AI Robot Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Columns: Scanner Input Card */}
        <div className="lg:col-span-7 space-y-6">
          <GlassCard className="p-6 sm:p-7 space-y-5">
            {/* Mode Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/70">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-2/80 border border-border/80 overflow-x-auto max-w-full">
                {SCAN_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as any);
                        if (scanState === 'completed') setScanState('idle');
                      }}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
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

              <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
                <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
                <span>Frontend AI Demo</span>
              </div>
            </div>

            {/* Input Textarea & Counter */}
            <div className="space-y-3">
              <div className="relative">
                <textarea
                  rows={5}
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    if (scanState === 'completed') setScanState('idle');
                  }}
                  placeholder={currentTabObj.placeholder}
                  disabled={scanState === 'scanning'}
                  className="w-full bg-surface-2/90 border border-border/80 focus:border-cyber-cyan/70 rounded-2xl p-4 text-xs sm:text-sm text-text placeholder-text-muted/60 focus:outline-none focus:ring-2 focus:ring-cyber-cyan/20 transition-all font-sans resize-none"
                />

                {inputText && (
                  <button
                    onClick={handleCopy}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-surface-3 text-text-muted hover:text-text border border-border/70 transition-colors"
                    title="Copy Content"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-cyber-success" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              {/* Demo Sample Selector Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-text-muted font-mono flex items-center gap-1 mr-1">
                    <Sparkles className="w-3.5 h-3.5 text-cyber-cyan" /> DEMO SAMPLES:
                  </span>
                  {DEMO_SAMPLE_MESSAGES.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleLoadSample(sample)}
                      disabled={scanState === 'scanning'}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-surface-2 hover:bg-surface-3 border border-border hover:border-primary-bright/50 text-text-muted hover:text-text transition-colors"
                    >
                      {sample.title}
                    </button>
                  ))}
                </div>

                {/* Character & Word Count */}
                <div className="text-[11px] font-mono text-text-muted flex items-center gap-1.5">
                  <span>{characterCount} chars</span>
                  <span>•</span>
                  <span>{wordCount} words</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-border/60">
                <div className="flex items-center gap-2">
                  {inputText && (
                    <GlowButton
                      variant="ghost"
                      size="sm"
                      onClick={handleClear}
                      disabled={scanState === 'scanning'}
                      leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                    >
                      Clear
                    </GlowButton>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <GlowButton
                    size="md"
                    variant="primary"
                    onClick={handleStartScan}
                    disabled={!inputText.trim()}
                    isLoading={scanState === 'scanning'}
                    rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
                  >
                    {scanState === 'scanning' ? 'Scanning Payload...' : 'ANALYZE WITH PHISHGUARD AI'}
                  </GlowButton>
                </div>
              </div>
            </div>

            {/* 3. Multi-Stage Pipeline Progress Indicator */}
            <AnimatePresence>
              {scanState === 'scanning' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-border/60"
                >
                  <ScanPipelineProgress currentStageIndex={currentStage} />
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        </div>

        {/* Right 5 Columns: 3D AI Cyber Robot, Status & Architecture */}
        <div className="lg:col-span-5 space-y-6">
          {/* 3D Cyber Robot Canvas */}
          <GlassCard className="p-4 sm:p-5 relative overflow-hidden flex flex-col items-center">
            <div className="w-full flex items-center justify-between pb-3 border-b border-border/70 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/20 text-cyber-cyan border border-cyber-cyan/30">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text">AI CYBER ANALYST</h4>
                  <span className="text-[10px] text-text-muted font-mono">
                    Mode: {robotState.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                robotState === 'THREAT_DETECTED'
                  ? 'bg-cyber-danger/15 text-cyber-danger border-cyber-danger/30'
                  : robotState === 'PROTECTED'
                  ? 'bg-cyber-success/15 text-cyber-success border-cyber-success/30'
                  : 'bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan/30'
              }`}>
                ● {robotState === 'IDLE' ? 'AI READY' : robotState.replace('_', ' ')}
              </span>
            </div>

            {/* Interactive 3D Robot Canvas */}
            <div className="w-full h-[360px] sm:h-[400px]">
              <RobotSceneContainer state={robotState} />
            </div>

            <p className="text-[10px] font-mono text-text-muted text-center pt-2">
              DRAG TO ROTATE 3D ROBOT • SYNCHRONIZED WITH SCAN PIPELINE
            </p>
          </GlassCard>

          {/* AI Status & Pipeline Flow Visual */}
          <ScanDualPipelineVisual />

          {/* SecOps Status Card */}
          <GlassCard className="p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-text-muted flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyber-cyan" />
                ENGINE PIPELINE:
              </span>
              <span className="text-cyber-cyan font-bold">DUAL AI ENSEMBLE</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-text-muted">CALIBRATION:</span>
              <span className="text-text font-bold">ADVERSARIAL HARDENED</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-text-muted">OPERATIONAL MODE:</span>
              <span className="text-cyber-success font-bold">FRONTEND SIMULATION</span>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* 3. Phase 5 Flagship Forensic Investigation Workspace (Appears on scan completion) */}
      <div ref={resultRef}>
        <AnimatePresence>
          {scanState === 'completed' && scanResult && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="mt-8"
            >
              <GlassCard className="p-6 sm:p-8 space-y-6">
                <ForensicWorkspace
                  result={scanResult}
                  onRunAgain={handleStartScan}
                  onTabChange={handleForensicTabChange}
                />
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageContainer>
  );
}

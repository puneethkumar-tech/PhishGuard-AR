'use client';

import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Sliders,
  CheckSquare,
  Square,
  ArrowRight,
  X,
  ShieldCheck,
} from 'lucide-react';
import { ReportRecord, ReportType, ThreatVerdict, ThreatSeverityLevel } from '@/types';
import { addReportRecord } from '@/lib/storage';

interface ReportGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onReportCreated: (report: ReportRecord) => void;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  isOpen,
  onClose,
  onReportCreated,
}) => {
  const [reportType, setReportType] = useState<ReportType>('EXECUTIVE_SUMMARY');
  const [source, setSource] = useState<string>('LATEST_SCAN');
  const [title, setTitle] = useState<string>('');
  const [options, setOptions] = useState({
    includeEvidence: true,
    includeModelAnalysis: true,
    includeAttackContext: true,
    includeRobustness: true,
    includeRecommendations: true,
    includeTimeline: true,
  });

  if (!isOpen) return null;

  const handleToggleOption = (key: keyof typeof options) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleGenerate = () => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newId = `RPT-${new Date().getFullYear()}-${Math.floor(1000 + (Date.now() % 9000))}`;

    const reportTitle =
      title.trim() ||
      `${reportType.replace('_', ' ')}: ${
        source === 'ROBUSTNESS_TEST'
          ? 'Adversarial Robustness Evaluation Brief'
          : 'Multi-Signal Security Threat Assessment'
      }`;

    const newReport: ReportRecord = {
      id: newId,
      title: reportTitle,
      reportType,
      sourceLabel:
        source === 'LATEST_SCAN'
          ? 'Latest Scan Evaluation (Simulated)'
          : source === 'ROBUSTNESS_TEST'
          ? 'Phase 6 Adversarial Lab Run'
          : 'Demo Scenario Harvest Record',
      verdict: source === 'SAFE_SAMPLE' ? 'SAFE' : 'PHISHING',
      severity: source === 'SAFE_SAMPLE' ? 'SAFE' : 'CRITICAL',
      confidence: source === 'SAFE_SAMPLE' ? 3.5 : 96.4,
      robustnessScore: 92.0,
      createdAt: timestamp,
      status: 'GENERATED',
      executiveSummary: `Automated ${reportType.replace(
        '_',
        ' '
      )} synthesized by the PhishGuard-AR dual-engine. Multi-signal Bayesian fusion combined text extraction, URL forensics, and multilingual transformer embeddings to establish a calibrated threat verdict.`,
      evidence: [
        'Lexical urgency markers detected in payload headers.',
        'High Shannon entropy identified on destination URL endpoints.',
        'Brand mimicry of authenticated enterprise portal.',
        'Zero-width noise sanitized during pre-processing.',
      ],
      modelAnalysis: {
        svmConfidence: 94.2,
        distilbertConfidence: 96.1,
        fusionScore: 96.4,
        concordanceIndex: '98.2% High Concordance',
      },
      attackContext: {
        tactic: 'TA0001 Initial Access',
        technique: 'T1566.002 Spearphishing Link',
        notes: 'Adversary leverages deceptive communications to capture enterprise credentials.',
      },
      robustnessAssessment: {
        baselineAccuracy: 94.2,
        underAttackAccuracy: 68.4,
        hardenedAccuracy: 92.0,
        resilienceRating: 'HIGH',
      },
      defenseInterpretation:
        'PhishGuard-AR Phase 6 adversarial defense regularizers maintained reliable classification bounds under perturbation.',
      recommendations: [
        'Perimeter firewall block on identified lookalike domains.',
        'Issue targeted user security awareness training briefing.',
        'Enforce FIDO2 passwordless Multi-Factor Authentication.',
      ],
      timeline: [
        { time: '00:00.12', stage: 'Payload Ingest', description: 'Raw stream parsed and normalized.' },
        { time: '00:00.48', stage: 'Feature Extraction', description: 'N-grams and structural signals computed.' },
        { time: '00:01.35', stage: 'Model Analysis', description: 'DistilBERT self-attention weights generated.' },
        { time: '00:02.32', stage: 'Signal Fusion', description: 'Cross-layer Bayesian synthesis completed.' },
        { time: '00:02.75', stage: 'Verdict Output', description: 'Report dossier generated in local audit storage.' },
      ],
    };

    addReportRecord(newReport);
    onReportCreated(newReport);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-cyan-500/30 bg-slate-950 p-6 font-mono text-xs shadow-[0_0_50px_rgba(6,182,212,0.15)] space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-500/20 text-cyan-300">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                Generate Security Report
              </h3>
              <p className="text-[10px] text-slate-400">
                Configure simulated forensic dossier parameters
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:text-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Custom Title Input */}
        <div>
          <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
            Report Title (Optional)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Executive Threat Briefing: Q3 Phishing Audit"
            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
          />
        </div>

        {/* Report Type Selector */}
        <div>
          <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1.5">
            Report Type
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as ReportType)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
          >
            <option value="EXECUTIVE_SUMMARY">Executive Security Summary</option>
            <option value="THREAT_ANALYSIS">Threat Analysis Dossier</option>
            <option value="FORENSIC_ANALYSIS">Forensic Deep-Dive</option>
            <option value="ROBUSTNESS_ASSESSMENT">Robustness Assessment Brief</option>
            <option value="FULL_SECURITY_ANALYSIS">Full Multi-Modal Security Analysis</option>
          </select>
        </div>

        {/* Source Selector */}
        <div>
          <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1.5">
            Data Source
          </label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
          >
            <option value="LATEST_SCAN">Latest Scan (Record #PHG-0001)</option>
            <option value="ROBUSTNESS_TEST">Adversarial Lab Run (Homoglyph Evasion)</option>
            <option value="DEMO_SCENARIO">Corporate Payroll Lure Scenario</option>
            <option value="SAFE_SAMPLE">Clean Baseline Meeting Notice</option>
          </select>
        </div>

        {/* Report Sections Checkboxes */}
        <div>
          <label className="text-[10px] text-slate-400 uppercase font-bold block mb-2">
            Include Report Sections
          </label>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {[
              { key: 'includeEvidence' as const, label: 'Evidence & IoCs' },
              { key: 'includeModelAnalysis' as const, label: 'Multi-Model Analysis' },
              { key: 'includeAttackContext' as const, label: 'MITRE ATT&CK Context' },
              { key: 'includeRobustness' as const, label: 'Robustness Assessment' },
              { key: 'includeRecommendations' as const, label: 'SOC Recommendations' },
              { key: 'includeTimeline' as const, label: 'Analysis Execution Timeline' },
            ].map((sec) => (
              <button
                key={sec.key}
                type="button"
                onClick={() => handleToggleOption(sec.key)}
                className={`flex items-center gap-2 rounded-lg border p-2 text-left transition-colors ${
                  options[sec.key]
                    ? 'border-cyan-500/40 bg-cyan-500/10 text-slate-200'
                    : 'border-slate-800 bg-slate-900/40 text-slate-500'
                }`}
              >
                {options[sec.key] ? (
                  <CheckSquare className="h-4 w-4 text-cyan-400" />
                ) : (
                  <Square className="h-4 w-4 text-slate-600" />
                )}
                <span>{sec.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800/80 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-1.5 text-slate-300 hover:text-slate-100"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleGenerate}
            className="inline-flex items-center gap-2 rounded-lg border border-cyan-400 bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-1.5 font-bold text-slate-950 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all"
          >
            <Sparkles className="h-4 w-4 fill-slate-950" />
            <span>Generate Report — DEMO</span>
          </button>
        </div>
      </div>
    </div>
  );
};

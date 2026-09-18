'use client';

import React from 'react';
import {
  FileText,
  Download,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FlaskConical,
  Clock,
  Layers,
  CheckCircle2,
  X,
  Printer,
  Copy,
  Tag,
  Cpu,
} from 'lucide-react';
import { ReportRecord } from '@/types';

interface ReportPreviewProps {
  report: ReportRecord | null;
  onClose: () => void;
  onOpenExport: (report: ReportRecord) => void;
}

export const ReportPreview: React.FC<ReportPreviewProps> = ({
  report,
  onClose,
  onOpenExport,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!report) return null;

  const handleCopySummary = () => {
    navigator.clipboard.writeText(
      `${report.title}\nID: ${report.id}\nVerdict: ${report.verdict} (${report.confidence.toFixed(1)}%)\n\n${report.executiveSummary}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getVerdictBadgeColor = () => {
    switch (report.verdict) {
      case 'SAFE':
        return 'text-emerald-400 bg-emerald-500/15 border-emerald-500/40';
      case 'SUSPICIOUS':
        return 'text-amber-400 bg-amber-500/15 border-amber-500/40';
      case 'ADVERSARIAL':
        return 'text-violet-400 bg-violet-500/15 border-violet-500/40';
      case 'BLOCKED':
      case 'PHISHING':
      default:
        return 'text-rose-400 bg-rose-500/15 border-rose-500/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl border border-cyan-500/30 bg-slate-950 p-6 sm:p-8 font-mono text-xs shadow-[0_0_50px_rgba(6,182,212,0.15)] space-y-6">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
          <div className="flex items-center gap-2">
            <span className="rounded bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 uppercase">
              {report.reportType.replace('_', ' ')}
            </span>
            <span className="text-slate-400 text-[10px]">ID: {report.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-slate-300 hover:text-slate-100 transition-colors"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenExport(report)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400 bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1 font-bold text-slate-950 hover:shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Dossier</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-900 hover:text-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 1. Report Header */}
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-bold text-slate-100 leading-snug">
            {report.title}
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
            <span>Source: {report.sourceLabel}</span>
            <span>•</span>
            <span>Generated: {report.createdAt}</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">Status: {report.status}</span>
          </div>
        </div>

        {/* 2. Verdict & Telemetry Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Verdict</span>
            <div className="mt-1">
              <span
                className={`inline-block rounded-full border px-3 py-0.5 text-[10px] font-bold uppercase ${getVerdictBadgeColor()}`}
              >
                {report.verdict}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Confidence Score</span>
            <div className="mt-1 text-xl font-extrabold text-cyan-400">
              {report.confidence.toFixed(1)}%
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Threat Severity</span>
            <div className="mt-1 text-xl font-extrabold text-slate-100">{report.severity}</div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Robustness Score</span>
            <div className="mt-1 text-xl font-extrabold text-amber-400">
              {report.robustnessScore.toFixed(0)}%
            </div>
          </div>
        </div>

        {/* 3. Executive Summary */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            1. Executive Summary
          </h4>
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-slate-200 leading-relaxed">
            {report.executiveSummary}
          </div>
        </div>

        {/* 4. Flagged Evidence & Indicators */}
        {report.evidence && report.evidence.length > 0 && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              2. Key Evidence & Indicators of Threat
            </h4>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <ul className="space-y-2">
                {report.evidence.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-slate-300 text-[11px]">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 5. Multi-Model Analysis & Concordance */}
        {report.modelAnalysis && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              3. Multi-Model Dual-Engine Analysis
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-3">
                <span className="text-[10px] text-blue-400 uppercase font-bold">
                  Branch A: TF-IDF + SVM
                </span>
                <div className="text-lg font-bold text-slate-100 mt-1">
                  {report.modelAnalysis.svmConfidence.toFixed(1)}%
                </div>
                <div className="text-[9px] text-slate-400">Lexical Decision Score</div>
              </div>

              <div className="rounded-xl border border-pink-500/30 bg-pink-950/20 p-3">
                <span className="text-[10px] text-pink-400 uppercase font-bold">
                  Branch B: DistilBERT AR
                </span>
                <div className="text-lg font-bold text-slate-100 mt-1">
                  {report.modelAnalysis.distilbertConfidence.toFixed(1)}%
                </div>
                <div className="text-[9px] text-slate-400">Multilingual Transformer</div>
              </div>

              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3">
                <span className="text-[10px] text-emerald-400 uppercase font-bold">
                  Bayesian Fusion Core
                </span>
                <div className="text-lg font-bold text-slate-100 mt-1">
                  {report.modelAnalysis.fusionScore.toFixed(1)}%
                </div>
                <div className="text-[9px] text-emerald-300 font-semibold">
                  {report.modelAnalysis.concordanceIndex}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. MITRE ATT&CK & Attack Context */}
        {report.attackContext && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              4. Attack Context & MITRE ATT&CK Mapping
            </h4>
            <div className="rounded-xl border border-violet-500/30 bg-violet-950/20 p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-violet-400 font-bold">
                <Tag className="h-4 w-4" />
                <span>
                  {report.attackContext.tactic} — {report.attackContext.technique}
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {report.attackContext.notes}
              </p>
            </div>
          </div>
        )}

        {/* 7. Robustness Assessment & Hardening */}
        {report.robustnessAssessment && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              5. Adversarial Robustness Assessment
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                <span className="text-[10px] text-slate-400 uppercase">Clean Baseline</span>
                <div className="text-base font-bold text-slate-100 mt-0.5">
                  {report.robustnessAssessment.baselineAccuracy.toFixed(1)}%
                </div>
              </div>

              <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3">
                <span className="text-[10px] text-rose-400 uppercase">Under Perturbation</span>
                <div className="text-base font-bold text-rose-400 mt-0.5">
                  {report.robustnessAssessment.underAttackAccuracy.toFixed(1)}%
                </div>
              </div>

              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3">
                <span className="text-[10px] text-emerald-400 uppercase">Hardened Accuracy</span>
                <div className="text-base font-bold text-emerald-400 mt-0.5">
                  {report.robustnessAssessment.hardenedAccuracy.toFixed(1)}%
                </div>
              </div>

              <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3">
                <span className="text-[10px] text-amber-400 uppercase">Resilience Rating</span>
                <div className="text-base font-bold text-amber-400 mt-0.5">
                  {report.robustnessAssessment.resilienceRating}
                </div>
              </div>
            </div>

            <div className="mt-2 rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-[11px] text-slate-300">
              {report.defenseInterpretation}
            </div>
          </div>
        )}

        {/* 8. SOC Recommendations */}
        {report.recommendations && report.recommendations.length > 0 && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              6. Actionable SOC Recommendations
            </h4>
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4">
              <ul className="space-y-2">
                {report.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-slate-200 text-[11px]">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold mt-0.5 flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 9. Execution Timeline */}
        {report.timeline && report.timeline.length > 0 && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              7. Analysis Execution Timeline
            </h4>
            <div className="space-y-1.5">
              {report.timeline.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-[11px]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] text-cyan-400 font-bold">
                      {step.time}
                    </span>
                    <span className="font-bold text-slate-200 uppercase">{step.stage}</span>
                  </div>
                  <span className="text-slate-400 text-[10px]">{step.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 text-[10px] text-slate-400">
          <span>● Simulated PhishGuard-AR forensic report. Local browser demonstration.</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-1.5 text-slate-300 hover:text-slate-100"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};

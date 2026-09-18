'use client';

import React, { useState } from 'react';
import {
  Download,
  FileCode,
  FileText,
  Table,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
} from 'lucide-react';
import { ReportRecord } from '@/types';

interface SimulatedExportModalProps {
  report: ReportRecord | null;
  onClose: () => void;
}

export const SimulatedExportModal: React.FC<SimulatedExportModalProps> = ({
  report,
  onClose,
}) => {
  const [downloadMessage, setDownloadMessage] = useState<string | null>(null);

  if (!report) return null;

  // JSON Export (Real client-side blob download)
  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(
      {
        phishguard_export_schema: 'PHISHGUARD_STIX_2.1_SIMULATION',
        report_id: report.id,
        generated_at: report.createdAt,
        title: report.title,
        report_type: report.reportType,
        source: report.sourceLabel,
        verdict: report.verdict,
        severity: report.severity,
        confidence_score: report.confidence,
        robustness_score: report.robustnessScore,
        executive_summary: report.executiveSummary,
        evidence: report.evidence,
        model_analysis: report.modelAnalysis,
        attack_context: report.attackContext,
        robustness_assessment: report.robustnessAssessment,
        soc_recommendations: report.recommendations,
        timeline: report.timeline,
        environment: 'DEMO_FRONTEND_ONLY',
      },
      null,
      2
    );

    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.id}_forensic_dossier_demo.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadMessage('JSON forensic bundle downloaded successfully (Client-Side Blob).');
    setTimeout(() => setDownloadMessage(null), 3000);
  };

  // TXT Export (Real client-side blob download)
  const handleExportTXT = () => {
    const txtContent = `=====================================================
PHISHGUARD-AR — FORENSIC SECURITY DOSSIER (SIMULATED)
=====================================================
Report ID:   ${report.id}
Generated:   ${report.createdAt}
Title:       ${report.title}
Report Type: ${report.reportType}
Verdict:     ${report.verdict}
Confidence:  ${report.confidence.toFixed(1)}%
Severity:    ${report.severity}
Robustness:  ${report.robustnessScore.toFixed(0)}%

EXECUTIVE SUMMARY:
${report.executiveSummary}

KEY EVIDENCE & INDICATORS:
${report.evidence.map((e, idx) => `  ${idx + 1}. ${e}`).join('\n')}

MODEL ANALYSIS:
  Linear SVM Confidence:       ${report.modelAnalysis.svmConfidence}%
  DistilBERT Transformer:     ${report.modelAnalysis.distilbertConfidence}%
  Bayesian Signal Fusion:     ${report.modelAnalysis.fusionScore}%
  Concordance Index:          ${report.modelAnalysis.concordanceIndex}

RECOMMENDATIONS:
${report.recommendations.map((r, idx) => `  [#${idx + 1}] ${r}`).join('\n')}

=====================================================
ENVIRONMENT: 100% FRONTEND DEMONSTRATION ONLY
=====================================================`;

    const blob = new Blob([txtContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.id}_briefing_demo.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadMessage('TXT Executive Briefing downloaded successfully.');
    setTimeout(() => setDownloadMessage(null), 3000);
  };

  // CSV Export (Real client-side blob download)
  const handleExportCSV = () => {
    const headers = 'ReportID,CreatedAt,Title,ReportType,Verdict,Severity,Confidence,RobustnessScore\n';
    const row = `"${report.id}","${report.createdAt}","${report.title.replace(/"/g, '""')}","${report.reportType}","${report.verdict}","${report.severity}",${report.confidence},${report.robustnessScore}\n`;
    const csvContent = headers + row;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.id}_metrics_demo.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadMessage('CSV Telemetry Table downloaded successfully.');
    setTimeout(() => setDownloadMessage(null), 3000);
  };

  // PDF Export Simulation
  const handleSimulatePDF = () => {
    setDownloadMessage('Simulating PDF compilation... (Frontend-Only Demo)');
    setTimeout(() => {
      setDownloadMessage('Report export prepared successfully — DEMO PDF (Simulated).');
      setTimeout(() => setDownloadMessage(null), 3500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-cyan-500/30 bg-slate-950 p-6 font-mono text-xs shadow-[0_0_50px_rgba(6,182,212,0.15)] space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-500/20 text-cyan-300">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                Export Security Dossier
              </h3>
              <p className="text-[10px] text-slate-400">Select export schema format</p>
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

        {/* Feedback Message */}
        {downloadMessage && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 p-3 text-emerald-300 text-xs">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            <span>{downloadMessage}</span>
          </div>
        )}

        {/* Export Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* JSON */}
          <button
            type="button"
            onClick={handleExportJSON}
            className="flex flex-col items-start rounded-xl border border-slate-800 bg-slate-900/70 p-3.5 hover:border-cyan-500/40 hover:bg-slate-900 transition-all text-left group"
          >
            <div className="flex items-center justify-between w-full">
              <FileCode className="h-5 w-5 text-cyan-400" />
              <span className="text-[9px] text-cyan-300 rounded bg-cyan-500/10 border border-cyan-500/30 px-1.5 py-0.2">
                CLIENT BLOB
              </span>
            </div>
            <span className="font-bold text-slate-100 text-xs mt-2">STIX / JSON Bundle</span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              Structured machine-readable forensic payload data.
            </span>
          </button>

          {/* TXT */}
          <button
            type="button"
            onClick={handleExportTXT}
            className="flex flex-col items-start rounded-xl border border-slate-800 bg-slate-900/70 p-3.5 hover:border-cyan-500/40 hover:bg-slate-900 transition-all text-left group"
          >
            <div className="flex items-center justify-between w-full">
              <FileText className="h-5 w-5 text-blue-400" />
              <span className="text-[9px] text-blue-300 rounded bg-blue-500/10 border border-blue-500/30 px-1.5 py-0.2">
                TEXT FILE
              </span>
            </div>
            <span className="font-bold text-slate-100 text-xs mt-2">Executive TXT Brief</span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              Clean terminal ASCII report briefing summary.
            </span>
          </button>

          {/* CSV */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex flex-col items-start rounded-xl border border-slate-800 bg-slate-900/70 p-3.5 hover:border-cyan-500/40 hover:bg-slate-900 transition-all text-left group"
          >
            <div className="flex items-center justify-between w-full">
              <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
              <span className="text-[9px] text-emerald-300 rounded bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.2">
                CSV TABLE
              </span>
            </div>
            <span className="font-bold text-slate-100 text-xs mt-2">Telemetry CSV</span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              Tabular threat scores and timestamps for spreadsheet analysis.
            </span>
          </button>

          {/* PDF (SIMULATED) */}
          <button
            type="button"
            onClick={handleSimulatePDF}
            className="flex flex-col items-start rounded-xl border border-pink-500/30 bg-pink-950/15 p-3.5 hover:border-pink-400 hover:bg-pink-950/30 transition-all text-left group"
          >
            <div className="flex items-center justify-between w-full">
              <Sparkles className="h-5 w-5 text-pink-400" />
              <span className="text-[9px] text-pink-300 rounded bg-pink-500/10 border border-pink-500/30 px-1.5 py-0.2">
                SIMULATION
              </span>
            </div>
            <span className="font-bold text-pink-200 text-xs mt-2">PDF Document</span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              Simulated PDF print layout export preparation.
            </span>
          </button>
        </div>

        {/* Disclaimer */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 text-[10px] text-slate-400 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <span>
            <strong>PDF Export Simulation:</strong> This demonstration environment does not generate production documents on a backend server. JSON, TXT, and CSV files are generated locally via browser APIs.
          </span>
        </div>

        <div className="flex justify-end border-t border-slate-800/80 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-1.5 text-slate-300 hover:text-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

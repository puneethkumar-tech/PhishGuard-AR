'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  X,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileText,
  FlaskConical,
  ExternalLink,
  Trash2,
  Lock,
  Tag,
  Clock,
  Layers,
  CheckCircle,
  Copy,
  Terminal,
} from 'lucide-react';
import { ThreatHistoryRecord } from '@/types';

interface ThreatHistoryDetailProps {
  record: ThreatHistoryRecord | null;
  onClose: () => void;
  onDeleteRecord: (id: string) => void;
}

export const ThreatHistoryDetail: React.FC<ThreatHistoryDetailProps> = ({
  record,
  onClose,
  onDeleteRecord,
}) => {
  const router = useRouter();
  const [copied, setCopied] = React.useState(false);

  if (!record) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(record.input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestRobustness = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'phishguard_active_scan_sample',
        JSON.stringify({
          input: record.input,
          isHomoglyph: record.isHomoglyph,
        })
      );
    }
    router.push('/robustness');
  };

  const handleGenerateReport = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('phishguard_selected_report_source', record.id);
    }
    router.push('/reports');
  };

  const getVerdictBadgeColor = () => {
    switch (record.verdict) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-cyan-500/30 bg-slate-950 p-6 font-mono text-xs shadow-[0_0_50px_rgba(6,182,212,0.15)] space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-cyan-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-500/20 text-cyan-300">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-cyan-400">{record.id}</span>
                <span className="text-[10px] text-slate-500">• {record.timestamp}</span>
              </div>
              <h3 className="text-base font-bold text-slate-100">{record.threatType}</h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-900 hover:text-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Verdict & Metrics Summary Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 rounded-xl border border-slate-800 bg-slate-900/60 p-3.5">
          <div>
            <span className="text-[10px] text-slate-400 uppercase">Verdict</span>
            <div className="mt-1">
              <span
                className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${getVerdictBadgeColor()}`}
              >
                {record.verdict}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase">Confidence</span>
            <div className="mt-1 text-base font-bold text-cyan-400">
              {record.confidence.toFixed(1)}%
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase">Severity</span>
            <div className="mt-1 text-base font-bold text-slate-100">{record.severity}</div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase">Robustness</span>
            <div className="mt-1 text-base font-bold text-amber-400">
              {record.robustnessScore.toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Original Input Payload */}
        <div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase mb-1.5">
            <span className="flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-cyan-400" />
              Original Ingested Payload ({record.inputType})
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-cyan-400 hover:underline flex items-center gap-1"
            >
              <Copy className="h-3 w-3" /> {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 text-slate-300 leading-relaxed break-all">
            &ldquo;{record.input}&rdquo;
          </div>
        </div>

        {/* Flagged Indicators */}
        {record.indicators && record.indicators.length > 0 && (
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">
              Flagged Indicators of Threat:
            </span>
            <ul className="space-y-1.5">
              {record.indicators.map((ind, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-lg border border-slate-800/80 bg-slate-900/40 p-2 text-slate-300 text-[11px]"
                >
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span>{ind}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* MITRE ATT&CK Context */}
        {record.attackContext && (
          <div className="rounded-xl border border-violet-500/30 bg-violet-950/20 p-3">
            <div className="flex items-center gap-2 text-violet-400 text-[10px] uppercase font-bold">
              <Tag className="h-3.5 w-3.5" />
              <span>MITRE ATT&CK Context</span>
            </div>
            <div className="mt-1 font-bold text-slate-200">
              {record.attackContext.mitreTactic} — {record.attackContext.technique}
            </div>
            <p className="mt-1 text-[10px] text-slate-400">{record.attackContext.description}</p>
          </div>
        )}

        {/* SOC Recommendation */}
        <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-3">
          <span className="text-[10px] font-bold text-cyan-400 uppercase block mb-1">
            SOC Recommendation:
          </span>
          <p className="text-slate-200 leading-relaxed text-[11px]">{record.recommendation}</p>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-4">
          <button
            type="button"
            onClick={() => {
              onDeleteRecord(record.id);
              onClose();
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-rose-300 hover:bg-rose-500/20 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete Demo Record</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleTestRobustness}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-amber-300 hover:bg-amber-500/20 transition-colors"
            >
              <FlaskConical className="h-3.5 w-3.5" />
              <span>Test Robustness →</span>
            </button>

            <button
              type="button"
              onClick={handleGenerateReport}
              className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400 bg-gradient-to-r from-cyan-500 to-blue-600 px-3.5 py-1.5 font-bold text-slate-950 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all"
            >
              <FileText className="h-3.5 w-3.5 fill-slate-950" />
              <span>Generate Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

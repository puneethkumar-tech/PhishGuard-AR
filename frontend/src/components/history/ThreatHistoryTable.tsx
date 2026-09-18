'use client';

import React from 'react';
import { Eye, ShieldAlert, ShieldCheck, AlertTriangle, Lock, Cpu, ArrowUpRight } from 'lucide-react';
import { ThreatHistoryRecord, ThreatVerdict, ThreatSeverityLevel } from '@/types';

interface ThreatHistoryTableProps {
  records: ThreatHistoryRecord[];
  onSelectRecord: (record: ThreatHistoryRecord) => void;
  onRunScanAgain?: (record: ThreatHistoryRecord) => void;
}

export const ThreatHistoryTable: React.FC<ThreatHistoryTableProps> = ({
  records,
  onSelectRecord,
  onRunScanAgain,
}) => {
  const getVerdictBadge = (verdict: ThreatVerdict) => {
    switch (verdict) {
      case 'SAFE':
        return 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400';
      case 'SUSPICIOUS':
        return 'bg-amber-500/15 border-amber-500/40 text-amber-400';
      case 'ADVERSARIAL':
        return 'bg-violet-500/15 border-violet-500/40 text-violet-300';
      case 'BLOCKED':
      case 'PHISHING':
      default:
        return 'bg-rose-500/15 border-rose-500/40 text-rose-400';
    }
  };

  const getSeverityBadge = (severity: ThreatSeverityLevel) => {
    switch (severity) {
      case 'CRITICAL':
        return 'text-rose-400 font-bold';
      case 'HIGH':
        return 'text-amber-400 font-bold';
      case 'MEDIUM':
        return 'text-yellow-400';
      case 'LOW':
        return 'text-blue-400';
      case 'SAFE':
      default:
        return 'text-emerald-400';
    }
  };

  const getModelLabel = (model: string) => {
    switch (model) {
      case 'TF_IDF_SVM':
        return 'SVM + TF-IDF';
      case 'DISTILBERT_TRANSFORMER':
        return 'DistilBERT AR';
      case 'BAYESIAN_FUSION':
      default:
        return 'Signal Fusion';
    }
  };

  if (records.length === 0) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-cyan-500/20 bg-slate-950/80 backdrop-blur-md">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-cyan-500/15 bg-slate-900/60 text-[10px] uppercase tracking-wider text-slate-400">
              <th className="py-3 px-4">Log ID</th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Payload / Target</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Verdict</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Confidence</th>
              <th className="py-3 px-4">Robustness</th>
              <th className="py-3 px-4">Model Engine</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {records.map((record) => (
              <tr
                key={record.id}
                onClick={() => onSelectRecord(record)}
                className="group hover:bg-slate-900/60 transition-colors cursor-pointer"
              >
                {/* ID */}
                <td className="py-3.5 px-4 font-bold text-cyan-400 whitespace-nowrap">
                  {record.id}
                </td>

                {/* Timestamp */}
                <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                  {record.timestamp}
                </td>

                {/* Target / Payload preview */}
                <td className="py-3.5 px-4 max-w-xs truncate text-slate-200" title={record.input}>
                  {record.input}
                </td>

                {/* Input Type */}
                <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                  <span className="rounded border border-slate-800 bg-slate-900 px-2 py-0.5">
                    {record.inputType}
                  </span>
                </td>

                {/* Verdict Badge */}
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getVerdictBadge(
                      record.verdict
                    )}`}
                  >
                    {record.verdict}
                  </span>
                </td>

                {/* Severity */}
                <td className={`py-3.5 px-4 text-[11px] ${getSeverityBadge(record.severity)}`}>
                  {record.severity}
                </td>

                {/* Confidence */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200 min-w-[36px]">
                      {record.confidence.toFixed(1)}%
                    </span>
                    <div className="h-1.5 w-12 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-cyan-400"
                        style={{ width: `${record.confidence}%` }}
                      />
                    </div>
                  </div>
                </td>

                {/* Robustness */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-400 min-w-[36px]">
                      {record.robustnessScore.toFixed(0)}%
                    </span>
                    <div className="h-1.5 w-12 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-amber-400"
                        style={{ width: `${record.robustnessScore}%` }}
                      />
                    </div>
                  </div>
                </td>

                {/* Model */}
                <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                  {getModelLabel(record.modelBranch)}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectRecord(record);
                    }}
                    className="inline-flex items-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-all shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Inspect</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile / Tablet Card View */}
      <div className="lg:hidden divide-y divide-slate-800/80 p-3 space-y-3">
        {records.map((record) => (
          <div
            key={record.id}
            onClick={() => onSelectRecord(record)}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 font-mono text-xs space-y-2 cursor-pointer active:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-cyan-400">{record.id}</span>
              <span
                className={`rounded-full border px-2 py-0.2 text-[9px] font-bold uppercase ${getVerdictBadge(
                  record.verdict
                )}`}
              >
                {record.verdict}
              </span>
            </div>

            <p className="line-clamp-2 text-slate-300 text-xs">{record.input}</p>

            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
              <div>
                <span>Timestamp:</span> <span className="text-slate-200">{record.timestamp}</span>
              </div>
              <div>
                <span>Severity:</span>{' '}
                <span className={getSeverityBadge(record.severity)}>{record.severity}</span>
              </div>
              <div>
                <span>Confidence:</span>{' '}
                <span className="text-cyan-400 font-bold">{record.confidence.toFixed(1)}%</span>
              </div>
              <div>
                <span>Robustness:</span>{' '}
                <span className="text-amber-400 font-bold">{record.robustnessScore.toFixed(0)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

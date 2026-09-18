'use client';

import React from 'react';
import {
  FileText,
  Download,
  Eye,
  Trash2,
  Archive,
  Copy,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import { ReportRecord, ReportStatus } from '@/types';

interface ReportTableProps {
  reports: ReportRecord[];
  onSelectReport: (report: ReportRecord) => void;
  onExportReport: (report: ReportRecord) => void;
  onDeleteReport: (id: string) => void;
  onDuplicateReport: (report: ReportRecord) => void;
}

export const ReportTable: React.FC<ReportTableProps> = ({
  reports,
  onSelectReport,
  onExportReport,
  onDeleteReport,
  onDuplicateReport,
}) => {
  const getVerdictBadge = (verdict: string) => {
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

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'GENERATED':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'ARCHIVED':
        return 'text-slate-400 bg-slate-800/40 border-slate-700';
      case 'DRAFT':
      default:
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-cyan-500/20 bg-slate-950/80 backdrop-blur-md">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-cyan-500/15 bg-slate-900/60 text-[10px] uppercase tracking-wider text-slate-400">
              <th className="py-3 px-4">Report ID</th>
              <th className="py-3 px-4">Title & Type</th>
              <th className="py-3 px-4">Source</th>
              <th className="py-3 px-4">Verdict</th>
              <th className="py-3 px-4">Confidence</th>
              <th className="py-3 px-4">Created</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {reports.map((report) => (
              <tr
                key={report.id}
                onClick={() => onSelectReport(report)}
                className="group hover:bg-slate-900/60 transition-colors cursor-pointer"
              >
                {/* ID */}
                <td className="py-3.5 px-4 font-bold text-cyan-400 whitespace-nowrap">
                  {report.id}
                </td>

                {/* Title */}
                <td className="py-3.5 px-4 max-w-sm">
                  <div className="font-bold text-slate-100 truncate">{report.title}</div>
                  <div className="text-[10px] text-slate-400">
                    {report.reportType.replace('_', ' ')}
                  </div>
                </td>

                {/* Source */}
                <td className="py-3.5 px-4 text-slate-400 text-[11px] truncate max-w-xs">
                  {report.sourceLabel}
                </td>

                {/* Verdict */}
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getVerdictBadge(
                      report.verdict
                    )}`}
                  >
                    {report.verdict}
                  </span>
                </td>

                {/* Confidence */}
                <td className="py-3.5 px-4 font-bold text-cyan-400 whitespace-nowrap">
                  {report.confidence.toFixed(1)}%
                </td>

                {/* Created */}
                <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                  {report.createdAt}
                </td>

                {/* Status */}
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-block rounded border px-2 py-0.5 text-[9px] font-bold uppercase ${getStatusBadge(
                      report.status
                    )}`}
                  >
                    {report.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onSelectReport(report)}
                      className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-1.5 text-cyan-300 hover:bg-cyan-500/20 transition-colors"
                      title="View Report"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onExportReport(report)}
                      className="rounded-lg border border-slate-700 bg-slate-900 p-1.5 text-slate-300 hover:text-slate-100 hover:border-slate-600 transition-colors"
                      title="Export Options"
                    >
                      <Download className="h-3.5 w-3.5 text-cyan-400" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDuplicateReport(report)}
                      className="rounded-lg border border-slate-700 bg-slate-900 p-1.5 text-slate-300 hover:text-slate-100 hover:border-slate-600 transition-colors"
                      title="Duplicate Report"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteReport(report.id)}
                      className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-1.5 text-rose-300 hover:bg-rose-500/20 transition-colors"
                      title="Delete Report"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="lg:hidden divide-y divide-slate-800 p-3 space-y-3">
        {reports.map((report) => (
          <div
            key={report.id}
            onClick={() => onSelectReport(report)}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 font-mono text-xs space-y-2 cursor-pointer active:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-cyan-400">{report.id}</span>
              <span
                className={`rounded-full border px-2 py-0.2 text-[9px] font-bold uppercase ${getVerdictBadge(
                  report.verdict
                )}`}
              >
                {report.verdict}
              </span>
            </div>

            <h4 className="font-bold text-slate-100">{report.title}</h4>
            <p className="text-[10px] text-slate-400 line-clamp-2">{report.executiveSummary}</p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px]">
              <span className="text-slate-500">{report.createdAt}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onExportReport(report);
                  }}
                  className="text-cyan-400 flex items-center gap-1"
                >
                  <Download className="h-3 w-3" /> Export
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

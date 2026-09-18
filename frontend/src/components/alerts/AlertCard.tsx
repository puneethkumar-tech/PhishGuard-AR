'use client';

import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Bell,
  CheckCircle2,
  Check,
  Eye,
  Trash2,
  Lock,
} from 'lucide-react';
import { SecurityAlertRecord, AlertSeverityType, AlertStatusType } from '@/types';

interface AlertCardProps {
  alert: SecurityAlertRecord;
  onSelect: (alert: SecurityAlertRecord) => void;
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
  onDismiss: (id: string) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  alert,
  onSelect,
  onAcknowledge,
  onResolve,
  onDismiss,
}) => {
  const getSeverityBadge = (severity: AlertSeverityType) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-500/20 border-rose-500/40 text-rose-400';
      case 'HIGH':
        return 'bg-orange-500/20 border-orange-500/40 text-orange-400';
      case 'MEDIUM':
        return 'bg-amber-500/20 border-amber-500/40 text-amber-400';
      case 'LOW':
      default:
        return 'bg-blue-500/20 border-blue-500/40 text-blue-300';
    }
  };

  const getStatusBadge = (status: AlertStatusType) => {
    switch (status) {
      case 'NEW':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30 animate-pulse';
      case 'ACKNOWLEDGED':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'RESOLVED':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'SIMULATED':
      default:
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
    }
  };

  return (
    <div
      onClick={() => onSelect(alert)}
      className={`rounded-xl border p-4 font-mono text-xs transition-all duration-200 cursor-pointer ${
        !alert.isRead
          ? 'border-cyan-500/40 bg-slate-900/90 shadow-[0_0_20px_rgba(6,182,212,0.1)]'
          : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-900/60'
      }`}
    >
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getSeverityBadge(
              alert.severity
            )}`}
          >
            {alert.severity}
          </span>
          <span className="text-[10px] text-slate-500">{alert.id}</span>
          <span className="text-[10px] text-slate-500">• {alert.timestamp}</span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded border px-2 py-0.5 text-[9px] font-bold uppercase ${getStatusBadge(
              alert.status
            )}`}
          >
            ● {alert.status}
          </span>
        </div>
      </div>

      {/* Alert Title */}
      <h4 className="text-sm font-bold text-slate-100 mt-2.5 leading-snug">
        {alert.title}
      </h4>

      {/* Explanation */}
      <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
        {alert.explanation}
      </p>

      {/* Metadata Strip */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 pt-2 text-[10px]">
        <div className="flex items-center gap-3 text-slate-400">
          <span>Source: <strong className="text-slate-200">{alert.source}</strong></span>
          <span>•</span>
          <span>Confidence: <strong className="text-cyan-400">{alert.confidence.toFixed(1)}%</strong></span>
        </div>

        {/* Quick Action Buttons */}
        <div
          className="flex items-center gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          {alert.status === 'NEW' && (
            <button
              type="button"
              onClick={() => onAcknowledge(alert.id)}
              className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold text-amber-300 hover:bg-amber-500/20 transition-colors"
            >
              Acknowledge
            </button>
          )}

          {alert.status !== 'RESOLVED' && (
            <button
              type="button"
              onClick={() => onResolve(alert.id)}
              className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-300 hover:bg-emerald-500/20 transition-colors"
            >
              Resolve
            </button>
          )}

          <button
            type="button"
            onClick={() => onSelect(alert)}
            className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-1 text-cyan-300 hover:bg-cyan-500/20 transition-colors"
            title="Inspect Details"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDismiss(alert.id)}
            className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-1 text-rose-300 hover:bg-rose-500/20 transition-colors"
            title="Dismiss Alert"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Bell,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Trash2,
  Layers,
  Cpu,
  Lock,
} from 'lucide-react';
import { SecurityAlertRecord } from '@/types';

interface AlertDetailDrawerProps {
  alert: SecurityAlertRecord | null;
  onClose: () => void;
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
  onDismiss: (id: string) => void;
}

export const AlertDetailDrawer: React.FC<AlertDetailDrawerProps> = ({
  alert,
  onClose,
  onAcknowledge,
  onResolve,
  onDismiss,
}) => {
  const router = useRouter();

  if (!alert) return null;

  const handleNavigateToScan = () => {
    onClose();
    if (alert.associatedScanId) {
      router.push('/history');
    } else {
      router.push('/scan');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-rose-500/30 bg-slate-950 p-6 font-mono text-xs shadow-[0_0_50px_rgba(244,63,94,0.15)] space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-500/40 bg-rose-500/20 text-rose-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-400">{alert.id}</span>
                <span className="text-[10px] text-slate-500">• {alert.timestamp}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-100 mt-0.5">{alert.title}</h3>
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

        {/* Severity & Status Badges */}
        <div className="grid grid-cols-3 gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-center">
          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Severity</span>
            <span className="font-bold text-rose-400 text-sm">{alert.severity}</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Confidence</span>
            <span className="font-bold text-cyan-400 text-sm">{alert.confidence.toFixed(1)}%</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Status</span>
            <span className="font-bold text-emerald-400 text-sm">{alert.status}</span>
          </div>
        </div>

        {/* Context Details */}
        <div className="space-y-2.5">
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
              Trigger Source & Node
            </span>
            <p className="text-slate-200 text-xs font-semibold">{alert.source}</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
              Event Category & Vector
            </span>
            <p className="text-cyan-300 text-xs font-semibold">{alert.category}</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
              Telemetry Description & Forensics
            </span>
            <p className="text-slate-300 leading-relaxed text-xs">{alert.explanation}</p>
          </div>
        </div>

        {/* Associated Scan Link */}
        {alert.associatedScanId && (
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-cyan-400 uppercase font-bold block">
                Correlated Scan Audit Record
              </span>
              <span className="text-slate-200 font-bold">{alert.associatedScanId}</span>
            </div>
            <button
              type="button"
              onClick={handleNavigateToScan}
              className="inline-flex items-center gap-1 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-xs text-cyan-300 hover:bg-cyan-500/20 transition-colors"
            >
              <span>View History Log</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">
          <button
            type="button"
            onClick={() => {
              onDismiss(alert.id);
              onClose();
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-rose-300 hover:bg-rose-500/20 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Dismiss</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {alert.status === 'NEW' && (
              <button
                type="button"
                onClick={() => {
                  onAcknowledge(alert.id);
                  onClose();
                }}
                className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-amber-300 hover:bg-amber-500/20 transition-colors font-bold"
              >
                Acknowledge
              </button>
            )}

            {alert.status !== 'RESOLVED' && (
              <button
                type="button"
                onClick={() => {
                  onResolve(alert.id);
                  onClose();
                }}
                className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1.5 text-emerald-300 hover:bg-emerald-500/20 transition-colors font-bold"
              >
                Mark Resolved
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-slate-300 hover:text-slate-100"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

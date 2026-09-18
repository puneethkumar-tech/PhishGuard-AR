'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CheckCheck,
  ShieldAlert,
  Cpu,
  FileText,
  AlertTriangle,
  Zap,
  Info,
  ExternalLink,
  Trash2,
  X,
} from 'lucide-react';
import { SecurityAlertRecord } from '@/types';
import {
  getStoredAlerts,
  setStoredAlerts,
  clearStoredAlerts,
} from '@/lib/storage';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  const [alerts, setAlerts] = useState<SecurityAlertRecord[]>([]);

  useEffect(() => {
    if (isOpen) {
      const stored = getStoredAlerts();
      setAlerts(stored);
    }
  }, [isOpen]);

  const unreadCount = alerts.filter((a) => a.status === 'NEW').length;

  const markAllAsRead = () => {
    const updated = alerts.map((a) =>
      a.status === 'NEW' ? { ...a, status: 'ACKNOWLEDGED' as const } : a
    );
    setAlerts(updated);
    setStoredAlerts(updated);
  };

  const handleClear = () => {
    clearStoredAlerts();
    setAlerts([]);
  };

  const getSeverityIcon = (severity: SecurityAlertRecord['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return <Zap className="w-3.5 h-3.5 text-red-400" />;
      case 'HIGH':
        return <ShieldAlert className="w-3.5 h-3.5 text-orange-400" />;
      case 'MEDIUM':
        return <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />;
      case 'LOW':
      default:
        return <Info className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  const getSeverityBadge = (severity: SecurityAlertRecord['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'MEDIUM':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'LOW':
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-2xl z-50 overflow-hidden text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider font-mono text-slate-100 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-cyan-400" />
              SOC Alerts
            </span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-red-500/20 text-red-400 border border-red-500/30 font-semibold">
                {unreadCount} NEW
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck className="w-3 h-3" /> Read all
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60 p-1">
          {alerts.length === 0 ? (
            <div className="p-6 text-center text-xs font-mono text-slate-500">
              No active security alert telemetry in feed.
            </div>
          ) : (
            alerts.slice(0, 6).map((item) => (
              <Link
                key={item.id}
                href="/alerts"
                onClick={onClose}
                className={`p-3 rounded-xl block transition-colors ${
                  item.status === 'NEW'
                    ? 'bg-cyan-950/20 hover:bg-cyan-950/40 border border-cyan-500/20 my-0.5'
                    : 'hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 mt-0.5 shrink-0">
                    {getSeverityIcon(item.severity)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-semibold text-slate-200 truncate">
                        {item.title}
                      </span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded border uppercase shrink-0 ${getSeverityBadge(
                          item.severity
                        )}`}
                      >
                        {item.severity}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                      {item.shortExplanation}
                    </p>

                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 mt-1.5">
                      <span>{item.timestamp}</span>
                      <span className="text-cyan-400">{item.threatType}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-3 py-2 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono">
          <button
            onClick={handleClear}
            className="text-slate-500 hover:text-red-400 flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3 h-3" /> Clear Notifications
          </button>

          <Link
            href="/alerts"
            onClick={onClose}
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold transition-colors"
          >
            <span>View Alert Center</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </AnimatePresence>
  );
};

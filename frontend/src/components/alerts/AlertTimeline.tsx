'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ShieldAlert, AlertTriangle, Info, Zap, Terminal } from 'lucide-react';
import { SecurityAlertRecord } from '@/types';

interface AlertTimelineProps {
  alerts: SecurityAlertRecord[];
  onSelectAlert?: (alert: SecurityAlertRecord) => void;
}

export const AlertTimeline: React.FC<AlertTimelineProps> = ({
  alerts,
  onSelectAlert,
}) => {
  const getSeverityBadge = (severity: SecurityAlertRecord['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'MEDIUM':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      case 'LOW':
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
    }
  };

  const getSeverityIcon = (severity: SecurityAlertRecord['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return <Zap className="w-4 h-4 text-red-400" />;
      case 'HIGH':
        return <ShieldAlert className="w-4 h-4 text-orange-400" />;
      case 'MEDIUM':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'LOW':
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-5 shadow-2xl relative overflow-hidden">
      {/* Background glow and matrix grid line */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-center justify-between mb-5 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          <h3 className="font-semibold text-slate-100 text-base tracking-wide">
            SOC Incident Chronology
          </h3>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            SIMULATED FEED
          </span>
        </div>
        <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-slate-500" />
          <span>Realtime Sensor Telemetry</span>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-8 text-slate-500 font-mono text-xs">
          No simulated security events in timeline buffer.
        </div>
      ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-cyan-500/50 before:via-blue-500/30 before:to-slate-800">
          {alerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              onClick={() => onSelectAlert && onSelectAlert(alert)}
              className="relative group cursor-pointer"
            >
              {/* Timeline marker icon */}
              <div className="absolute -left-[27px] top-1 w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center group-hover:border-cyan-400 group-hover:scale-110 transition-all shadow-md">
                <div className="scale-75">{getSeverityIcon(alert.severity)}</div>
              </div>

              {/* Event card item */}
              <div className="bg-slate-950/40 hover:bg-slate-800/50 border border-slate-800/70 hover:border-slate-700/80 rounded-lg p-3 transition-all duration-200 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-medium text-cyan-300">
                      {alert.timestamp}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${getSeverityBadge(
                        alert.severity
                      )}`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">
                      [{alert.id}]
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {alert.source}
                  </span>
                </div>

                <div className="text-sm font-medium text-slate-200 group-hover:text-cyan-300 transition-colors">
                  {alert.title}
                </div>

                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {alert.shortExplanation}
                </p>

                <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/60">
                  <span className="flex items-center gap-1.5">
                    <span className="text-slate-500">Threat:</span>
                    <span className="text-slate-300">{alert.threatType}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-slate-500">Confidence:</span>
                    <span className="text-cyan-400 font-semibold">{alert.confidence}%</span>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

'use client';

import React from 'react';
import { Bell, ShieldAlert, Zap, Radio, BellOff } from 'lucide-react';
import { PlatformSettings } from '@/types';

interface NotificationSectionProps {
  notifications: PlatformSettings['notifications'];
  onChange: (notifications: PlatformSettings['notifications']) => void;
}

export const NotificationSection: React.FC<NotificationSectionProps> = ({
  notifications,
  onChange,
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur-xl shadow-xl space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
          <Bell className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-100">Notification Streams (Simulated)</h3>
          <p className="text-xs text-slate-400">
            Configure simulated alert dispatching and notification bell stream priority.
          </p>
        </div>
      </div>

      {/* Frequency Setting */}
      <div>
        <label className="block text-xs font-mono text-slate-400 mb-2">
          Alert Dispatch Cadence
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'immediate', label: 'Immediate Stream', desc: 'Notify on every sensor trigger' },
            { id: 'grouped', label: 'Grouped Digest', desc: 'Batch alerts in 15-min intervals' },
            { id: 'muted', label: 'Muted', desc: 'Silent logging to SOC storage only' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => onChange({ ...notifications, frequency: f.id as any })}
              className={`p-3 rounded-xl text-left border transition-all ${
                notifications.frequency === f.id
                  ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40 shadow-md'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <span className="text-xs font-mono font-bold block">{f.label}</span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">{f.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Channel Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            key: 'threatAlerts' as const,
            title: 'Phishing Threat Alerts',
            desc: 'Stream high-confidence malicious verdict detections.',
          },
          {
            key: 'robustnessAlerts' as const,
            title: 'Adversarial Evasion Alerts',
            desc: 'Notify when evasion perturbations bypass baseline classifiers.',
          },
          {
            key: 'modelDisagreementAlerts' as const,
            title: 'Model Disagreement Anomalies',
            desc: 'Trigger alerts when SVM and DistilBERT outputs diverge widely.',
          },
          {
            key: 'systemNotifications' as const,
            title: 'System & Engine Telemetry',
            desc: 'Status updates on pipeline initialization and rule updates.',
          },
          {
            key: 'desktopNotificationSimulation' as const,
            title: 'Desktop Notification Simulation',
            desc: 'Render simulated in-app floating banner toasts on threats.',
          },
        ].map((item) => (
          <div
            key={item.key}
            onClick={() =>
              onChange({
                ...notifications,
                [item.key]: !notifications[item.key],
              })
            }
            className="flex items-center justify-between p-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
          >
            <div className="pr-3">
              <span className="text-xs font-semibold text-slate-200 block">{item.title}</span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">{item.desc}</span>
            </div>
            <input
              type="checkbox"
              checked={notifications[item.key]}
              onChange={() => {}}
              className="w-4 h-4 accent-yellow-400 rounded pointer-events-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

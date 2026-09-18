'use client';

import React from 'react';
import { Shield, ShieldAlert, CheckSquare, Eye, Lock } from 'lucide-react';
import { PlatformSettings } from '@/types';

interface SecuritySectionProps {
  security: PlatformSettings['security'];
  onChange: (security: PlatformSettings['security']) => void;
}

export const SecuritySection: React.FC<SecuritySectionProps> = ({
  security,
  onChange,
}) => {
  const toggleKey = (key: keyof PlatformSettings['security']) => {
    onChange({
      ...security,
      [key]: !security[key],
    });
  };

  const securityToggles = [
    {
      key: 'autoRunRobustness' as const,
      title: 'Auto-run Robustness Simulation',
      desc: 'Simulate adversarial evasion mutations alongside standard threat scans.',
    },
    {
      key: 'showThreatConfirmations' as const,
      title: 'Show Threat Confirmations',
      desc: 'Display confirmation modals before classifying or dismissing suspicious items.',
    },
    {
      key: 'showConfidenceIndicators' as const,
      title: 'Show Confidence Indicators',
      desc: 'Render granular confidence percentages and model prediction calibration gauges.',
    },
    {
      key: 'showForensicDetails' as const,
      title: 'Show Forensic Details',
      desc: 'Reveal deep URL character entropy, MITRE techniques, and token breakdown.',
    },
    {
      key: 'showAttackContext' as const,
      title: 'Show Simulated Attack Context',
      desc: 'Include kill-chain mapping and simulated adversary profile annotations.',
    },
    {
      key: 'showAIExplanations' as const,
      title: 'Show AI Explanations',
      desc: 'Generate natural-language explainability summaries for every verdict.',
    },
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur-xl shadow-xl space-y-5">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-100">Security Preferences</h3>
          <p className="text-xs text-slate-400">
            Frontend threat analysis options, forensic telemetry visibility, and explanations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {securityToggles.map((item) => (
          <div
            key={item.key}
            onClick={() => toggleKey(item.key)}
            className="flex items-start justify-between p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-all group"
          >
            <div className="pr-3">
              <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors block">
                {item.title}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block leading-relaxed">
                {item.desc}
              </span>
            </div>
            <div className="pt-0.5">
              <input
                type="checkbox"
                checked={security[item.key]}
                onChange={() => {}} // handled by parent div onClick
                className="w-4 h-4 accent-cyan-400 rounded cursor-pointer pointer-events-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

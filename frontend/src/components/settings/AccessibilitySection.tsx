'use client';

import React from 'react';
import { Accessibility, Eye, Type, Command, Sparkles } from 'lucide-react';
import { PlatformSettings } from '@/types';

interface AccessibilitySectionProps {
  accessibility: PlatformSettings['accessibility'];
  onChange: (accessibility: PlatformSettings['accessibility']) => void;
}

export const AccessibilitySection: React.FC<AccessibilitySectionProps> = ({
  accessibility,
  onChange,
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur-xl shadow-xl space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Accessibility className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-100">Accessibility & Inclusivity</h3>
          <p className="text-xs text-slate-400">
            Configure reduced motion, contrast enhancement, text sizing, and keyboard helpers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            key: 'reducedMotion' as const,
            title: 'Reduced Motion Mode',
            desc: 'Disable ambient floating orbs, spring transitions, and 3D rotations.',
          },
          {
            key: 'highContrast' as const,
            title: 'High Contrast Borders',
            desc: 'Amplify border definition and contrast ratios across cards and tables.',
          },
          {
            key: 'largerText' as const,
            title: 'Increased Legibility Text',
            desc: 'Scale up terminal timestamps and technical telemetry labels.',
          },
          {
            key: 'keyboardShortcutsHints' as const,
            title: 'Keyboard Navigation Badges',
            desc: 'Show visual key badges (e.g., [Ctrl+K], [Esc], [Tab]) on interactive buttons.',
          },
        ].map((item) => (
          <div
            key={item.key}
            onClick={() =>
              onChange({
                ...accessibility,
                [item.key]: !accessibility[item.key],
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
              checked={accessibility[item.key]}
              onChange={() => {}}
              className="w-4 h-4 accent-blue-400 rounded pointer-events-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

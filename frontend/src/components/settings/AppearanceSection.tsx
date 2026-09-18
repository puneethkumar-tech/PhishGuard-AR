'use client';

import React from 'react';
import { Palette, Sun, Moon, Laptop, Sparkles, Sliders } from 'lucide-react';
import { PlatformSettings } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';

interface AppearanceSectionProps {
  appearance: PlatformSettings['appearance'];
  onChange: (appearance: PlatformSettings['appearance']) => void;
}

export const AppearanceSection: React.FC<AppearanceSectionProps> = ({
  appearance,
  onChange,
}) => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme: 'dark' | 'light' | 'system') => {
    setTheme(newTheme);
    onChange({ ...appearance, theme: newTheme });
  };

  return (
    <div className="bg-surface/80 border border-border rounded-xl p-6 backdrop-blur-xl shadow-xl space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 dark:text-purple-400 border border-purple-500/20">
          <Palette className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-text">Appearance & Theme</h3>
          <p className="text-xs text-text-muted">
            Customize the visual presentation, accent intensity, and density.
          </p>
        </div>
      </div>

      {/* Theme selection */}
      <div>
        <label className="block text-xs font-mono text-text-muted mb-2">Theme Mode</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'dark', label: 'Dark Mode (SOC)', icon: <Moon className="w-4 h-4" /> },
            { id: 'light', label: 'Light Mode', icon: <Sun className="w-4 h-4" /> },
            { id: 'system', label: 'System Default', icon: <Laptop className="w-4 h-4" /> },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => handleThemeChange(t.id as any)}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-mono border transition-all ${
                theme === t.id
                  ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border-cyan-500/40 shadow-lg shadow-cyan-500/10 font-bold'
                  : 'bg-surface-2 text-text-muted border-border hover:text-text hover:border-cyan-500/30'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Accent Intensity & Interface Density */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-text-muted mb-2">Accent Intensity</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'standard', label: 'Standard' },
              { id: 'high', label: 'High Cyber Glow' },
            ].map((acc) => (
              <button
                key={acc.id}
                onClick={() => onChange({ ...appearance, accentIntensity: acc.id as any })}
                className={`p-2.5 rounded-lg text-xs font-mono border transition-all text-center ${
                  appearance.accentIntensity === acc.id
                    ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300 border-purple-500/40 font-bold'
                    : 'bg-surface-2 text-text-muted border-border hover:text-text'
                }`}
              >
                {acc.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-text-muted mb-2">Interface Density</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'comfortable', label: 'Comfortable' },
              { id: 'compact', label: 'Compact Grid' },
            ].map((den) => (
              <button
                key={den.id}
                onClick={() => onChange({ ...appearance, density: den.id as any })}
                className={`p-2.5 rounded-lg text-xs font-mono border transition-all text-center ${
                  appearance.density === den.id
                    ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border-cyan-500/40 font-bold'
                    : 'bg-surface-2 text-text-muted border-border hover:text-text'
                }`}
              >
                {den.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Animation mode */}
      <div>
        <label className="block text-xs font-mono text-text-muted mb-2">Animation Fidelity</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'full', label: 'Full 3D / Motion' },
            { id: 'reduced', label: 'Reduced Motion' },
            { id: 'off', label: 'Disabled' },
          ].map((anim) => (
            <button
              key={anim.id}
              onClick={() => onChange({ ...appearance, animation: anim.id as any })}
              className={`p-2.5 rounded-xl text-xs font-mono border transition-all text-center ${
                appearance.animation === anim.id
                  ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border-cyan-500/40 font-bold'
                  : 'bg-surface-2 text-text-muted border-border hover:text-text'
              }`}
            >
              {anim.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

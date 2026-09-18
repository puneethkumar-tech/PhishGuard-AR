'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { GlowButton } from '@/components/ui/GlowButton';
import {
  Settings,
  Shield,
  Sliders,
  Bell,
  Monitor,
  CheckCircle2,
  Save,
  RotateCcw,
  Sparkles,
  Key,
} from 'lucide-react';
import { DEFAULT_USER_SETTINGS } from '@/lib/demo-data';
import { UserSettings } from '@/types';

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('phishguard_user_settings');
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem('phishguard_user_settings', JSON.stringify(settings));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleReset = () => {
    setSettings(DEFAULT_USER_SETTINGS);
    try {
      localStorage.setItem('phishguard_user_settings', JSON.stringify(DEFAULT_USER_SETTINGS));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <PageContainer>
      {/* 1. Page Header */}
      <PageHeader
        eyebrow="SYSTEM CONFIGURATION"
        title="Platform & Defense Settings"
        description="Configure threat detection calibration, user preferences, and notification channels."
        statusBadge={{ label: "Preferences Active", variant: "cyan", dot: true }}
        actions={
          <div className="flex items-center gap-2">
            <GlowButton size="sm" variant="ghost" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              Defaults
            </GlowButton>
            <GlowButton size="sm" variant="primary" onClick={handleSave} leftIcon={<Save className="w-3.5 h-3.5" />}>
              {savedSuccess ? 'Saved!' : 'Save Changes'}
            </GlowButton>
          </div>
        }
      />

      {/* 2. Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security & AI Model Calibration */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/20 text-primary-bright">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text">AI Security Calibration</h3>
              <p className="text-xs text-text-muted">Thresholds for the dual-engine pipeline</p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {/* Protection Mode */}
            <div>
              <label className="text-xs font-semibold text-text block mb-1.5">
                Active Defense Profile
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'standard', label: 'Standard' },
                  { id: 'high-sensitivity', label: 'High Sensitivity' },
                  { id: 'adversarial-hardened', label: 'AR Hardened' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSettings({ ...settings, protectionMode: mode.id as any })}
                    className={`p-2 rounded-xl text-xs font-medium border transition-all text-center ${
                      settings.protectionMode === mode.id
                        ? 'bg-primary/25 border-cyber-cyan text-white shadow-cyan-glow'
                        : 'bg-surface-2 border-border text-text-muted hover:text-text'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Threshold Slider */}
            <div>
              <div className="flex justify-between text-xs text-text-muted mb-1">
                <span>Adversarial Sensitivity Threshold</span>
                <span className="text-cyber-cyan font-mono font-bold">
                  {Math.round(settings.threatThreshold * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={Math.round(settings.threatThreshold * 100)}
                onChange={(e) =>
                  setSettings({ ...settings, threatThreshold: Number(e.target.value) / 100 })
                }
                className="w-full accent-cyber-cyan bg-surface-2 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Auto Scan Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-2/80 border border-border text-xs">
              <div>
                <span className="font-semibold text-text block">Ensemble Fast-Path</span>
                <span className="text-[11px] text-text-muted">Parallelize SVM + DistilBERT passes</span>
              </div>
              <input
                type="checkbox"
                checked={settings.autoScan}
                onChange={(e) => setSettings({ ...settings, autoScan: e.target.checked })}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
            </div>
          </div>
        </GlassCard>

        {/* Display & Interface Preferences */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyber-cyan/20 text-cyber-cyan">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text">Display & Interface</h3>
              <p className="text-xs text-text-muted">Visual density and motion settings</p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {/* Reduced Motion Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-2/80 border border-border text-xs">
              <div>
                <span className="font-semibold text-text block">Reduce Motion Effects</span>
                <span className="text-[11px] text-text-muted">Minimize 3D and page transitions</span>
              </div>
              <input
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={(e) => setSettings({ ...settings, reducedMotion: e.target.checked })}
                className="w-4 h-4 accent-cyber-cyan rounded cursor-pointer"
              />
            </div>

            {/* Animations Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-2/80 border border-border text-xs">
              <div>
                <span className="font-semibold text-text block">Glow & Ambient Lighting</span>
                <span className="text-[11px] text-text-muted">Show holographic cyber shadows</span>
              </div>
              <input
                type="checkbox"
                checked={settings.animations}
                onChange={(e) => setSettings({ ...settings, animations: e.target.checked })}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
            </div>

            {/* Navigation Density */}
            <div>
              <label className="text-xs font-semibold text-text block mb-1.5">
                Layout Spacing Density
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['compact', 'comfortable'].map((dens) => (
                  <button
                    key={dens}
                    onClick={() => setSettings({ ...settings, density: dens as any })}
                    className={`p-2 rounded-xl text-xs font-medium border capitalize transition-all ${
                      settings.density === dens
                        ? 'bg-primary/25 border-cyber-cyan text-white shadow-cyan-glow'
                        : 'bg-surface-2 border-border text-text-muted hover:text-text'
                    }`}
                  >
                    {dens}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Notifications & Alert Streams */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyber-warning/20 text-cyber-warning">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text">Notification Channels</h3>
              <p className="text-xs text-text-muted">Security alert telemetry notifications</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-2/80 border border-border text-xs">
              <div>
                <span className="font-semibold text-text block">Security Threat Alerts</span>
                <span className="text-[11px] text-text-muted">Notify on high-confidence phishing</span>
              </div>
              <input
                type="checkbox"
                checked={settings.securityAlerts}
                onChange={(e) => setSettings({ ...settings, securityAlerts: e.target.checked })}
                className="w-4 h-4 accent-cyber-danger rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-2/80 border border-border text-xs">
              <div>
                <span className="font-semibold text-text block">Daily Executive Summary</span>
                <span className="text-[11px] text-text-muted">Compile daily briefing report</span>
              </div>
              <input
                type="checkbox"
                checked={settings.dailySummary}
                onChange={(e) => setSettings({ ...settings, dailySummary: e.target.checked })}
                className="w-4 h-4 accent-cyber-cyan rounded cursor-pointer"
              />
            </div>
          </div>
        </GlassCard>

        {/* Integration Endpoints (Placeholder) */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyber-violet/20 text-purple-300">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text">Integration Adapters</h3>
              <p className="text-xs text-text-muted">Configured endpoint adapters for future phases</p>
            </div>
          </div>

          <div className="space-y-2.5 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-surface-2/80 border border-border flex items-center justify-between">
              <div>
                <span className="font-semibold text-text block">FastAPI Server URL</span>
                <span className="text-[10px] font-mono text-text-muted">NEXT_PUBLIC_API_URL</span>
              </div>
              <span className="font-mono text-cyber-cyan text-[11px]">http://localhost:8000</span>
            </div>

            <div className="p-3 rounded-xl bg-surface-2/80 border border-border flex items-center justify-between">
              <div>
                <span className="font-semibold text-text block">Gmail / WhatsApp Adapters</span>
                <span className="text-[10px] font-mono text-text-muted">External Channels</span>
              </div>
              <Badge variant="outline" size="sm">Phase 9 Integration</Badge>
            </div>
          </div>
        </GlassCard>
      </div>
    </PageContainer>
  );
}

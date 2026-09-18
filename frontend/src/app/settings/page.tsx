'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  User,
  Palette,
  Shield,
  Scan,
  Cpu,
  Swords,
  Bell,
  Database,
  Sparkles,
  Accessibility,
  Info,
  Save,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import { PlatformSettings } from '@/types';
import { DEFAULT_PLATFORM_SETTINGS } from '@/lib/settings-defaults';
import {
  getStoredSettings,
  setStoredSettings,
  resetSettingsToDefault,
  clearStoredHistory,
  clearStoredReports,
  clearStoredAlerts,
  clearDemoData,
  resetHistoryToDefault,
  resetReportsToDefault,
  resetAlertsToDefault,
} from '@/lib/storage';

import { ProfileSection } from '@/components/settings/ProfileSection';
import { AppearanceSection } from '@/components/settings/AppearanceSection';
import { SecuritySection } from '@/components/settings/SecuritySection';
import { ScanSection } from '@/components/settings/ScanSection';
import { AISection } from '@/components/settings/AISection';
import { RobustnessSection } from '@/components/settings/RobustnessSection';
import { NotificationSection } from '@/components/settings/NotificationSection';
import { PrivacyDataSection } from '@/components/settings/PrivacyDataSection';
import { DemoEnvironmentPanel } from '@/components/settings/DemoEnvironmentPanel';
import { AccessibilitySection } from '@/components/settings/AccessibilitySection';
import { AboutSection } from '@/components/settings/AboutSection';
import { ResetConfirmModal } from '@/components/settings/ResetConfirmModal';
import { useTheme } from '@/contexts/ThemeContext';

type SectionKey =
  | 'profile'
  | 'appearance'
  | 'security'
  | 'scan'
  | 'ai'
  | 'robustness'
  | 'notifications'
  | 'privacy'
  | 'demo'
  | 'accessibility'
  | 'about';

interface NavItem {
  id: SectionKey;
  label: string;
  icon: React.ReactNode;
}

export default function SettingsPage() {
  const { setTheme } = useTheme();
  const [settings, setSettings] = useState<PlatformSettings>(DEFAULT_PLATFORM_SETTINGS);
  const [activeSection, setActiveSection] = useState<SectionKey>('profile');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal confirmation state
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  useEffect(() => {
    const loaded = getStoredSettings();
    setSettings(loaded);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleSave = () => {
    setStoredSettings(settings);
    showToast('Platform preferences saved — DEMO');
  };

  const handleResetProfile = () => {
    setSettings((prev) => ({
      ...prev,
      profile: { ...DEFAULT_PLATFORM_SETTINGS.profile },
    }));
    showToast('Profile reset to demo defaults');
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  // Seeding actions
  const handleSeedHistory = () => {
    resetHistoryToDefault();
    showToast('Seeded 10 demo threat history records');
  };

  const handleSeedReports = () => {
    resetReportsToDefault();
    showToast('Seeded 5 demo forensic reports');
  };

  const handleSeedAlerts = () => {
    resetAlertsToDefault();
    showToast('Seeded 6 demo security alerts');
  };

  const handleResetAllDemoData = () => {
    setModalState({
      isOpen: true,
      title: 'Restore Full Demo Environment?',
      message:
        'This will reset scan history, generated reports, security alerts, and system configuration back to the factory demonstration baseline.',
      confirmLabel: 'Restore Baseline',
      isDestructive: false,
      onConfirm: () => {
        resetHistoryToDefault();
        resetReportsToDefault();
        resetAlertsToDefault();
        const resetConf = resetSettingsToDefault();
        setSettings(resetConf);
        setTheme('dark');
        closeModal();
        showToast('Demo environment restored to baseline');
      },
    });
  };

  // Privacy clearing actions
  const handleClearHistoryConfirm = () => {
    setModalState({
      isOpen: true,
      title: 'Clear Scan History?',
      message: 'All saved threat scans and forensic logs will be deleted from local storage.',
      confirmLabel: 'Clear History',
      isDestructive: true,
      onConfirm: () => {
        clearStoredHistory();
        closeModal();
        showToast('Threat scan history cleared');
      },
    });
  };

  const handleClearReportsConfirm = () => {
    setModalState({
      isOpen: true,
      title: 'Clear All Reports?',
      message: 'All generated security reports will be removed from local storage.',
      confirmLabel: 'Clear Reports',
      isDestructive: true,
      onConfirm: () => {
        clearStoredReports();
        closeModal();
        showToast('Security reports cleared');
      },
    });
  };

  const handleClearAlertsConfirm = () => {
    setModalState({
      isOpen: true,
      title: 'Clear Security Alerts?',
      message: 'All active and acknowledged alerts will be cleared from local storage.',
      confirmLabel: 'Clear Alerts',
      isDestructive: true,
      onConfirm: () => {
        clearStoredAlerts();
        closeModal();
        showToast('Security alerts cleared');
      },
    });
  };

  const handleClearSettingsConfirm = () => {
    setModalState({
      isOpen: true,
      title: 'Reset Platform Settings?',
      message: 'All custom preferences will be restored to standard defaults.',
      confirmLabel: 'Reset Settings',
      isDestructive: true,
      onConfirm: () => {
        const def = resetSettingsToDefault();
        setSettings(def);
        setTheme('dark');
        closeModal();
        showToast('Platform settings reset to defaults');
      },
    });
  };

  const handleClearAllConfirm = () => {
    setModalState({
      isOpen: true,
      title: 'Purge All Local Demo Data?',
      message:
        'This will permanently clear all scan history, reports, alerts, and custom configuration stored in your browser.',
      confirmLabel: 'Purge Everything',
      isDestructive: true,
      onConfirm: () => {
        clearDemoData();
        setSettings(DEFAULT_PLATFORM_SETTINGS);
        setTheme('dark');
        closeModal();
        showToast('All demo storage purged');
      },
    });
  };

  const navItems: NavItem[] = [
    { id: 'profile', label: '1. Profile', icon: <User className="w-4 h-4" /> },
    { id: 'appearance', label: '2. Appearance', icon: <Palette className="w-4 h-4" /> },
    { id: 'security', label: '3. Security Preferences', icon: <Shield className="w-4 h-4" /> },
    { id: 'scan', label: '4. Scan Preferences', icon: <Scan className="w-4 h-4" /> },
    { id: 'ai', label: '5. AI Analysis', icon: <Cpu className="w-4 h-4" /> },
    { id: 'robustness', label: '6. Robustness', icon: <Swords className="w-4 h-4" /> },
    { id: 'notifications', label: '7. Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'privacy', label: '8. Privacy & Data', icon: <Database className="w-4 h-4" /> },
    { id: 'demo', label: '9. Demo Environment', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'accessibility', label: '10. Accessibility', icon: <Accessibility className="w-4 h-4" /> },
    { id: 'about', label: '11. About PhishGuard', icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen pb-20 pt-6 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-8 z-50 bg-slate-900/95 border border-cyan-500/40 text-cyan-300 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-xl flex items-center gap-3 text-sm font-mono"
          >
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <ResetConfirmModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        confirmLabel={modalState.confirmLabel}
        isDestructive={modalState.isDestructive}
        onConfirm={modalState.onConfirm}
        onCancel={closeModal}
      />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
              CONFIGURATION CENTER
            </span>
            <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
              DEMO PREFERENCES
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-3">
            <Settings className="w-7 h-7 text-cyan-400" />
            <span>PLATFORM SETTINGS</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Configure threat detection calibration, user preferences, and simulation controls.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetAllDemoData}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>

      {/* Main Settings Layout (Sidebar Navigation + Active Section) */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Tabs (Sidebar on Desktop, Horizontal Scroll on Mobile) */}
        <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800 rounded-xl p-3 backdrop-blur-xl space-y-1">
          <div className="text-[11px] font-mono text-slate-500 px-3 py-2 uppercase tracking-wider">
            Configuration Sections
          </div>
          <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1 pb-2 lg:pb-0">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-mono transition-all text-left whitespace-nowrap shrink-0 lg:shrink ${
                  activeSection === item.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <div
                  className={`${
                    activeSection === item.id ? 'text-cyan-400' : 'text-slate-500'
                  }`}
                >
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Section Content */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeSection === 'profile' && (
                <ProfileSection
                  profile={settings.profile}
                  onChange={(p) => setSettings({ ...settings, profile: p })}
                  onReset={handleResetProfile}
                />
              )}

              {activeSection === 'appearance' && (
                <AppearanceSection
                  appearance={settings.appearance}
                  onChange={(a) => setSettings({ ...settings, appearance: a })}
                />
              )}

              {activeSection === 'security' && (
                <SecuritySection
                  security={settings.security}
                  onChange={(s) => setSettings({ ...settings, security: s })}
                />
              )}

              {activeSection === 'scan' && (
                <ScanSection
                  scan={settings.scan}
                  onChange={(sc) => setSettings({ ...settings, scan: sc })}
                />
              )}

              {activeSection === 'ai' && (
                <AISection
                  ai={settings.ai}
                  onChange={(ai) => setSettings({ ...settings, ai })}
                />
              )}

              {activeSection === 'robustness' && (
                <RobustnessSection
                  robustness={settings.robustness}
                  onChange={(r) => setSettings({ ...settings, robustness: r })}
                />
              )}

              {activeSection === 'notifications' && (
                <NotificationSection
                  notifications={settings.notifications}
                  onChange={(n) => setSettings({ ...settings, notifications: n })}
                />
              )}

              {activeSection === 'privacy' && (
                <PrivacyDataSection
                  onClearHistory={handleClearHistoryConfirm}
                  onClearReports={handleClearReportsConfirm}
                  onClearAlerts={handleClearAlertsConfirm}
                  onClearSettings={handleClearSettingsConfirm}
                  onClearAll={handleClearAllConfirm}
                />
              )}

              {activeSection === 'demo' && (
                <DemoEnvironmentPanel
                  onSeedHistory={handleSeedHistory}
                  onSeedReports={handleSeedReports}
                  onSeedAlerts={handleSeedAlerts}
                  onResetAllDemoData={handleResetAllDemoData}
                />
              )}

              {activeSection === 'accessibility' && (
                <AccessibilitySection
                  accessibility={settings.accessibility}
                  onChange={(acc) => setSettings({ ...settings, accessibility: acc })}
                />
              )}

              {activeSection === 'about' && <AboutSection />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

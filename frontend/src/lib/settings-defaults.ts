/**
 * PhishGuard-AR — Phase 9
 * Centralized Settings Defaults
 * 
 * 100% Frontend-Only — Default Platform Preferences
 */

import { PlatformSettings } from '@/types';

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  profile: {
    displayName: 'Lead Security Analyst',
    email: 'analyst@phishguard-ar.internal',
    role: 'SOC Incident Responder',
    organization: 'PhishGuard Defense Lab',
  },
  appearance: {
    theme: 'dark',
    accentIntensity: 'high',
    density: 'comfortable',
    animation: 'full',
  },
  security: {
    autoRunRobustness: true,
    showThreatConfirmations: true,
    showConfidenceIndicators: true,
    showForensicDetails: true,
    showAttackContext: true,
    showAIExplanations: true,
  },
  scan: {
    defaultInputType: 'EMAIL',
    defaultScenarioId: 'scenario-cred',
    autoSaveScanHistory: true,
    showScanPipeline: true,
  },
  ai: {
    modelVisualization: 'FUSION',
    showSignalContributions: true,
    showExplainability: true,
    showModelComparison: true,
    showNeuralVisualization: true,
  },
  robustness: {
    defaultAttackStrength: 'MEDIUM',
    defaultIntensity: 65,
    preserveSemantics: true,
    preserveUrlStructure: true,
    autoShowRobustnessResult: true,
  },
  notifications: {
    threatAlerts: true,
    robustnessAlerts: true,
    modelDisagreementAlerts: true,
    systemNotifications: true,
    desktopNotificationSimulation: true,
    frequency: 'immediate',
  },
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    largerText: false,
    keyboardShortcutsHints: true,
  },
};

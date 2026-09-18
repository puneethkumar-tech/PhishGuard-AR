/**
 * PhishGuard-AR — Phase 9
 * Centralized LocalStorage Management Layer
 * 
 * 100% Frontend-Only — Safe SSR Execution & Deterministic State Persistence
 */

import {
  ThreatHistoryRecord,
  ReportRecord,
  SecurityAlertRecord,
  PlatformSettings,
} from '@/types';
import { DEMO_THREAT_HISTORY } from './history-demo-data';
import { DEMO_REPORTS_DATA } from './reports-demo-data';
import { DEMO_SECURITY_ALERTS } from './alerts-demo-data';
import { DEFAULT_PLATFORM_SETTINGS } from './settings-defaults';

const STORAGE_KEYS = {
  HISTORY: 'phishguard_history_v1',
  REPORTS: 'phishguard_reports_v1',
  ALERTS: 'phishguard_alerts_v1',
  SETTINGS: 'phishguard_settings_v1',
  DEMO_STATE: 'phishguard_demo_state_v1',
};

// Safe browser check helper
export const isBrowser = (): boolean => typeof window !== 'undefined';

// Safe generic getter
export function getStoredData<T>(key: string, defaultValue: T): T {
  if (!isBrowser()) return defaultValue;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`[PhishGuard Storage] Error reading key "${key}":`, error);
    return defaultValue;
  }
}

// Safe generic setter
export function setStoredData<T>(key: string, value: T): boolean {
  if (!isBrowser()) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`[PhishGuard Storage] Error writing key "${key}":`, error);
    return false;
  }
}

// Safe generic remover
export function removeStoredData(key: string): boolean {
  if (!isBrowser()) return false;
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`[PhishGuard Storage] Error removing key "${key}":`, error);
    return false;
  }
}

// ==========================================
// THREAT HISTORY HELPERS
// ==========================================

export function getStoredHistory(): ThreatHistoryRecord[] {
  return getStoredData<ThreatHistoryRecord[]>(STORAGE_KEYS.HISTORY, DEMO_THREAT_HISTORY);
}

export function saveStoredHistory(history: ThreatHistoryRecord[]): void {
  setStoredData(STORAGE_KEYS.HISTORY, history);
}
export const setStoredHistory = saveStoredHistory;

export function addHistoryRecord(record: ThreatHistoryRecord): ThreatHistoryRecord[] {
  const current = getStoredHistory();
  const updated = [record, ...current.filter((item) => item.id !== record.id)];
  saveStoredHistory(updated);
  return updated;
}

export function deleteHistoryRecord(id: string): ThreatHistoryRecord[] {
  const current = getStoredHistory();
  const updated = current.filter((item) => item.id !== id);
  saveStoredHistory(updated);
  return updated;
}

export function clearHistory(): void {
  setStoredData(STORAGE_KEYS.HISTORY, []);
}
export const clearStoredHistory = clearHistory;

export function restoreDefaultHistory(): ThreatHistoryRecord[] {
  saveStoredHistory(DEMO_THREAT_HISTORY);
  return DEMO_THREAT_HISTORY;
}
export const resetHistoryToDefault = restoreDefaultHistory;

// ==========================================
// REPORTS HELPERS
// ==========================================

export function getStoredReports(): ReportRecord[] {
  return getStoredData<ReportRecord[]>(STORAGE_KEYS.REPORTS, DEMO_REPORTS_DATA);
}

export function saveStoredReports(reports: ReportRecord[]): void {
  setStoredData(STORAGE_KEYS.REPORTS, reports);
}
export const setStoredReports = saveStoredReports;

export function addReportRecord(report: ReportRecord): ReportRecord[] {
  const current = getStoredReports();
  const updated = [report, ...current.filter((r) => r.id !== report.id)];
  saveStoredReports(updated);
  return updated;
}

export function deleteReportRecord(id: string): ReportRecord[] {
  const current = getStoredReports();
  const updated = current.filter((r) => r.id !== id);
  saveStoredReports(updated);
  return updated;
}

export function clearReports(): void {
  setStoredData(STORAGE_KEYS.REPORTS, []);
}
export const clearStoredReports = clearReports;

export function restoreDefaultReports(): ReportRecord[] {
  saveStoredReports(DEMO_REPORTS_DATA);
  return DEMO_REPORTS_DATA;
}
export const resetReportsToDefault = restoreDefaultReports;

// ==========================================
// ALERTS HELPERS
// ==========================================

export function getStoredAlerts(): SecurityAlertRecord[] {
  return getStoredData<SecurityAlertRecord[]>(STORAGE_KEYS.ALERTS, DEMO_SECURITY_ALERTS);
}

export function saveStoredAlerts(alerts: SecurityAlertRecord[]): void {
  setStoredData(STORAGE_KEYS.ALERTS, alerts);
}
export const setStoredAlerts = saveStoredAlerts;

export function updateAlertStatus(
  id: string,
  status: 'NEW' | 'ACKNOWLEDGED' | 'RESOLVED'
): SecurityAlertRecord[] {
  const current = getStoredAlerts();
  const updated = current.map((a) => (a.id === id ? { ...a, status, isRead: true } : a));
  saveStoredAlerts(updated);
  return updated;
}

export function markAllAlertsRead(): SecurityAlertRecord[] {
  const current = getStoredAlerts();
  const updated = current.map((a) => ({ ...a, isRead: true }));
  saveStoredAlerts(updated);
  return updated;
}

export function dismissAlert(id: string): SecurityAlertRecord[] {
  const current = getStoredAlerts();
  const updated = current.filter((a) => a.id !== id);
  saveStoredAlerts(updated);
  return updated;
}

export function clearAlerts(): void {
  setStoredData(STORAGE_KEYS.ALERTS, []);
}
export const clearStoredAlerts = clearAlerts;

export function restoreDefaultAlerts(): SecurityAlertRecord[] {
  saveStoredAlerts(DEMO_SECURITY_ALERTS);
  return DEMO_SECURITY_ALERTS;
}
export const resetAlertsToDefault = restoreDefaultAlerts;

// ==========================================
// SETTINGS HELPERS
// ==========================================

export function getStoredSettings(): PlatformSettings {
  return getStoredData<PlatformSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_PLATFORM_SETTINGS);
}

export function saveStoredSettings(settings: PlatformSettings): void {
  setStoredData(STORAGE_KEYS.SETTINGS, settings);
}
export const setStoredSettings = saveStoredSettings;

export function resetSettings(): PlatformSettings {
  saveStoredSettings(DEFAULT_PLATFORM_SETTINGS);
  return DEFAULT_PLATFORM_SETTINGS;
}
export const resetSettingsToDefault = resetSettings;

// ==========================================
// GLOBAL DEMO RESET & CLEAR
// ==========================================

export function resetAllDemoData(): void {
  restoreDefaultHistory();
  restoreDefaultReports();
  restoreDefaultAlerts();
  resetSettings();
}

export function clearDemoData(): void {
  clearHistory();
  clearReports();
  clearAlerts();
  resetSettings();
}

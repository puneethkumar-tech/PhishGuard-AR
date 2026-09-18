// PHASE 7: DASHBOARD ANALYTICS & CALCULATION ENGINE
// Deterministic frontend analytics calculations over centralized demo data.
// 100% Frontend Only — Clearly labeled as SIMULATED ANALYTICS.

import {
  DashboardDataset,
  DashboardTimeRange,
  ThreatSeverityItem,
  ThreatTypeItem,
  DashboardKpiMetric,
} from '@/types';
import { DASHBOARD_DATA_MAP } from './dashboard-demo-data';

const SNAPSHOT_STORAGE_KEY = 'phishguard_dashboard_demo_state';

/**
 * Retrieve deterministic dashboard dataset based on time range and rotation seed
 */
export function getDashboardDataset(
  timeRange: DashboardTimeRange = '24H',
  seedOffset = 0
): DashboardDataset {
  const base = DASHBOARD_DATA_MAP[timeRange] || DASHBOARD_DATA_MAP['24H'];

  if (seedOffset === 0) {
    return base;
  }

  // Slight deterministic variation for simulation refresh cycles
  const postureScoreShift = (seedOffset % 3) - 1; // -1, 0, or +1
  const updatedPostureScore = Math.max(70, Math.min(99, base.postureScore + postureScoreShift));

  const now = new Date();
  const timeString = `${now.getHours().toString().padStart(2, '0')}:${now
    .getMinutes()
    .toString()
    .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

  return {
    ...base,
    snapshotTimestamp: `Simulation snapshot • ${timeString}`,
    postureScore: updatedPostureScore,
    kpis: base.kpis.map((kpi, idx) => ({
      ...kpi,
      numericValue: kpi.numericValue + (idx % 2 === 0 ? seedOffset * 3 : -seedOffset * 2),
    })),
  };
}

/**
 * Calculate total threat volume across all severity levels
 */
export function calculateThreatTotals(severityItems: ThreatSeverityItem[]): {
  totalAnalyzed: number;
  totalThreats: number;
  safeCount: number;
} {
  const totalAnalyzed = severityItems.reduce((acc, item) => acc + item.count, 0);
  const safeItem = severityItems.find((i) => i.severity === 'SAFE');
  const safeCount = safeItem ? safeItem.count : 0;
  const totalThreats = totalAnalyzed - safeCount;

  return { totalAnalyzed, totalThreats, safeCount };
}

/**
 * Format large numbers with comma separators or K/M abbreviations
 */
export function formatCompactNumber(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 10_000) {
    return `${(value / 1_000).toFixed(1)}k`;
  }
  return value.toLocaleString();
}

/**
 * LocalStorage persistence for Dashboard demo snapshot
 */
export function saveDashboardLocalSnapshot(dataset: DashboardDataset): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      SNAPSHOT_STORAGE_KEY,
      JSON.stringify({
        timeRange: dataset.timeRange,
        postureScore: dataset.postureScore,
        timestamp: dataset.snapshotTimestamp,
      })
    );
  } catch (err) {
    console.error('Failed to save dashboard snapshot in localStorage', err);
  }
}

export function loadDashboardLocalSnapshot(): {
  timeRange: DashboardTimeRange;
  postureScore: number;
  timestamp: string;
} | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SNAPSHOT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

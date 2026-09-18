'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { HistoryHeader } from '@/components/history/HistoryHeader';
import { HistoryFilterBar } from '@/components/history/HistoryFilterBar';
import { ThreatHistoryTable } from '@/components/history/ThreatHistoryTable';
import { ThreatHistoryDetail } from '@/components/history/ThreatHistoryDetail';
import { ThreatTimeline } from '@/components/history/ThreatTimeline';
import { EmptyState } from '@/components/ui/States';
import {
  getStoredHistory,
  saveStoredHistory,
  deleteHistoryRecord,
  clearHistory,
  restoreDefaultHistory,
} from '@/lib/storage';
import { ThreatHistoryRecord, HistoryFilterState } from '@/types';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
  const router = useRouter();
  const [records, setRecords] = useState<ThreatHistoryRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<ThreatHistoryRecord | null>(null);
  const [filters, setFilters] = useState<HistoryFilterState>({
    searchQuery: '',
    verdict: 'ALL',
    severity: 'ALL',
    source: 'ALL',
    dateRange: 'ALL',
    model: 'ALL',
  });

  // Load from localStorage on mount
  useEffect(() => {
    setRecords(getStoredHistory());
  }, []);

  // Filter records
  const filteredRecords = records.filter((r) => {
    // Search query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const match =
        r.id.toLowerCase().includes(q) ||
        r.input.toLowerCase().includes(q) ||
        r.threatType.toLowerCase().includes(q) ||
        r.recommendation.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Verdict filter
    if (filters.verdict !== 'ALL' && r.verdict !== filters.verdict) {
      return false;
    }

    // Severity filter
    if (filters.severity !== 'ALL' && r.severity !== filters.severity) {
      return false;
    }

    // Source filter
    if (filters.source !== 'ALL' && r.inputType !== filters.source) {
      return false;
    }

    // Model filter
    if (filters.model !== 'ALL' && r.modelBranch !== filters.model) {
      return false;
    }

    return true;
  });

  const handleRefresh = () => {
    setRecords(getStoredHistory());
  };

  const handleClear = () => {
    if (typeof window !== 'undefined' && window.confirm('Clear all stored threat history?')) {
      clearHistory();
      setRecords([]);
      setSelectedRecord(null);
    }
  };

  const handleRestoreDefaults = () => {
    const defaults = restoreDefaultHistory();
    setRecords(defaults);
  };

  const handleDeleteRecord = (id: string) => {
    const updated = deleteHistoryRecord(id);
    setRecords(updated);
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      verdict: 'ALL',
      severity: 'ALL',
      source: 'ALL',
      dateRange: 'ALL',
      model: 'ALL',
    });
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* 1. Header & KPI Metrics */}
        <HistoryHeader
          records={records}
          onRefresh={handleRefresh}
          onClear={handleClear}
          onRestoreDefaults={handleRestoreDefaults}
        />

        {/* 2. Filter Bar */}
        <HistoryFilterBar
          filters={filters}
          onChangeFilters={setFilters}
          onResetFilters={handleResetFilters}
        />

        {/* 3. Threat History Table */}
        {records.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-8 text-center font-mono">
            <EmptyState
              title="No Threat History Yet"
              description="Run a demo scan or test adversarial robustness to populate your security timeline."
              actionLabel="Run Demo Scan"
              onAction={() => router.push('/scan')}
            />
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-8 text-center font-mono">
            <EmptyState
              title="No Matching Records Found"
              description="No scan history matches your active search term or filter parameters."
              actionLabel="Reset Filters"
              onAction={handleResetFilters}
            />
          </div>
        ) : (
          <ThreatHistoryTable
            records={filteredRecords}
            onSelectRecord={setSelectedRecord}
          />
        )}

        {/* 4. Forensic Timeline Overview */}
        <ThreatTimeline record={selectedRecord} />

        {/* 5. Detail Modal */}
        {selectedRecord && (
          <ThreatHistoryDetail
            record={selectedRecord}
            onClose={() => setSelectedRecord(null)}
            onDeleteRecord={handleDeleteRecord}
          />
        )}
      </div>
    </PageContainer>
  );
}

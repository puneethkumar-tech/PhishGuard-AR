'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { ReportDashboardMetrics } from '@/components/reports/ReportDashboardMetrics';
import { ReportGenerator } from '@/components/reports/ReportGenerator';
import { ReportPreview } from '@/components/reports/ReportPreview';
import { ReportTable } from '@/components/reports/ReportTable';
import { SimulatedExportModal } from '@/components/reports/SimulatedExportModal';
import { EmptyState } from '@/components/ui/States';
import {
  getStoredReports,
  deleteReportRecord,
  addReportRecord,
  restoreDefaultReports,
  clearReports,
} from '@/lib/storage';
import { ReportRecord } from '@/types';

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportRecord | null>(null);
  const [exportReport, setExportReport] = useState<ReportRecord | null>(null);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Load stored reports
  useEffect(() => {
    setReports(getStoredReports());
  }, []);

  const handleSeedDefaults = () => {
    const defaults = restoreDefaultReports();
    setReports(defaults);
  };

  const handleDeleteReport = (id: string) => {
    const updated = deleteReportRecord(id);
    setReports(updated);
    if (selectedReport?.id === id) {
      setSelectedReport(null);
    }
  };

  const handleDuplicateReport = (report: ReportRecord) => {
    const duplicated: ReportRecord = {
      ...report,
      id: `RPT-${new Date().getFullYear()}-${Math.floor(1000 + (Date.now() % 9000))}`,
      title: `${report.title} (Copy)`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    const updated = addReportRecord(duplicated);
    setReports(updated);
  };

  const filteredReports = reports.filter((r) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      r.id.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q) ||
      r.sourceLabel.toLowerCase().includes(q) ||
      r.verdict.toLowerCase().includes(q)
    );
  });

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* 1. Header & Metrics */}
        <ReportDashboardMetrics
          reports={reports}
          onOpenGenerator={() => setIsGeneratorOpen(true)}
          onSeedDefaults={handleSeedDefaults}
        />

        {/* 2. Search & List Controls */}
        <div className="flex items-center justify-between gap-4 rounded-xl border border-cyan-500/20 bg-slate-950/80 p-3.5 backdrop-blur-md font-mono text-xs">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter reports by ID, title, verdict, or source keyword..."
            className="w-full bg-slate-900/90 rounded-lg border border-slate-800 px-3.5 py-2 text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="text-slate-400 hover:text-slate-200 text-xs px-2"
            >
              Clear
            </button>
          )}
        </div>

        {/* 3. Reports Table */}
        {reports.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-8 text-center font-mono">
            <EmptyState
              title="No Reports Generated Yet"
              description="Compile an executive brief or seed demo reports to view simulated cybersecurity dossiers."
              actionLabel="Generate Report"
              onAction={() => setIsGeneratorOpen(true)}
            />
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-8 text-center font-mono">
            <EmptyState
              title="No Matching Reports Found"
              description="No stored reports match your active search filter."
              actionLabel="Clear Filter"
              onAction={() => setSearchTerm('')}
            />
          </div>
        ) : (
          <ReportTable
            reports={filteredReports}
            onSelectReport={setSelectedReport}
            onExportReport={setExportReport}
            onDeleteReport={handleDeleteReport}
            onDuplicateReport={handleDuplicateReport}
          />
        )}

        {/* 4. Generator Modal */}
        <ReportGenerator
          isOpen={isGeneratorOpen}
          onClose={() => setIsGeneratorOpen(false)}
          onReportCreated={(newRpt) => {
            setReports(getStoredReports());
            setSelectedReport(newRpt);
          }}
        />

        {/* 5. Report Preview Drawer / Modal */}
        {selectedReport && (
          <ReportPreview
            report={selectedReport}
            onClose={() => setSelectedReport(null)}
            onOpenExport={(rpt) => setExportReport(rpt)}
          />
        )}

        {/* 6. Export Modal */}
        {exportReport && (
          <SimulatedExportModal
            report={exportReport}
            onClose={() => setExportReport(null)}
          />
        )}
      </div>
    </PageContainer>
  );
}

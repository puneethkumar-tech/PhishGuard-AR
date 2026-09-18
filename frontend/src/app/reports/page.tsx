'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { GlowButton } from '@/components/ui/GlowButton';
import {
  FileText,
  Download,
  Share2,
  Shield,
  Calendar,
  CheckCircle2,
  Layers,
  ArrowUpRight,
  X,
  FileCheck,
  Check,
} from 'lucide-react';
import { DEMO_REPORTS } from '@/lib/demo-data';
import { ReportDossier } from '@/types';

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<ReportDossier | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleSimulateDownload = (reportTitle: string) => {
    setDownloadSuccess(reportTitle);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  return (
    <PageContainer>
      {/* 1. Page Header */}
      <PageHeader
        eyebrow="INTELLIGENCE REPORTS"
        title="Threat Intelligence & Forensic Reports"
        description="Comprehensive summary dossiers, adversarial robustness evaluation briefs, and structured STIX/JSON export packages."
        statusBadge={{ label: "Dossiers Ready", variant: "cyan", dot: true }}
      />

      {/* 2. Download Feedback Banner */}
      <AnimatePresence>
        {downloadSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-cyber-success/15 border border-cyber-success/40 text-cyber-success flex items-center justify-between text-xs font-mono"
          >
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Demo Export Bundle Prepared: &quot;{downloadSuccess}&quot;</span>
            </div>
            <span className="text-[10px] text-cyber-success/80">Phase 2 Simulation</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DEMO_REPORTS.map((report) => (
          <GlassCard key={report.id} className="p-6 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-primary/20 text-primary-bright group-hover:bg-primary/30 transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <Badge
                  variant={
                    report.status === 'VERIFIED'
                      ? 'success'
                      : report.status === 'ACTIVE BENCHMARK'
                      ? 'violet'
                      : 'primary'
                  }
                  size="sm"
                >
                  {report.status}
                </Badge>
              </div>

              <div>
                <span className="text-[10px] font-mono text-cyber-cyan uppercase tracking-wider block">
                  {report.category}
                </span>
                <h3 className="text-base font-bold text-text mt-1 leading-snug">
                  {report.title}
                </h3>
                <p className="text-xs text-text-muted mt-2 leading-relaxed line-clamp-3">
                  {report.summary}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface-2/80 border border-border text-xs space-y-1">
                <div className="flex justify-between text-text-muted">
                  <span>Samples Evaluated:</span>
                  <span className="font-mono text-text font-bold">{report.samplesAnalyzed.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Metric / Score:</span>
                  <span className="font-mono text-cyber-cyan font-bold">{report.threatScore}</span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-border/60 flex items-center justify-between gap-2">
              <span className="text-[11px] text-text-muted font-mono">{report.date}</span>

              <div className="flex items-center gap-2">
                <GlowButton
                  size="sm"
                  variant="secondary"
                  onClick={() => setSelectedReport(report)}
                >
                  View Details
                </GlowButton>

                <button
                  onClick={() => handleSimulateDownload(report.title)}
                  className="p-2 rounded-xl bg-surface-2 text-text-muted hover:text-text hover:bg-surface-3 border border-border transition-colors"
                  title="Simulate Download Export"
                >
                  <Download className="w-4 h-4 text-cyber-cyan" />
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* 4. Report Detail Modal */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReport(null)}
              className="fixed inset-0 bg-background/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl rounded-2xl bg-surface/95 border border-border shadow-2xl p-6 sm:p-8 backdrop-blur-2xl z-10 space-y-5"
            >
              <div className="flex items-start justify-between pb-4 border-b border-border/70">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-cyber-cyan">
                      {selectedReport.id}
                    </span>
                    <span className="text-xs text-text-muted font-mono">• {selectedReport.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-text">{selectedReport.title}</h3>
                </div>

                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-3"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase font-bold text-text-muted mb-1.5">
                  Executive Summary:
                </h4>
                <p className="text-xs text-text leading-relaxed bg-surface-2/80 p-3.5 rounded-xl border border-border">
                  {selectedReport.summary}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase font-bold text-text-muted mb-2">
                  Key Intelligence Findings (Dossier Preview):
                </h4>
                <ul className="space-y-2 text-xs text-text-muted">
                  {selectedReport.keyFindings.map((finding, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyber-cyan mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/60">
                <span className="text-xs text-text-muted font-mono">Format: {selectedReport.format}</span>

                <div className="flex items-center gap-2">
                  <GlowButton
                    size="sm"
                    variant="primary"
                    leftIcon={<Download className="w-3.5 h-3.5" />}
                    onClick={() => {
                      handleSimulateDownload(selectedReport.title);
                      setSelectedReport(null);
                    }}
                  >
                    Export Dossier
                  </GlowButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}

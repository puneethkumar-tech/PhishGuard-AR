'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { GlowButton } from '@/components/ui/GlowButton';
import { EmptyState } from '@/components/ui/States';
import {
  History,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  Eye,
  X,
  Calendar,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Bookmark,
} from 'lucide-react';
import { DEMO_DETAILED_LOGS } from '@/lib/demo-data';
import { getLocalScanHistory } from '@/lib/scan-engine';
import { DetailedScanLog } from '@/types';

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [selectedLog, setSelectedLog] = useState<DetailedScanLog | null>(null);
  const [allLogs, setAllLogs] = useState<DetailedScanLog[]>(DEMO_DETAILED_LOGS);

  // Load any local scans saved by user in scanner
  useEffect(() => {
    const localScans = getLocalScanHistory();
    if (localScans.length > 0) {
      const convertedLocalLogs: DetailedScanLog[] = localScans.map((scan) => ({
        id: scan.id,
        timestamp: scan.timestamp.replace('T', ' ').substring(0, 19),
        target: scan.input.substring(0, 48) + (scan.input.length > 48 ? '...' : ''),
        preview: scan.input,
        type: scan.mode === 'url' ? 'URL Link' : scan.mode === 'email' ? 'Email Header & Body' : scan.mode === 'upload' ? 'File Attachment' : 'Text Content',
        verdict: scan.verdict as any,
        confidence: scan.confidenceText,
        threatLevel: scan.threatLevel,
        indicators: scan.signals,
        recommendation: scan.recommendation,
      }));

      // Combine local with demo logs
      setAllLogs([...convertedLocalLogs, ...DEMO_DETAILED_LOGS]);
    }
  }, []);

  const filteredLogs = allLogs.filter((log) => {
    const matchesSearch =
      log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.preview.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity =
      severityFilter === 'ALL' ||
      (severityFilter === 'SAFE' && log.threatLevel === 'safe') ||
      (severityFilter === 'SUSPICIOUS' && log.threatLevel === 'suspicious') ||
      (severityFilter === 'PHISHING' && log.threatLevel === 'phishing') ||
      (severityFilter === 'ADVERSARIAL' && log.threatLevel === 'adversarial') ||
      (severityFilter === 'BLOCKED' && log.threatLevel === 'blocked');

    const matchesType = typeFilter === 'ALL' || log.type === typeFilter;

    return matchesSearch && matchesSeverity && matchesType;
  });

  const getVerdictBadge = (verdict: string, threatLevel: string) => {
    switch (threatLevel) {
      case 'safe':
        return <Badge variant="success" size="sm">{verdict}</Badge>;
      case 'suspicious':
        return <Badge variant="warning" size="sm">{verdict}</Badge>;
      case 'adversarial':
        return <Badge variant="violet" size="sm">{verdict}</Badge>;
      default:
        return <Badge variant="danger" size="sm">{verdict}</Badge>;
    }
  };

  return (
    <PageContainer>
      {/* 1. Standard Page Header */}
      <PageHeader
        eyebrow="AUDIT INTELLIGENCE"
        title="Scan Audit History & Logs"
        description="Comprehensive historic audit logs of messages, URLs, and attachments evaluated by the PhishGuard-AR dual-engine."
        statusBadge={{ label: "Audit Stream Active", variant: "cyan", dot: true }}
      />

      {/* 2. Search & Filter Bar */}
      <GlassCard className="p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search logs by ID, target subject, or keywords..."
              className="w-full bg-surface-2 border border-border/80 rounded-xl pl-10 pr-4 py-2 text-xs text-text placeholder-text-muted/70 focus:outline-none focus:border-cyber-cyan transition-colors"
            />
          </div>

          {/* Severity Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {['ALL', 'SAFE', 'SUSPICIOUS', 'PHISHING', 'ADVERSARIAL', 'BLOCKED'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  severityFilter === sev
                    ? 'bg-gradient-to-r from-primary to-primary-bright text-white shadow-glass-glow'
                    : 'bg-surface-2 text-text-muted hover:text-text hover:bg-surface-3 border border-border/60'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* 3. Audit Log Table */}
      <GlassCard className="p-6">
        {filteredLogs.length === 0 ? (
          <EmptyState
            title="No Matching Audit Logs Found"
            description="No scan records match your active search term and filter criteria."
            actionLabel="Reset Filters"
            onAction={() => {
              setSearchTerm('');
              setSeverityFilter('ALL');
              setTypeFilter('ALL');
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/70 text-text-muted font-mono uppercase tracking-wider text-[11px]">
                  <th className="pb-3.5 font-semibold">Log ID</th>
                  <th className="pb-3.5 font-semibold">Timestamp</th>
                  <th className="pb-3.5 font-semibold">Target / Subject</th>
                  <th className="pb-3.5 font-semibold">Scan Type</th>
                  <th className="pb-3.5 font-semibold">Verdict</th>
                  <th className="pb-3.5 font-semibold">Confidence</th>
                  <th className="pb-3.5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-sans">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-2/60 transition-colors group">
                    <td className="py-3.5 font-mono text-primary-bright font-bold">
                      {log.id}
                    </td>
                    <td className="py-3.5 text-text-muted font-mono text-[11px] whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3.5 font-medium text-text max-w-xs truncate">
                      {log.target}
                    </td>
                    <td className="py-3.5 text-text-muted">{log.type}</td>
                    <td className="py-3.5">
                      {getVerdictBadge(log.verdict, log.threatLevel)}
                    </td>
                    <td className="py-3.5 font-mono font-bold text-text">
                      {log.confidence}
                    </td>
                    <td className="py-3.5 text-right">
                      <GlowButton
                        size="sm"
                        variant="secondary"
                        onClick={() => setSelectedLog(log)}
                        leftIcon={<Eye className="w-3.5 h-3.5 text-cyber-cyan" />}
                      >
                        Inspect
                      </GlowButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* 4. Detailed Audit Record Inspection Modal */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLog(null)}
              className="fixed inset-0 bg-background/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl rounded-2xl bg-surface/95 border border-border shadow-2xl p-6 sm:p-8 backdrop-blur-2xl z-10 space-y-5"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-4 border-b border-border/70">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-primary-bright">
                      {selectedLog.id}
                    </span>
                    <span className="text-xs text-text-muted font-mono">• {selectedLog.timestamp}</span>
                  </div>
                  <h3 className="text-lg font-bold text-text">{selectedLog.target}</h3>
                </div>

                <button
                  onClick={() => setSelectedLog(null)}
                  className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-3"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Verdict Summary */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-surface-2 border border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-surface-3 border border-border">
                    {selectedLog.threatLevel === 'safe' ? (
                      <ShieldCheck className="w-5 h-5 text-cyber-success" />
                    ) : (
                      <ShieldAlert className="w-5 h-5 text-cyber-danger" />
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-text-muted block">
                      Ensemble Verdict
                    </span>
                    <span className="text-sm font-bold text-text">{selectedLog.verdict}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-text-muted block">
                    Confidence Score
                  </span>
                  <span className="text-base font-bold font-mono text-cyber-cyan">
                    {selectedLog.confidence}
                  </span>
                </div>
              </div>

              {/* Raw Payload Preview */}
              <div>
                <h4 className="text-xs font-mono uppercase font-bold text-text-muted mb-1.5">
                  Payload Extract Preview:
                </h4>
                <div className="p-3.5 rounded-xl bg-surface-2/90 border border-border text-xs font-mono text-text-muted leading-relaxed">
                  &quot;{selectedLog.preview}&quot;
                </div>
              </div>

              {/* Security Indicators Flagged */}
              <div>
                <h4 className="text-xs font-mono uppercase font-bold text-text-muted mb-2">
                  Flagged Indicators of Compromise (IoC):
                </h4>
                <ul className="space-y-1.5 text-xs text-text-muted">
                  {selectedLog.indicators.map((ind, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-cyber-warning mt-0.5 flex-shrink-0" />
                      <span>{ind}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Plain-Language Recommendation */}
              <div className="p-3.5 rounded-xl bg-surface-2 border border-primary-bright/30">
                <span className="text-[10px] uppercase font-mono text-primary-bright font-bold block mb-1">
                  SOC Recommendation:
                </span>
                <p className="text-xs text-text leading-relaxed">
                  {selectedLog.recommendation}
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <GlowButton size="sm" variant="secondary" onClick={() => setSelectedLog(null)}>
                  Close Inspection
                </GlowButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}

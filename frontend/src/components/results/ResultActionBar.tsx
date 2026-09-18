'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { GlowButton } from '@/components/ui/GlowButton';
import { ScanResult } from '@/types';
import {
  RotateCcw,
  FlaskConical,
  Bookmark,
  Check,
  History,
  Download,
  FileCode,
  X,
  Copy,
} from 'lucide-react';
import { saveScanToLocalHistory } from '@/lib/scan-engine';

interface ResultActionBarProps {
  result: ScanResult;
  onRunAgain: () => void;
}

export const ResultActionBar: React.FC<ResultActionBarProps> = ({
  result,
  onRunAgain,
}) => {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isExportCopied, setIsExportCopied] = useState(false);

  const handleSave = () => {
    saveScanToLocalHistory(result);
    setIsSaved(true);
  };

  const exportJsonString = JSON.stringify(
    {
      phishguard_audit_schema: 'STIX_2.1_SIMULATION',
      scan_id: result.id,
      timestamp: result.timestamp,
      verdict: result.verdict,
      severity: result.severity,
      confidence: result.confidence,
      threat_signals: result.signals,
      mitre_mapping: result.mitreContext,
      recommendation: result.recommendation,
    },
    null,
    2
  );

  const handleCopyExport = () => {
    navigator.clipboard.writeText(exportJsonString);
    setIsExportCopied(true);
    setTimeout(() => setIsExportCopied(false), 2000);
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-border/70">
        <div className="flex flex-wrap items-center gap-2">
          <GlowButton
            variant="secondary"
            size="sm"
            onClick={onRunAgain}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Run Again
          </GlowButton>

          <GlowButton
            variant="ghost"
            size="sm"
            onClick={handleSave}
            leftIcon={isSaved ? <Check className="w-3.5 h-3.5 text-cyber-success" /> : <Bookmark className="w-3.5 h-3.5" />}
          >
            {isSaved ? 'Saved in Local History' : 'Save to History'}
          </GlowButton>

          <Link href="/history">
            <GlowButton
              variant="ghost"
              size="sm"
              leftIcon={<History className="w-3.5 h-3.5" />}
            >
              View History
            </GlowButton>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <GlowButton
            variant="ghost"
            size="sm"
            onClick={() => setIsExportOpen(true)}
            leftIcon={<Download className="w-3.5 h-3.5 text-cyber-cyan" />}
          >
            Export Analysis
          </GlowButton>

          <Link
            href="/robustness"
            onClick={() => {
              if (typeof window !== 'undefined') {
                localStorage.setItem(
                  'phishguard_active_scan_sample',
                  JSON.stringify({
                    input: result.input,
                    isHomoglyph: result.isHomoglyph,
                  })
                );
              }
            }}
          >
            <GlowButton
              variant="primary"
              size="sm"
              rightIcon={<FlaskConical className="w-3.5 h-3.5 ml-1" />}
            >
              Test in Robustness Lab →
            </GlowButton>
          </Link>
        </div>
      </div>

      {/* Simulated JSON / STIX Export Modal */}
      <AnimatePresence>
        {isExportOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExportOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl rounded-2xl bg-surface/95 border border-border shadow-2xl p-6 backdrop-blur-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-cyber-cyan" />
                  <h4 className="text-sm font-bold text-text">
                    Forensic Analysis Export Package (STIX 2.1 Demo)
                  </h4>
                </div>

                <button
                  onClick={() => setIsExportOpen(false)}
                  className="p-1 rounded-lg text-text-muted hover:text-text hover:bg-surface-3"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-2 border border-border text-[11px] font-mono text-cyber-cyan max-h-60 overflow-y-auto leading-relaxed">
                <pre>{exportJsonString}</pre>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] font-mono text-text-muted">
                  ● Ready for SIEM Ingestion (Frontend Demo)
                </span>

                <div className="flex items-center gap-2">
                  <GlowButton
                    size="sm"
                    variant="secondary"
                    onClick={handleCopyExport}
                    leftIcon={isExportCopied ? <Check className="w-3.5 h-3.5 text-cyber-success" /> : <Copy className="w-3.5 h-3.5" />}
                  >
                    {isExportCopied ? 'Copied to Clipboard' : 'Copy JSON'}
                  </GlowButton>

                  <GlowButton
                    size="sm"
                    variant="primary"
                    onClick={() => setIsExportOpen(false)}
                  >
                    Done
                  </GlowButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

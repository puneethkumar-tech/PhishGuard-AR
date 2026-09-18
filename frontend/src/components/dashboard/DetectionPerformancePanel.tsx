'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { DetectionPerformanceData } from '@/types';
import { Cpu, CheckCircle2, Award, Sparkles, BarChart2 } from 'lucide-react';

interface DetectionPerformancePanelProps {
  data: DetectionPerformanceData;
}

export const DetectionPerformancePanel: React.FC<DetectionPerformancePanelProps> = ({ data }) => {
  const metrics = [
    { label: 'Precision', value: `${data.precision}%`, desc: 'True positives vs total flagged', color: 'text-cyber-success', barVal: data.precision },
    { label: 'Recall', value: `${data.recall}%`, desc: 'Total phishing detected', color: 'text-cyber-cyan', barVal: data.recall },
    { label: 'F1 Score', value: `${data.f1Score}%`, desc: 'Harmonic mean of precision & recall', color: 'text-primary-bright', barVal: data.f1Score },
    { label: 'Accuracy', value: `${data.accuracy}%`, desc: 'Overall classification correctness', color: 'text-purple-300', barVal: data.accuracy },
    { label: 'False Positive Rate (FPR)', value: `${data.falsePositiveRate}%`, desc: 'Benign misflagged frequency', color: 'text-cyber-warning', barVal: data.falsePositiveRate * 10 },
    { label: 'False Negative Rate (FNR)', value: `${data.falseNegativeRate}%`, desc: 'Evasion miss probability', color: 'text-cyber-danger', barVal: data.falseNegativeRate * 5 },
  ];

  return (
    <GlassCard className="p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/20 text-primary-bright">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text uppercase tracking-wider font-mono">
              Detection Performance Benchmarks
            </h3>
            <p className="text-[11px] text-text-muted">
              Evaluated on {data.benchmarkModelName} test dataset.
            </p>
          </div>
        </div>

        <Badge variant="primary" size="sm">
          SIMULATED BENCHMARK
        </Badge>
      </div>

      {/* Grid of 6 Performance Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="p-3.5 rounded-xl bg-surface-2/70 border border-border space-y-2 hover:border-border/80 transition-all"
          >
            <span className="text-[10px] font-mono text-text-muted uppercase block leading-tight">
              {m.label}
            </span>

            <div className={`text-2xl font-extrabold font-mono ${m.color}`}>
              {m.value}
            </div>

            <p className="text-[10px] text-text-muted leading-tight">
              {m.desc}
            </p>

            <div className="w-full h-1.5 rounded-full bg-surface-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-current transition-all duration-700"
                style={{ width: `${Math.min(100, m.barVal)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[10px] font-mono text-text-muted">
        <span>● Multi-fold cross-validation</span>
        <span>Not a production evaluation</span>
      </div>
    </GlassCard>
  );
};

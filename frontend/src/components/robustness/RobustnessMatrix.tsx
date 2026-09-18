'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { RobustnessMatrixRow } from '@/types';
import { Table, ChevronDown, ChevronUp, ShieldCheck, Sparkles, AlertTriangle } from 'lucide-react';

interface RobustnessMatrixProps {
  matrixData: RobustnessMatrixRow[];
}

export const RobustnessMatrix: React.FC<RobustnessMatrixProps> = ({ matrixData }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStabilityBadge = (stability: string) => {
    switch (stability) {
      case 'ROBUST':
        return <Badge variant="success" size="sm">ROBUST</Badge>;
      case 'HIGH':
        return <Badge variant="cyan" size="sm">HIGH</Badge>;
      case 'MODERATE':
        return <Badge variant="warning" size="sm">MODERATE</Badge>;
      default:
        return <Badge variant="danger" size="sm">LOW</Badge>;
    }
  };

  return (
    <GlassCard className="p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyber-violet/20 text-purple-300">
            <Table className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text uppercase tracking-wider font-mono">
              Adversarial Technique × Model Response Matrix
            </h3>
            <p className="text-[11px] text-text-muted">
              Comparative benchmark of detection degradation and recovery across all 7 attack vectors.
            </p>
          </div>
        </div>

        <Badge variant="violet" size="sm">
          SIMULATED BENCHMARK
        </Badge>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-border/70 text-text-muted text-[10px] uppercase">
              <th className="py-2.5 px-3">Attack Strategy</th>
              <th className="py-2.5 px-3">Original Confidence</th>
              <th className="py-2.5 px-3">Perturbed Confidence</th>
              <th className="py-2.5 px-3">Hardened Confidence</th>
              <th className="py-2.5 px-3">Confidence Delta</th>
              <th className="py-2.5 px-3">Stability Rating</th>
              <th className="py-2.5 px-3 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {matrixData.map((row) => {
              const isExpanded = expandedId === row.attackId;

              return (
                <React.Fragment key={row.attackId}>
                  <tr
                    onClick={() => toggleRow(row.attackId)}
                    className="hover:bg-surface-2/60 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-3 font-bold text-text flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan" />
                      {row.attackName}
                    </td>
                    <td className="py-3 px-3 text-text font-bold">{row.original.toFixed(1)}%</td>
                    <td className="py-3 px-3 text-red-300 font-bold">{row.perturbed.toFixed(1)}%</td>
                    <td className="py-3 px-3 text-green-300 font-bold">{row.hardened.toFixed(1)}%</td>
                    <td className="py-3 px-3 text-cyber-danger font-bold">{row.confidenceDelta}</td>
                    <td className="py-3 px-3">{getStabilityBadge(row.stability)}</td>
                    <td className="py-3 px-3 text-right text-text-muted">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 inline-block text-cyber-cyan" />
                      ) : (
                        <ChevronDown className="w-4 h-4 inline-block" />
                      )}
                    </td>
                  </tr>

                  {/* Expanded Detail View */}
                  {isExpanded && (
                    <tr className="bg-surface-3/50">
                      <td colSpan={7} className="p-4 space-y-2 border-b border-border">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="p-3 rounded-lg bg-surface-2 border border-border">
                            <span className="text-[10px] text-text-muted font-bold block uppercase">
                              Technique Mechanism
                            </span>
                            <p className="text-text mt-1 text-[11px] leading-relaxed">
                              {row.techniqueSummary}
                            </p>
                          </div>

                          <div className="p-3 rounded-lg bg-surface-2 border border-border">
                            <span className="text-[10px] text-cyber-success font-bold block uppercase">
                              Defensive Countermeasure
                            </span>
                            <p className="text-cyber-cyan mt-1 text-[11px] leading-relaxed">
                              {row.defenseStrategy}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};

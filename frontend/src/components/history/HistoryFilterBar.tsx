'use client';

import React from 'react';
import { Search, Filter, Calendar, Cpu, Layers, Tag, X } from 'lucide-react';
import { HistoryFilterState, ThreatVerdict, ThreatSeverityLevel, ScanSourceType, AIModelBranch } from '@/types';

interface HistoryFilterBarProps {
  filters: HistoryFilterState;
  onChangeFilters: (filters: HistoryFilterState) => void;
  onResetFilters: () => void;
}

export const HistoryFilterBar: React.FC<HistoryFilterBarProps> = ({
  filters,
  onChangeFilters,
  onResetFilters,
}) => {
  const verdictOptions: ('ALL' | ThreatVerdict)[] = [
    'ALL',
    'SAFE',
    'SUSPICIOUS',
    'PHISHING',
    'ADVERSARIAL',
    'BLOCKED',
  ];

  const severityOptions: ('ALL' | ThreatSeverityLevel)[] = [
    'ALL',
    'LOW',
    'MEDIUM',
    'HIGH',
    'CRITICAL',
  ];

  const sourceOptions: ('ALL' | ScanSourceType)[] = [
    'ALL',
    'EMAIL',
    'URL',
    'TEXT',
    'FILE',
  ];

  const dateOptions: { id: HistoryFilterState['dateRange']; label: string }[] = [
    { id: 'ALL', label: 'All Dates' },
    { id: 'TODAY', label: 'Today' },
    { id: 'LAST_7_DAYS', label: 'Last 7 Days' },
    { id: 'LAST_30_DAYS', label: 'Last 30 Days' },
  ];

  const modelOptions: { id: 'ALL' | AIModelBranch; label: string }[] = [
    { id: 'ALL', label: 'All Models' },
    { id: 'TF_IDF_SVM', label: 'TF-IDF + SVM' },
    { id: 'DISTILBERT_TRANSFORMER', label: 'DistilBERT AR' },
    { id: 'BAYESIAN_FUSION', label: 'Bayesian Fusion' },
  ];

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.verdict !== 'ALL' ||
    filters.severity !== 'ALL' ||
    filters.source !== 'ALL' ||
    filters.dateRange !== 'ALL' ||
    filters.model !== 'ALL';

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-slate-950/80 p-4 backdrop-blur-md space-y-3 font-mono text-xs">
      {/* Top Row: Search Input & Date / Model Selectors */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onChangeFilters({ ...filters, searchQuery: e.target.value })}
            placeholder="Search threats by ID (e.g. PHG-0001), keywords, domain, or payload..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-10 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 shadow-inner"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => onChangeFilters({ ...filters, searchQuery: '' })}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Dropdowns: Date Range & Model Branch */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Selector */}
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1.5">
            <Calendar className="h-3.5 w-3.5 text-cyan-400" />
            <select
              value={filters.dateRange}
              onChange={(e) =>
                onChangeFilters({
                  ...filters,
                  dateRange: e.target.value as HistoryFilterState['dateRange'],
                })
              }
              className="bg-transparent text-slate-300 focus:outline-none text-[11px]"
            >
              {dateOptions.map((opt) => (
                <option key={opt.id} value={opt.id} className="bg-slate-900 text-slate-200">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Model Selector */}
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1.5">
            <Cpu className="h-3.5 w-3.5 text-cyan-400" />
            <select
              value={filters.model}
              onChange={(e) =>
                onChangeFilters({
                  ...filters,
                  model: e.target.value as 'ALL' | AIModelBranch,
                })
              }
              className="bg-transparent text-slate-300 focus:outline-none text-[11px]"
            >
              {modelOptions.map((opt) => (
                <option key={opt.id} value={opt.id} className="bg-slate-900 text-slate-200">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-[11px] text-rose-300 hover:bg-rose-500/20 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Bottom Filter Row: Verdict & Source Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-3">
        {/* Verdict Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] uppercase text-slate-400 font-semibold mr-1">Verdict:</span>
          {verdictOptions.map((v) => {
            const isActive = filters.verdict === v;
            return (
              <button
                key={v}
                type="button"
                onClick={() => onChangeFilters({ ...filters, verdict: v })}
                className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-all ${
                  isActive
                    ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {v}
              </button>
            );
          })}
        </div>

        {/* Source Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] uppercase text-slate-400 font-semibold mr-1">Source:</span>
          {sourceOptions.map((src) => {
            const isActive = filters.source === src;
            return (
              <button
                key={src}
                type="button"
                onClick={() => onChangeFilters({ ...filters, source: src })}
                className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-all ${
                  isActive
                    ? 'border-blue-400 bg-blue-500/20 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {src}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

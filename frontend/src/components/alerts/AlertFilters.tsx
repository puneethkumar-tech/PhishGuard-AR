'use client';

import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { AlertSeverityType, AlertStatusType } from '@/types';

interface AlertFiltersProps {
  statusFilter: 'ALL' | AlertStatusType;
  onChangeStatusFilter: (status: 'ALL' | AlertStatusType) => void;
  severityFilter: 'ALL' | AlertSeverityType;
  onChangeSeverityFilter: (severity: 'ALL' | AlertSeverityType) => void;
  searchQuery: string;
  onChangeSearchQuery: (query: string) => void;
}

export const AlertFilters: React.FC<AlertFiltersProps> = ({
  statusFilter,
  onChangeStatusFilter,
  severityFilter,
  onChangeSeverityFilter,
  searchQuery,
  onChangeSearchQuery,
}) => {
  const statusOptions: ('ALL' | AlertStatusType)[] = [
    'ALL',
    'NEW',
    'ACKNOWLEDGED',
    'RESOLVED',
  ];

  const severityOptions: ('ALL' | AlertSeverityType)[] = [
    'ALL',
    'CRITICAL',
    'HIGH',
    'MEDIUM',
    'LOW',
  ];

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-slate-950/80 p-4 font-mono text-xs backdrop-blur-md space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onChangeSearchQuery(e.target.value)}
            placeholder="Search alerts by title, threat vector, ID, or source..."
            className="w-full rounded-lg border border-slate-800 bg-slate-900/90 pl-9 pr-8 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onChangeSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-3">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] uppercase text-slate-400 font-bold mr-1">Status:</span>
          {statusOptions.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => onChangeStatusFilter(st)}
              className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-all ${
                statusFilter === st
                  ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Severity Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] uppercase text-slate-400 font-bold mr-1">Severity:</span>
          {severityOptions.map((sev) => (
            <button
              key={sev}
              type="button"
              onClick={() => onChangeSeverityFilter(sev)}
              className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-all ${
                severityFilter === sev
                  ? 'border-rose-400 bg-rose-500/20 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

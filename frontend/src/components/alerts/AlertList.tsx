'use client';

import React from 'react';
import { AlertCard } from './AlertCard';
import { SecurityAlertRecord } from '@/types';
import { EmptyState } from '@/components/ui/States';

interface AlertListProps {
  alerts: SecurityAlertRecord[];
  onSelectAlert: (alert: SecurityAlertRecord) => void;
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
  onDismiss: (id: string) => void;
  onResetFilters: () => void;
}

export const AlertList: React.FC<AlertListProps> = ({
  alerts,
  onSelectAlert,
  onAcknowledge,
  onResolve,
  onDismiss,
  onResetFilters,
}) => {
  if (alerts.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-8 text-center font-mono">
        <EmptyState
          title="No Matching Security Alerts"
          description="No simulated alerts match your selected status and severity filters."
          actionLabel="Reset Filters"
          onAction={onResetFilters}
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <AlertCard
          key={alert.id}
          alert={alert}
          onSelect={onSelectAlert}
          onAcknowledge={onAcknowledge}
          onResolve={onResolve}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
};

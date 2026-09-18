'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  Bell,
  RefreshCw,
  Trash2,
  CheckCheck,
  AlertTriangle,
  RotateCcw,
  Activity,
  Layers,
  Search,
} from 'lucide-react';
import { SecurityAlertRecord, AlertFilterState } from '@/types';
import {
  getStoredAlerts,
  setStoredAlerts,
  resetAlertsToDefault,
  clearStoredAlerts,
} from '@/lib/storage';
import { AlertCenterHeader } from '@/components/alerts/AlertCenterHeader';
import { AlertFilters } from '@/components/alerts/AlertFilters';
import { AlertList } from '@/components/alerts/AlertList';
import { AlertTimeline } from '@/components/alerts/AlertTimeline';
import { AlertDetailDrawer } from '@/components/alerts/AlertDetailDrawer';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<SecurityAlertRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlertRecord | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'timeline'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [filters, setFilters] = useState<AlertFilterState>({
    search: '',
    severity: 'ALL',
    status: 'ALL',
    threatType: 'ALL',
  });

  // Load from localStorage on mount
  useEffect(() => {
    const loaded = getStoredAlerts();
    setAlerts(loaded);
    setIsLoaded(true);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync to storage
  const updateAlerts = (newAlerts: SecurityAlertRecord[], toastMsg?: string) => {
    setAlerts(newAlerts);
    setStoredAlerts(newAlerts);
    if (toastMsg) showToast(toastMsg);
  };

  const handleAcknowledge = (id: string) => {
    const updated = alerts.map((a) =>
      a.id === id ? { ...a, status: 'ACKNOWLEDGED' as const } : a
    );
    updateAlerts(updated, `Alert ${id} marked as ACKNOWLEDGED — DEMO`);
    if (selectedAlert?.id === id) {
      setSelectedAlert({ ...selectedAlert, status: 'ACKNOWLEDGED' });
    }
  };

  const handleResolve = (id: string) => {
    const updated = alerts.map((a) =>
      a.id === id ? { ...a, status: 'RESOLVED' as const } : a
    );
    updateAlerts(updated, `Alert ${id} resolved — DEMO`);
    if (selectedAlert?.id === id) {
      setSelectedAlert({ ...selectedAlert, status: 'RESOLVED' });
    }
  };

  const handleDismiss = (id: string) => {
    const updated = alerts.filter((a) => a.id !== id);
    updateAlerts(updated, `Alert ${id} dismissed from feed — DEMO`);
    if (selectedAlert?.id === id) {
      setSelectedAlert(null);
    }
  };

  const handleMarkAllRead = () => {
    const updated = alerts.map((a) =>
      a.status === 'NEW' ? { ...a, status: 'ACKNOWLEDGED' as const } : a
    );
    updateAlerts(updated, 'All alerts acknowledged — DEMO');
  };

  const handleClearAlerts = () => {
    clearStoredAlerts();
    setAlerts([]);
    setSelectedAlert(null);
    showToast('All demo alerts cleared');
  };

  const handleResetDefault = () => {
    const resetList = resetAlertsToDefault();
    setAlerts(resetList);
    setSelectedAlert(null);
    showToast('Restored default demo alerts');
  };

  // Filtered alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      // Search
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchTitle = a.title.toLowerCase().includes(query);
        const matchId = a.id.toLowerCase().includes(query);
        const matchType = a.threatType.toLowerCase().includes(query);
        const matchExplanation = (a.shortExplanation || a.explanation || '')
          .toLowerCase()
          .includes(query);
        if (!matchTitle && !matchId && !matchType && !matchExplanation) return false;
      }

      // Severity
      if (filters.severity !== 'ALL' && a.severity !== filters.severity) {
        return false;
      }

      // Status
      if (filters.status !== 'ALL' && a.status !== filters.status) {
        return false;
      }

      // Threat Type
      if (filters.threatType !== 'ALL' && a.threatType !== filters.threatType) {
        return false;
      }

      return true;
    });
  }, [alerts, filters]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: alerts.length,
      critical: alerts.filter((a) => a.severity === 'CRITICAL').length,
      high: alerts.filter((a) => a.severity === 'HIGH').length,
      medium: alerts.filter((a) => a.severity === 'MEDIUM').length,
      low: alerts.filter((a) => a.severity === 'LOW').length,
      unresolved: alerts.filter((a) => a.status === 'NEW' || a.status === 'ACKNOWLEDGED').length,
      resolved: alerts.filter((a) => a.status === 'RESOLVED').length,
    };
  }, [alerts]);

  return (
    <div className="min-h-screen pb-20 pt-6 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-8 z-50 bg-slate-900/95 border border-cyan-500/40 text-cyan-300 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-xl flex items-center gap-3 text-sm font-mono"
          >
            <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <AlertCenterHeader
        alerts={alerts}
        onMarkAllRead={handleMarkAllRead}
        onSeedDefaults={handleResetDefault}
        onClearAll={handleClearAlerts}
      />

      {/* View Mode & Filter Controls */}
      <div className="mt-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-slate-900/70 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewMode('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all ${
              viewMode === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-md font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Alert Grid ({filteredAlerts.length})</span>
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all ${
              viewMode === 'timeline'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-md font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>SOC Timeline</span>
          </button>
        </div>

        <AlertFilters
          searchQuery={filters.search}
          onChangeSearchQuery={(search) => setFilters((prev) => ({ ...prev, search }))}
          severityFilter={filters.severity}
          onChangeSeverityFilter={(severity) => setFilters((prev) => ({ ...prev, severity }))}
          statusFilter={filters.status}
          onChangeStatusFilter={(status) => setFilters((prev) => ({ ...prev, status }))}
        />
      </div>

      {/* Main Content Area */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {viewMode === 'all' ? (
          <>
            <div className="lg:col-span-8">
              <AlertList
                alerts={filteredAlerts}
                onSelectAlert={setSelectedAlert}
                onAcknowledge={handleAcknowledge}
                onResolve={handleResolve}
                onDismiss={handleDismiss}
                onResetFilters={() =>
                  setFilters({ search: '', severity: 'ALL', status: 'ALL', threatType: 'ALL' })
                }
              />
            </div>
            <div className="lg:col-span-4 sticky top-24">
              <AlertTimeline
                alerts={filteredAlerts.slice(0, 5)}
                onSelectAlert={setSelectedAlert}
              />
            </div>
          </>
        ) : (
          <div className="lg:col-span-12">
            <AlertTimeline
              alerts={filteredAlerts}
              onSelectAlert={setSelectedAlert}
            />
          </div>
        )}
      </div>

      {/* Alert Detail Drawer Modal */}
      <AnimatePresence>
        {selectedAlert && (
          <AlertDetailDrawer
            alert={selectedAlert}
            onClose={() => setSelectedAlert(null)}
            onAcknowledge={handleAcknowledge}
            onResolve={handleResolve}
            onDismiss={handleDismiss}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

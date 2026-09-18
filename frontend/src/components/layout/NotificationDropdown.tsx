'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, ShieldAlert, Cpu, FileText, CheckCircle2, X } from 'lucide-react';
import { DEMO_NOTIFICATIONS } from '@/lib/demo-data';
import { NotificationItem } from '@/types';
import { Badge } from '@/components/ui/Badge';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(DEMO_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const getIcon = (type: string, threatLevel?: string) => {
    if (type === 'threat' || threatLevel === 'adversarial' || threatLevel === 'phishing') {
      return <ShieldAlert className="w-4 h-4 text-cyber-danger" />;
    }
    if (type === 'model') {
      return <Cpu className="w-4 h-4 text-cyber-cyan" />;
    }
    return <FileText className="w-4 h-4 text-primary-bright" />;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-surface/95 border border-border shadow-2xl backdrop-blur-2xl z-50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/80 bg-surface-2/60">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-text uppercase tracking-wider font-mono">
              Notifications
            </span>
            {unreadCount > 0 && (
              <Badge variant="danger" size="sm">
                {unreadCount} NEW
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[10px] font-mono text-cyber-cyan hover:underline flex items-center gap-1"
              >
                <CheckCheck className="w-3 h-3" /> Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-md text-text-muted hover:text-text hover:bg-surface-3"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-border/40 p-1">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-xs text-text-muted">
              No active security notifications.
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleRead(item.id)}
                className={`p-3 rounded-xl cursor-pointer transition-colors ${
                  !item.isRead
                    ? 'bg-primary/10 hover:bg-primary/15'
                    : 'hover:bg-surface-2/60 opacity-85'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-lg bg-surface-2 border border-border mt-0.5 flex-shrink-0">
                    {getIcon(item.type, item.threatLevel)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p className={`text-xs font-semibold truncate ${!item.isRead ? 'text-text font-bold' : 'text-text-muted'}`}>
                        {item.title}
                      </p>
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-cyber-cyan flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-text-muted leading-relaxed line-clamp-2">
                      {item.message}
                    </p>
                    <span className="text-[9px] font-mono text-text-muted/70 mt-1 block">
                      {item.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-surface-2/70 border-t border-border/80 text-[10px] font-mono text-center text-text-muted">
          <span>Security Alert Stream • Phase 2 Simulation</span>
        </div>
      </div>
    </AnimatePresence>
  );
};

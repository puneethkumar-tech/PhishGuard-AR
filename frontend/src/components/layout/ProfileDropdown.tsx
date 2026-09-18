'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LayoutDashboard, Shield, LogOut, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  if (!isOpen) return null;

  const handleSignOut = () => {
    try {
      localStorage.removeItem('phishguard-demo-auth');
    } catch {
      // ignore
    }
    onClose();
    router.push('/login');
  };

  return (
    <AnimatePresence>
      <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-surface/95 border border-border shadow-2xl backdrop-blur-2xl z-50 overflow-hidden">
        {/* User Card Header */}
        <div className="p-4 border-b border-border/80 bg-surface-2/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-dark to-primary border border-primary-bright/40 flex items-center justify-center text-white shadow-glass">
              <User className="w-5 h-5 text-cyber-cyan" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-text truncate">SecOps Admin</h4>
              <p className="text-[11px] text-text-muted truncate">admin@phishguard.ar</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-success" />
                <span className="text-[10px] font-mono text-cyber-success font-semibold">
                  SOC Active Guard
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="p-2 space-y-1 text-xs">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-text-muted hover:text-text hover:bg-surface-2/80 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4 text-primary-bright" />
            <span>SOC Telemetry</span>
          </Link>

          <Link
            href="/settings"
            onClick={onClose}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-text-muted hover:text-text hover:bg-surface-2/80 transition-colors"
          >
            <Settings className="w-4 h-4 text-cyber-cyan" />
            <span>Platform Settings</span>
          </Link>

          <div className="pt-1 border-t border-border/60">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-cyber-danger hover:bg-cyber-danger/10 transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Simulate Sign Out</span>
            </button>
          </div>
        </div>

        <div className="px-4 py-1.5 bg-surface-2/40 border-t border-border/60 text-[9px] font-mono text-center text-text-muted">
          Role: Enterprise SOC Administrator (Phase 4 Demo)
        </div>
      </div>
    </AnimatePresence>
  );
};

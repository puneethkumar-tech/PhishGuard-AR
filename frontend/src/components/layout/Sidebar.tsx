'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Shield,
  Search,
  FlaskConical,
  LayoutDashboard,
  History,
  FileText,
  Settings,
  Activity,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { NAV_SECTIONS } from '@/lib/constants';

const ICON_MAP: Record<string, React.ReactNode> = {
  Shield: <Shield className="w-4 h-4" />,
  Search: <Search className="w-4 h-4" />,
  FlaskConical: <FlaskConical className="w-4 h-4" />,
  LayoutDashboard: <LayoutDashboard className="w-4 h-4" />,
  History: <History className="w-4 h-4" />,
  FileText: <FileText className="w-4 h-4" />,
  Settings: <Settings className="w-4 h-4" />,
};

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const pathname = usePathname();

  // Close on Escape key for mobile
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll on mobile open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/85 backdrop-blur-md z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-[72px] left-0 h-[calc(100vh-72px)] z-40 bg-surface/95 lg:bg-surface/60 backdrop-blur-xl border-r border-border/80 flex flex-col justify-between p-3.5 transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-[76px]' : 'lg:w-72'}`}
      >
        {/* Navigation Sections */}
        <div className="space-y-4 overflow-y-auto overflow-x-hidden pr-0.5">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted/70">
                  {section.title}
                </div>
              )}

              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const icon = ICON_MAP[item.icon] || <Shield className="w-4 h-4" />;

                return (
                  <div key={item.href} className="relative group">
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`relative flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 ${
                        isCollapsed ? 'justify-center' : ''
                      } ${
                        isActive
                          ? 'bg-gradient-to-r from-primary/25 via-surface-2 to-surface-2 border border-primary-bright/40 shadow-glass-glow text-white'
                          : 'text-text-muted hover:text-text hover:bg-surface-2/60 border border-transparent'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="sidebarActiveIndicator"
                          className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-cyber-cyan shadow-cyan-glow"
                          transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                        />
                      )}

                      <div
                        className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                          isActive
                            ? 'bg-primary text-white shadow-glass-glow'
                            : 'bg-surface-2 text-text-muted group-hover:text-primary-bright group-hover:bg-surface-3'
                        }`}
                      >
                        {icon}
                      </div>

                      {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wide truncate">
                              {item.name}
                            </span>
                            <ChevronRight
                              className={`w-3 h-3 transition-transform opacity-0 group-hover:opacity-100 ${
                                isActive ? 'opacity-100 text-cyber-cyan' : 'text-text-muted'
                              }`}
                            />
                          </div>
                          <p className="text-[10px] text-text-muted/80 truncate mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      )}
                    </Link>

                    {/* Tooltip for Collapsed Mode */}
                    {isCollapsed && (
                      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 hidden lg:group-hover:block z-50 pointer-events-none">
                        <div className="px-3 py-2 rounded-xl bg-surface border border-border text-xs text-text shadow-2xl backdrop-blur-xl whitespace-nowrap">
                          <p className="font-bold text-cyber-cyan">{item.name}</p>
                          <p className="text-[10px] text-text-muted">{item.description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom Section: AI Status & Collapse Button */}
        <div className="pt-3 border-t border-border/70 space-y-2">
          {/* AI Status Card */}
          {!isCollapsed ? (
            <div className="p-3 rounded-xl bg-gradient-to-br from-surface-2/90 to-surface-3/60 border border-primary-bright/20 shadow-glass relative overflow-hidden">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-text font-semibold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyber-cyan" />
                  Real-time Protection
                </span>
                <span className="px-1.5 py-0.2 rounded text-[8px] font-mono bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30 font-bold">
                  ACTIVE
                </span>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-text-muted">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-success"></span>
                </span>
                <span>AI security engine active</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center p-2 rounded-xl bg-surface-2 border border-border/60 group relative">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyber-success"></span>
              </span>
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 hidden lg:group-hover:block z-50 pointer-events-none">
                <div className="px-2.5 py-1.5 rounded-lg bg-surface border border-border text-[10px] font-mono text-text shadow-glass whitespace-nowrap">
                  Real-time Protection Active
                </div>
              </div>
            </div>
          )}

          {/* Desktop Collapse / Expand Button */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex w-full items-center justify-center p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface-2/80 transition-colors border border-transparent hover:border-border/60"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-cyber-cyan" />
              ) : (
                <div className="flex items-center justify-between w-full px-2 text-[11px] font-mono text-text-muted">
                  <span>Collapse Navigation</span>
                  <PanelLeftClose className="w-4 h-4" />
                </div>
              )}
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

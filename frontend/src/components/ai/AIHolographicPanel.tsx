'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AIHolographicPanelProps {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  badge?: string;
  badgeColor?: 'cyan' | 'violet' | 'emerald' | 'amber' | 'rose';
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export const AIHolographicPanel: React.FC<AIHolographicPanelProps> = ({
  title,
  subtitle,
  icon: Icon,
  badge,
  badgeColor = 'cyan',
  children,
  className = '',
  headerAction,
}) => {
  const badgeColorClasses = {
    cyan: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
    violet: 'bg-violet-500/10 border-violet-500/30 text-violet-300',
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    rose: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
  }[badgeColor];

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-cyan-500/20 bg-slate-950/80 backdrop-blur-md shadow-[0_0_25px_rgba(6,182,212,0.06)] transition-all duration-300 hover:border-cyan-500/35 ${className}`}
    >
      {/* Corner cyber accent brackets */}
      <div className="pointer-events-none absolute -top-px -left-px h-3 w-3 border-t-2 border-l-2 border-cyan-400/60" />
      <div className="pointer-events-none absolute -top-px -right-px h-3 w-3 border-t-2 border-r-2 border-cyan-400/60" />
      <div className="pointer-events-none absolute -bottom-px -left-px h-3 w-3 border-b-2 border-l-2 border-cyan-400/60" />
      <div className="pointer-events-none absolute -bottom-px -right-px h-3 w-3 border-b-2 border-r-2 border-cyan-400/60" />

      {/* Subtle scanline effect */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.25)_51%)] bg-[length:100%_4px] opacity-20" />

      {/* Header if title or icon provided */}
      {(title || Icon || badge || headerAction) && (
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/15 bg-slate-900/40 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2.5">
            {Icon && (
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                <Icon className="h-4 w-4" />
              </div>
            )}
            <div>
              {title && (
                <h3 className="font-mono text-sm font-semibold tracking-wider text-slate-100 uppercase">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-slate-400">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {badge && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider uppercase ${badgeColorClasses}`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                {badge}
              </span>
            )}
            {headerAction}
          </div>
        </div>
      )}

      {/* Main content body */}
      <div className="relative z-10 p-4 sm:p-5">{children}</div>
    </div>
  );
};

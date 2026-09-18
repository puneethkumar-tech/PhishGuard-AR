'use client';

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumbs } from './Breadcrumbs';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  statusBadge?: {
    label: string;
    variant?: 'primary' | 'cyan' | 'violet' | 'success' | 'warning' | 'danger' | 'demo' | 'outline';
    dot?: boolean;
  };
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  eyebrow,
  title,
  description,
  statusBadge,
  actions,
  children,
  className = '',
}) => {
  return (
    <div className={`space-y-4 mb-6 ${className}`}>
      <Breadcrumbs />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 sm:p-7 rounded-2xl bg-surface/70 border border-border/80 backdrop-blur-xl shadow-glass relative overflow-hidden">
        {/* Subtle background gradient glow */}
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />

        <div className="space-y-1.5 z-10 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-widest text-cyber-cyan uppercase">
              {eyebrow}
            </span>
            {statusBadge && (
              <Badge
                variant={statusBadge.variant || 'cyan'}
                size="sm"
                dot={statusBadge.dot !== false}
              >
                {statusBadge.label}
              </Badge>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text">
            {title}
          </h1>

          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            {description}
          </p>
        </div>

        {actions && <div className="flex items-center gap-3 z-10">{actions}</div>}
      </div>

      {children}
    </div>
  );
};
